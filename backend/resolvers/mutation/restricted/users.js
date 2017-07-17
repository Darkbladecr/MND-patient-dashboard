const { User } = require('../../../models');

function resetPasswordPrep(obj) {
	// TODO need to update reset password
	return new Promise((resolve, reject) => {
		return resolve('Check your email to reset your password');
	});
}

function resetPassword(obj, args) {
	return new Promise((resolve, reject) => {
		if (args.key === obj._id) {
			User.findOne({ _id: obj._id }, (err, user) => {
				if (err) {
					return reject(err);
				} else {
					user.setPassword(args.password);
					user.save(err => {
						if (err) {
							return reject(err);
						} else {
							return resolve(
								'Password updated, you can now login.'
							);
						}
					});
				}
			});
		} else {
			return reject('Bad request');
		}
	});
}

function updateUser(obj, args) {
	return new Promise((resolve, reject) => {
		let password;
		let oldPassword;
		if ('oldPassword' in args.data) {
			oldPassword = args.data.oldPassword;
			delete args.data.oldPassword;
		}
		if ('password' in args.data) {
			password = args.data.password;
			delete args.data.password;
		}
		User.update(
			{ _id: obj._id },
			args.data,
			{},
			(err, numReplaced, user) => {
				if (err) {
					return reject(err);
				}
				if (user) {
					if (password && oldPassword) {
						if (user.validPassword(oldPassword)) {
							user.setPassword(password);
						} else {
							return reject('Incorrect current password');
						}
					}
					user.updateLastActivity();
					user.save((err, updatedUser) => {
						if (err) {
							return reject(err);
						}
						if (updatedUser) {
							return resolve(updatedUser.generateJWT(1));
						}
					});
				} else {
					reject('No user found.');
				}
			}
		);
	});
}

module.exports = { resetPasswordPrep, resetPassword, updateUser };