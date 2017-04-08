import { Question } from '../../../models';
import logger from '../../../logger';

function question(obj, args) {
	return new Promise((resolve, reject) => {
		const question = Question.findOne();
		// Filter by accessLevel
		switch (obj.accessLevel) {
			case 'administrator':
				break;
			case 'author':
				question.where('author').equals(obj._id);
				break;
			default:
				reject('Unauthorized.');
		}
		const keys = Object.keys(args);
		keys.forEach((k) => question.where(k).equals(args[k]));
		return question.exec().then((question) => resolve(question));
	});
}

function questions(obj, args) {
	return new Promise((resolve, reject) => {
		let questions;
		// See if to add $search
		if (args.search) {
			questions = Question.find({ $text: { $search: args.search } }, { score: { $meta: 'textScore' } });
		} else {
			questions = Question.find();
		}
		// Filter by accessLevel
		switch (obj.accessLevel) {
			case 'administrator':
				break;
			case 'author':
				questions.where('author').equals(obj._id);
				break;
			default:
				reject('Unauthorized.');
		}
		// Gather arguments from query
		const keys = Object.keys(args);
		keys.filter((k) => ['_id', 'topic'].indexOf(k) > -1).forEach((k) => questions.where(k).in(args[k]));
		if (args.category) {
			if (args.category[0] !== null) { questions.where('category').in(args.category); }
		}
		keys.filter((k) => ['author'].indexOf(k) > -1 && args[k]).forEach((k) => questions.where(k).equals(args[k]));
		if (args.search) {
			questions.sort({ score: { $meta: 'textScore' } });
		}
		return questions.exec((err, questions) => {
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

export { question, questions };
