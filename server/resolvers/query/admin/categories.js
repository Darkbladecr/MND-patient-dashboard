import { Category } from '../../../models';
import logger from '../../../logger';

function category(obj, args) {
	return new Promise((resolve, reject) => {
		Category.findById(args._id).exec((err, category) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (category) {
				return resolve(category);
			}
		});
	});
}

function categories() {
	return new Promise((resolve, reject) => {
		Category.find({}).sort('name').exec((err, categories) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (categories) {
				return resolve(categories);
			}
		});
	});
}
export { category, categories };
