import { Recall } from '../../../models';
import logger from '../../../logger';
import shuffle from 'lodash/shuffle';

function recalls(obj, args) {
	return new Promise((resolve, reject) => {
		const questions = Recall.find();
		// Gather arguments from query
		const keys = Object.keys(args);
		keys.filter((k) => ['topic'].indexOf(k) > -1).forEach((k) => questions.where(k).in(args[k]));
		if (args.category) {
			if (args.category[0] !== null) { questions.where('category').in(args.category); }
		}
		return questions.exec((err, recalls) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (recalls) {
				recalls = shuffle(recalls);
				return args.limit ? resolve(recalls.slice(0, args.limit)) : resolve(recalls);
			} else {
				reject('Internal server error.');
			}
		});
	});
}

export { recalls };
