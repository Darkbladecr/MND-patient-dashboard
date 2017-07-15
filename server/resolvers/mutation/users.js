import { TempUser, User } from '../../models';
import logger from '../../logger';

function registerUser(obj, args) {
	const usernameLowerCase = args.data.username.toLowerCase();
	let password = args.data.password;
	delete args.data.password;

	return new Promise((resolve, reject) => {
		User.findOne({ username: usernameLowerCase }).then(
			user => {
				if (user) {
					reject('Account already created with this username.');
				} else {
					TempUser.findOne({ username: usernameLowerCase }).then(
						user => {
							if (user) {
								reject(
									'Please check your email to activate your account.'
								);
							} else {
								logger.debug(args.data);
								const user = User.create(args.data);
								user.setPassword(password);
								user.save().then(
									user => resolve(user.generateJWT(1)),
									err => {
										logger.error(err);
										return reject(err);
									}
								);
							}
						},
						err => {
							throw err;
						}
					);
				}
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function activateUser(obj, { _id }) {
	return new Promise((resolve, reject) => {
		TempUser.findOne({ _id }).then(
			tempuser => {
				if (!tempuser) {
					const err = 'Bad request, try creating a new account.';
					logger.error(err);
					return reject(err);
				} else {
					User.create({
						username: tempuser.username,
						firstName: tempuser.firstName,
						lastName: tempuser.lastName,
						hash: tempuser.hash,
						salt: tempuser.salt,
					}).then(
						user => {
							if (!user) {
								const err = 'User creation failed';
								throw err;
							} else {
								TempUser.deleteOne({ _id });
								return resolve(user.generateJWT(1));
							}
						},
						err => {
							throw err;
						}
					);
				}
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function loginUser(obj, args) {
	const username = args.username.toLowerCase();
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }).then(
			user => {
				if (user) {
					if (!user.validPassword(args.password)) {
						return reject('Incorrect password.');
					} else {
						user.save(user).then(user => {
							return resolve(user.generateJWT(args.days));
						});
					}
				} else {
					TempUser.findOne({ username: username }).then(
						tempuser => {
							if (tempuser) {
								return reject('Please activate your account.');
							} else {
								return reject('Incorrect username.');
							}
						},
						err => {
							throw err;
						}
					);
				}
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

export { registerUser, activateUser, loginUser };
