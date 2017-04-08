import { Recall } from '../../../models';
import logger from '../../../logger';

function recall(obj, args) {
	return new Promise((resolve, reject) => {
		const recall = Recall.findOne();
		// Filter by accessLevel
		switch (obj.accessLevel) {
			case 'administrator':
				break;
			case 'author':
				recall.where('author').equals(obj._id);
				break;
			default:
				reject('Unauthorized.');
		}
		const keys = Object.keys(args);
		keys.forEach((k) => recall.where(k).equals(args[k]));
		return recall.exec().then((recall) => resolve(recall));
	});
}

function recalls(obj, args) {
	return new Promise((resolve, reject) => {
		let recalls;
		// See if to add $search
		if (args.search) {
			recalls = Recall.find({ $text: { $search: args.search } }, { score: { $meta: 'textScore' } });
		} else {
			recalls = Recall.find();
		}
		// Filter by accessLevel
		switch (obj.accessLevel) {
			case 'administrator':
				break;
			case 'author':
				recalls.where('author').equals(obj._id);
				break;
			default:
				reject('Unauthorized.');
		}
		// Gather arguments from query
		const keys = Object.keys(args);
		keys.filter((k) => ['_id', 'topic'].indexOf(k) > -1).forEach((k) => recalls.where(k).in(args[k]));
		if (args.category) {
			if (args.category[0] !== null) { recalls.where('category').in(args.category); }
		}
		keys.filter((k) => ['author'].indexOf(k) > -1 && args[k]).forEach((k) => recalls.where(k).equals(args[k]));
		if (args.search) {
			recalls.sort({ score: { $meta: 'textScore' } });
		}
		return recalls.exec((err, questions) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (questions) {
				return args.limit ? resolve(questions.slice(0, args.limit)) : resolve(questions);
			} else {
				reject('Internal server error.');
			}
		});
	});
}

export { recall, recalls };
