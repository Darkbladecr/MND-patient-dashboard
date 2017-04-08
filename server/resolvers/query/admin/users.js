import { User } from '../../../models';
import logger from '../../../logger';

function user(obj, args){
	return new Promise((resolve, reject) => {
		const user = User.findOne();
		const keys = Object.keys(args);
		keys.forEach((k) => user.where(k).equals(args[k]));
		return user.exec((err, user) => {
			if (err) {
				return reject(err);
			}
			return resolve(user);
		});
	});
}

function users(obj, args) {
	return new Promise((resolve, reject) => {
		let users;
		if (args.search) {
			users = User.find({ $text: { $search: args.search } }, { score: { $meta: 'textScore' } });
		} else {
			users = User.find();
		}
		if (args.accessLevel) {
			users.where('accessLevel').equals(args.accessLevel);
		}
		if (args.search) {
			users.sort({ score: { $meta: 'textScore' } });
		}
		return users.exec((err, users) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(users);
		});
	});
}

function authors() {
	return new Promise((resolve, reject) => {
		return User.find()
			.where('accessLevel').in(['administrator', 'author'])
			.exec((err, authors) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(authors);
			});
	});
}

export { user, users, authors };
