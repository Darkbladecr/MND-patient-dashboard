const { TempUser, User } = require('../../models');

function registerUser(obj, args) {
	const usernameLowerCase = args.data.username.toLowerCase();
	let password = args.data.password;
	delete args.data.password;

	return new Promise((resolve, reject) => {
		User.findOne({ username: usernameLowerCase }, (err, user) => {
			if (err) {
				return reject(err);
			}
			if (user) {
				reject('Account already created with this username.');
			} else {
				TempUser.findOne(
					{ username: usernameLowerCase },
					(err, user) => {
						if (err) {
							return reject(err);
						}
						if (user) {
							reject(
								'Please check your email to activate your account.'
							);
						} else {
							const data = Object.assign({}, args.data);
							const user = new User(data);
							user.setPassword(password);
							user.save((err, user) => {
								if (err) {
									return reject(err);
								}
								return resolve(user.generateJWT(1));
							});
						}
					}
				);
			}
		});
	});
}

function activateUser(obj, args) {
	return new Promise((resolve, reject) => {
		TempUser.findOne({ _id: args._id }, (err, tempuser) => {
			if (err) {
				return reject(err);
			}
			if (!tempuser) {
				const err = 'Bad request, try creating a new account.';

				return reject(err);
			} else {
				User.insert(
					{
						username: tempuser.username,
						firstName: tempuser.firstName,
						lastName: tempuser.lastName,
						hash: tempuser.hash,
						salt: tempuser.salt,
					},
					(err, user) => {
						if (err) {
							return reject(err);
						}
						if (!user) {
							const err = 'User creation failed';

							return reject(err);
						} else {
							TempUser.remove({ _id: args._id }, {}, err => {
								if (err) {
									return reject(err);
								}
								return resolve(user.generateJWT(1));
							});
						}
					}
				);
			}
		});
	});
}

function loginUser(obj, args) {
	const username = args.username.toLowerCase();
	return new Promise((resolve, reject) => {
		User.findOne({ username: username }, (err, user) => {
			if (err) {
				return reject(err);
			}
			if (user) {
				if (!user.validPassword(args.password)) {
					return reject('Incorrect password.');
				} else {
					user.updateLastActivity();
					user.save(err => {
						if (err) {
							return reject(err);
						}
						return resolve(user.generateJWT(args.days));
					});
				}
			} else {
				TempUser.findOne({ username: username }, (err, tempuser) => {
					if (err) {
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

module.exports = { registerUser, activateUser, loginUser };
