import schedule from 'node-schedule';
import { User, Recall, Todo } from './models';
import logger from './logger';
import shuffle from 'lodash/shuffle';
import fmt from 'fmt-obj';
import request from 'request';

function createTasks() {
	logger.info('Running DailyTasks() @ ' + new Date);
	return User.find({
		"completedRecalls": { "$exists": true },
		"$where": "this.completedRecalls.length > 20"
	}).select('_id completedRecalls').exec((err, users) => {
		if (err) {
			return logger.error(err);
		}
		logger.debug(users.map((e) => { return { _id: e._id, username: e.username }; }));
		for (let i = 0; i < users.length; i++) {
			createTodoSuperMemo(users[i]);
		}
	});
}

function supermemoInterval(iter, ef) {
	if (iter === 1) {
		return 1;
	} else if (iter === 2) {
		return 6;
	} else {
		return (iter - 1) * (ef / 2); // EF should be a max of 2.5
	}
}

function createTodoSuperMemo(user) {
	const now = new Date();
	const sortedRecalls = user.completedRecalls.map(e => {
			const lastSeen = new Date(e.lastSeen)
			const reviewDate = lastSeen.setDate(lastSeen.getDate() + supermemoInterval(e.iteration, e.score));
			return {
				recall: e.recall.toString(),
				score: e.score,
				lastSeen: e.lastSeen,
				iteration: e.iteration,
				reviewDate: new Date(reviewDate),
			};
		})
		.sort((a, b) => a.reviewDate - b.reviewDate);
	// User properties
	const recallScores = sortedRecalls.map(e => e.score);
	const priority = {};
	recallScores.forEach(s => {
		const risk = (10 - Math.round((s - 1.3) / (5 - 1.3) * 10)) / 10;
		const riskI = "risk" + (risk * 10).toString();
		priority[riskI] = (priority[riskI] || 0) + 1;
	});
	logger.debug(fmt(priority));

	const filteredRecalls = sortedRecalls.filter(e => e.reviewDate < now).slice(0, 100);
	// logger.debug(fmt(filteredRecalls));

	const green = filteredRecalls.filter(e => e.score >= 4).length;
	const amber = filteredRecalls.filter(e => e.score > 2 && e.score < 4).length;
	const red = filteredRecalls.filter(e => e.score <= 2).length;
	const userScores = { green, amber, red };
	logger.debug(fmt(userScores));

	const recalls = filteredRecalls.map((e) => e.recall);
	logger.debug('#Recalls:', recalls.length);
	logger.debug(fmt(recalls.map(e => e)));
	buildTodo(user, recalls, userScores, priority);
}

function buildTodo(user, recalls, scores, priority) {
	Recall.find().where('_id').in(recalls).exec((err, recalls) => {
		if (err) {
			logger.error(err);
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
		logger.debug(fmt(coverage));
		const topics = new Set(allTopics);
		// logger.debug(fmt(topics));
		const categories = new Set(recalls
			.map(e => e.category)
			.reduce((a, b) => a.concat(b), [])
			.map(e => e.toString()));
		// logger.debug(fmt(categories));
		const finalRecalls = shuffle(recalls.map(e => e._id));
		const todo = {
			createdBy: user._id,
			dailyTask: true,
			topics: [...topics],
			categories: [...categories],
			recalls: finalRecalls,
			coverage
		};
		// logger.debug(fmt(todo));
		Todo.create(todo, (err, todo) => {
			if (err) {
				logger.error(err);
			}
			User.findByIdAndUpdate(user._id, {
				dailyTask: {
					_id: todo._id,
					scores,
					priority
				}
			}, (err) => {
				if (err) {
					logger.error(err);
				}
				return;
			});
		});
	});
}

function resetTestUser() {
	User.findById("58e3e07617f8d7e601100fd4", (err, user) => {
		if (err) {
			logger.error(err);
		} else {
			const password = (Math.random().toString(36) + '00000000000000000').slice(2, 10) + Date.now();
			user.setPassword(password);
			user.save((err) => {
				if (err) {
					logger.error(err);
				} else {
					return request({
						uri: 'https://hooks.slack.com/services/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',
						method: 'POST',
						json: {
							username: 'TestAccount',
							icon_emoji: ':robot_face:',
							text: `My new password is:\n>${password}`,
						}
					});
				}
			});
		}
	});
}

// Runs at midnight everyday
schedule.scheduleJob('00 02 * * *', createTasks);
schedule.scheduleJob('00 00 * * *', resetTestUser);
logger.info('Daily Tasks scheduled to run at 2am everyday');
