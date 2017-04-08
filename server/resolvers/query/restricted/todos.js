import { Todo } from '../../../models';
import logger from '../../../logger';

function todo(obj, args) {
	return new Promise((resolve, reject) => {
		Todo.findById(args._id).exec((err, todo) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (todo) {
				return resolve(todo);
			}
		});
	});
}

function todos(obj, args) {
	return new Promise((resolve, reject) => {
		if ('author' in args) {
			Todo.find()
				.where('createdBy')
				.equals(args.author)
				.sort({ createdAt: -1 })
				.exec((err, todo) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (todo) {
						return resolve(todo);
					}
				});
		} else {
			const now = new Date();
			const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			Todo.find()
				.where('createdBy')
				.equals(obj._id)
				.where('createdAt')
				.gte(startOfToday)
				.sort({ createdAt: -1 })
				.exec((err, todos) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (todos) {
						return resolve(todos);
					}
				})
		}
	});
}
export { todo, todos };
