import { Question } from '../../../models';
import logger from '../../../logger';
import shuffle from 'lodash/shuffle';

function questions(obj, args) {
	return new Promise((resolve, reject) => {
		const questions = Question.find();
		// Gather arguments from query
		const keys = Object.keys(args);
		keys.filter((k) => ['topic'].indexOf(k) > -1).forEach((k) => questions.where(k).in(args[k]));
		if (args.category) {
			if (args.category[0] !== null) { questions.where('category').in(args.category); }
		}
		return questions.exec((err, questions) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (questions) {
				questions = shuffle(questions.map((e) => {
					e.choices = shuffle(e.choices);
					return e;
				}));
				return args.limit ? resolve(questions.slice(0, args.limit)) : resolve(questions);
			} else {
				reject('Internal server error.');
			}
		});
	});
}

export { questions };
