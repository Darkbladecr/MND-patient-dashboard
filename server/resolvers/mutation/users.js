import { TempUser, User } from '../../models';
import { activationEmail, registrationEmail } from '../../mailResponses';

import logger from '../../logger';
import request from 'request';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

function registerUser(obj, args) {
	const usernameLowerCase = args.data.username.toLowerCase();
	let password = args.data.password;
	delete args.data.password;

	return new Promise((resolve, reject) => {
		User.findOne({ username: usernameLowerCase }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (user) {
				reject('Account already created with this username.');
			} else {
				TempUser.findOne({ username: usernameLowerCase }, (err, user) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (user) {
						reject('Please check your email to activate your account.');
					} else {
						logger.debug(args.data);
						const user = new TempUser(args.data);
						user.setPassword(password);
						logger.debug('TempUser started');
						registerStripeToken(obj, { user }).then((user) => {
							logger.debug('Sending Registration Email');
							return activationEmail(user).then(() => resolve(user),
								(err) => reject(err));
						});
					}
				});
			}
		});
	});
}

function registerStripeToken(obj, { user }) {
	return new Promise((resolve, reject) => {
		logger.debug('registerStripeToken Function');
		stripe.customers.create({
			email: user.username,
			metadata: {
				firstName: user.firstName,
				lastName: user.lastName,
				classYear: user.classYear,
				university: user.university
			}
		}, (err, customer) => {
			if (err) {
				let error = {};
				switch (err.type) {
					case 'StripeCardError':
						// A declined card error
						error.message = err.message; // => e.g. "Your card's expiration year is invalid."
						break;
					case 'RateLimitError':
						// Too many requests made to the API too quickly
						error.message = 'Too many requests made too quickly, try again later.';
						break;
					case 'StripeInvalidRequestError':
						// Invalid parameters were supplied to Stripe's API
						error.message = 'Invalid parameters, please contact support.';
						break;
					case 'StripeAPIError':
						// An error occurred internally with Stripe's API
						error.message = 'Error with our payment provider, try again later.';
						break;
					case 'StripeConnectionError':
						// Some kind of error occurred during the HTTPS communication
						error.message = 'Error with our payment provider, try again later.';
						break;
					case 'StripeAuthenticationError':
						// You probably used an incorrect API key
						error.message = 'Authentication Error, please contact support.';
						break;
					default:
						// Handle any other types of unexpected errors
						error.message = 'Internal Error, please contact support.';
						break;
				}
				logger.error(err);
				return reject(error.message);
			}
			if (!customer) {
				const err = 'Customer creation failed';
				logger.error(err);
				return reject(err);
			} else {
				stripe.customers.createSource(customer.id, { source: user.stripe }, (err, card) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					logger.debug(card);
					stripe.customers.update(customer.id, { default_source: card.id }, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						user.stripe = customer.id;
						user.save((err, user) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							logger.debug(user);
							return resolve(user);
						});
					});
				});
			}
		});
	});
}


function activateUser(obj, args) {
	return new Promise((resolve, reject) => {
		TempUser.findById(args._id, (err, tempuser) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (!tempuser) {
				const err = 'Bad request, try creating a new account.';
				logger.error(err);
				return reject(err);
			} else {
				User.create({
					username: tempuser.username,
					firstName: tempuser.firstName,
					lastName: tempuser.lastName,
					classYear: tempuser.classYear,
					graduationYear: tempuser.graduationYear,
					university: tempuser.university,
					plan: tempuser.plan,
					stripe: tempuser.stripe,
					activeUntil: tempuser.activeUntil,
					accessLevel: tempuser.accessLevel,
					hash: tempuser.hash,
					salt: tempuser.salt,
				}, (err, user) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (!user) {
						const err = 'User creation failed';
						logger.error(err);
						return reject(err);
					} else {
						TempUser.findByIdAndRemove(args._id, (err) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							logger.debug('Stripe Customer Created');
							stripe.subscriptions.create({
								customer: user.stripe,
								plan: user.plan,
							}, (err, subscription) => {
								if (err) {
									logger.error(err);
									return reject(err);
								}
								if (subscription) {
									logger.debug('Stripe Subscription Linked');
									user.stripe = subscription.customer;
									user.activeUntil = new Date(subscription.current_period_end * 1000);
									user.save((err) => {
										if (err) {
											logger.error(err);
											return reject(err);
										}
										request({
											uri: `${process.env.MAILCHIMP_URL}/members`,
											method: 'POST',
											headers: {
												"Content-Type": "application/json"
											},
											json: {
												"email_address": user.username,
												"status": "subscribed",
												"merge_fields": {
													"FNAME": user.firstName,
													"LNAME": user.lastName
												},
												"email_type": "html"
											}
										}, (err) => {
											if (err) {
												logger.error(err);
												return reject(err);
											}
											return registrationEmail(user).then(() =>
												resolve(user.generateJWT(1)),
												(err) => reject(err));
										});
									});
								}
							});
						});
					}
				});
			}
		});
	});
}

function loginUser(obj, args) {
	const username = args.username.toLowerCase();
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (user) {
				if (!user.validPassword(args.password)) {
					return reject('Incorrect password.');
				} else {
					user.updateLastActivity();
					user.save((err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						return resolve(user.generateJWT(args.days));
					});
				}
			} else {
				TempUser.findOne({ username: username }, (err, tempuser) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (tempuser) {
						return reject('Please activate your account.');
					} else {
						return reject('Incorrect username.');
					}
				});
			}
		});
	});
}

export { registerUser, registerStripeToken, activateUser, loginUser };
