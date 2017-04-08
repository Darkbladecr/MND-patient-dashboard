import { TempUser, User } from '../../models';
import { activationEmail, registrationEmail } from '../../mailResponses';

import logger from '../../logger';
import request from 'request';


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
						logger.debug('Sending Registration Email');
						return activationEmail(user).then(() => resolve(user),
							(err) => reject(err));
					}
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

export { registerUser, activateUser, loginUser };
