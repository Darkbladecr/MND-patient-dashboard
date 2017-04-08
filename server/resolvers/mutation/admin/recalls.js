import { Recall } from '../../../models';
import logger from '../../../logger';

function addRecall(obj, args) {
	return new Promise((resolve, reject) => {
		const recall = new Recall(args.data);
		recall.save((err, recall) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(recall);
		});
	});
}

function editRecall(obj, args) {
	return new Promise((resolve, reject) => {
		const unset = { $unset: {} };
		if (args.data.concept === null) {
			unset.$unset.concept = 1;
			delete args.data.concept;
		}
		if (args.data.linked_question === null) {
			unset.$unset.linked_question = 1;
			delete args.data.linked_question;
		}
		const update = !Object.keys(unset.$unset).length ? args.data :
			Object.assign({}, { $set: args.data }, unset);
		Recall.findByIdAndUpdate(args._id, update, { new: true }, (err, recall) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (recall) {
				return resolve(recall);
			} else {
				reject('Internal server error.');
			}
		});
	});
}

function deleteRecall(obj, args) {
	return new Promise((resolve, reject) => {
		if (obj.accessLevel === 'administrator' || obj.accessLevel === 'author') {
			Recall.findByIdAndRemove(args._id, (err) => {
				return err ? reject(err) : resolve('Recall deleted.');
			});
		} else {
			reject('Unauthorized.');
		}
	});
}

export { addRecall, editRecall, deleteRecall };
