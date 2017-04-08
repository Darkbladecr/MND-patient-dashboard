import { Question } from '../../../models';
import logger from '../../../logger';

function addQuestion(obj, args) {
	return new Promise((resolve, reject) => {
		const question = new Question(args.data);
		question.save((err, question) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(question);
		});
	});
}

function editQuestion(obj, args) {
	return new Promise((resolve, reject) => {
		const unset = { $unset: {} };
		if (args.data.concept === null) {
			unset.$unset.concept = 1;
			delete args.data.concept;
		}
		const update = !Object.keys(unset.$unset).length ? args.data :
			Object.assign({}, { $set: args.data }, unset);
		Question.findByIdAndUpdate(args._id, update, { new: true }, (err, question) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (question) {
				return resolve(question);
			} else {
				reject('Internal server error.');
			}
		});
	});
}

function deleteQuestion(obj, args) {
	return new Promise((resolve, reject) => {
		if (obj.accessLevel === 'administrator' || obj.accessLevel === 'author') {
			Question.findByIdAndRemove(args._id, (err) => {
				return err ? reject(err) : resolve('Question deleted.');
			});
		} else {
			reject('Unauthorized.');
		}
	});
}

export { addQuestion, editQuestion, deleteQuestion };
