import { Todo, Recall, User } from '../../../models';
import logger from '../../../logger';
import shuffle from 'lodash/shuffle';

function buildTodo(obj, { categories }) {
	return new Promise((resolve, reject) => {
		Recall.find().where('category').in(categories).exec((err, recalls) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			const allTopics = recalls.map((e) => e.topic.toString());
			const counts = {};
			allTopics.forEach(t => counts[t] = (counts[t] || 0) + 1);
			const coverage = [];
			Object.keys(counts).forEach(t => {
				coverage.push({
					topic: t,
					num: counts[t]
				});
			});
			logger.debug(coverage);
			const topics = new Set(allTopics);
			logger.debug(topics);
			const finalRecalls = shuffle(recalls.map(e => e._id));
			const todo = {
				createdBy: obj._id,
				topics: [...topics],
				categories: categories,
				recalls: finalRecalls,
				coverage
			};
			Todo.create(todo, (err, todo) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(todo);
			});
		});
	});
}

function supermemo(ef, q) {
	return ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
}

function scoreRecall(obj, { mark }) {
	return new Promise((resolve, reject) => {
		User.findById(obj._id, (err, user) => {
			const i = user.completedRecalls.findIndex((e) => e.recall === mark.recall);
			if (i > -1) {
				const score = supermemo(user.completedRecalls[i].score / 2, mark.score);
				const iteration = mark.score > 3 ? user.completedRecalls[i].iteration + 1 || 1 : 1;
				user.completedRecalls[i] = {
					recall: mark.recall,
					score: score > 1.3 ? (score < 5.0 ? score : 5.0) : 1.3,
					lastSeen: Date.now(),
					iteration
				}
			} else {
				user.completedRecalls.push({
					recall: mark.recall,
					score: supermemo(2.5, mark.score),
					lastSeen: Date.now(),
					iteration: 1
				});
			}
			user.save((err) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve('Recall score saved.');
			});
		});
	});
}

function saveTodo(obj, { _id, todo }) {
	return new Promise((resolve, reject) => {
		Todo.findByIdAndUpdate(_id, todo, (err, todo) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(todo);
		});
	});
}

export { buildTodo, scoreRecall, saveTodo };
