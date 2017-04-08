import { User } from '../../../models';
import crypto from 'crypto';
import logger from '../../../logger';
import request from 'request';
import { resetEmail } from '../../../mailResponses';

function resetPasswordPrep(obj) {
	return new Promise((resolve, reject) => {
		return resetEmail(obj).then(() => resolve('Check your email to reset your password'),
			(err) => reject(err));
	});
}

function resetPassword(obj, args) {
	return new Promise((resolve, reject) => {
		if (args.key === obj._id) {
			User.findById(obj._id, (err, user) => {
				if (err) {
					logger.error(err);
					return reject(err);
				} else {
					user.setPassword(args.password);
					user.save((err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						} else {
							return resolve('Password updated, you can now login.');
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
		let _id = obj._id;
		if (args._id) {
			if (obj.accessLevel === 'administrator') {
				_id = args._id;
			} else {
				return reject('Not Authroized');
			}
		}
		User.findByIdAndUpdate(_id, args.data, { new: true }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (user) {
				if (password && oldPassword) {
					if(user.validPassword(oldPassword)){
						user.setPassword(password);
					} else {
						return reject('Incorrect current password');
					}
				}
				user.updateLastActivity();
				user.save((err, updatedUser) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (updatedUser) {
						const md5hash = crypto.createHash('md5');
						const md5email = md5hash.update(updatedUser.username).digest('hex');
						request({
							uri: `${process.env.MAILCHIMP_URL}/members/${md5email}`,
							method: 'PATCH',
							headers: {
								"Content-Type": "application/json"
							},
							json: {
								email_address: updatedUser.username,
								merge_fields: {
									FNAME: updatedUser.firstName,
									LNAME: updatedUser.lastName
								}
							}
						}, (err) => {
							if (err) {
								logger.error(err);
								return reject(err);
							}
							return resolve(updatedUser.generateJWT(1));
						});
					}
				});
			} else {
				reject('No user found.');
			}
		});
	});
}

function deleteUser(obj, args) {
	return new Promise((resolve, reject) => {
		User.findByIdAndRemove(args._id, (err) => {
			if (err) {
				logger.error(err);
				return reject(err);
			} else {
				return resolve('User deleted.');
			}
		});
	});
}

export { resetPasswordPrep, resetPassword, updateUser, deleteUser };
