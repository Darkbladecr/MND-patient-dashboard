import { User } from './index';
import logger from '../logger';

logger.info('Running User clean up');
User.find({}, (err, users) => {
	users.forEach(user => {
		user.completedQuestions = user.completedQuestions.map(e => e.toString());
		user.completedCorrectQuestions = user.completedCorrectQuestions.map(e => e.toString());
		user.completedRecalls = user.completedRecalls.map(e => {
			let score = e.score;
			while (score > 5) {
				score = score / 10;
			}
			return {
				recall: e.recall,
				score,
				lastSeen: e.lastSeen,
				iteration: e.iteration
			};
		});
		user.save();
	});
});
