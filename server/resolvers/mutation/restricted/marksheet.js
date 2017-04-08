import { Question, Marksheet, User } from '../../../models';
import logger from '../../../logger';
import { questions } from '../../query/restricted/questions';
import { user } from '../../query/admin/users';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import shuffle from 'lodash/shuffle';

function preBuildTest(obj, args) {
	return new Promise((resolve, reject) => {
		questions(obj, args).then((questions) => {
			const ids = questions.map(e => e._id.toString());
			logger.debug(ids);
			const topics = new Set(questions.map((e) => e.topic.toString()));

			user(obj, { _id: obj._id }).then(user => {
				const completedQuestions = user.completedQuestions.map(e => e.toString());
				const completedCorrectQuestions = user.completedCorrectQuestions.map(e => e.toString());
				logger.debug(completedQuestions);
				logger.debug(completedCorrectQuestions);
				const unseen = difference(ids, completedQuestions);
				const seen = intersection(ids, completedQuestions);
				const seenIncorrect = difference(seen, completedCorrectQuestions);
				const seenCorrect = intersection(seen, completedCorrectQuestions);

				const result = {
					questions: shuffle(ids),
					topics: [...topics],
					categories: args.category,
					unseen,
					seenCorrect,
					seenIncorrect
				};
				return resolve(result);
			});
		}, (err) => {
			logger.error(err);
			return reject(err);
		});
	});
}

function buildTest(obj, args) {
	return new Promise((resolve, reject) => {
		const marksheet = {
			createdBy: obj._id,
			topics: args.topics,
			categories: args.categories,
			questions: args.questions
		};
		Marksheet.create(marksheet, (err, marksheet) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(marksheet);
		});
	});
}

function upvoteChoice(obj, args) {
	return new Promise((resolve, reject) => {
		Question.findById(args._id, (err, question) => {
			// question.upvote(args.label);
			let i = question.choices.findIndex(option => option.label === args.label);
			question.choices[i].votes += 1;
			question.save((err) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				if (question.choices[i].answer) {
					User.findByIdAndUpdate(obj._id, {
						$addToSet: {
							completedQuestions: question._id,
							completedCorrectQuestions: question._id
						}
					}, { new: true }, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						return resolve('Question choice upvoted.');
					});
				} else {
					User.findByIdAndUpdate(obj._id, {
						$addToSet: {
							completedQuestions: question._id
						}
					}, { new: true }, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						return resolve('Question choice upvoted.');
					});
				}
			});
		});
	});
}

function saveMarksheet(obj, args) {
	return new Promise((resolve, reject) => {
		Marksheet.findByIdAndUpdate(args._id, args.marksheet, (err, marksheet) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(marksheet);
		});
	});
}

export { preBuildTest, buildTest, upvoteChoice, saveMarksheet };
