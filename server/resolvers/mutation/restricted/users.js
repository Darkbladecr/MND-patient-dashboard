import { User, Question } from '../../../models';
import logger from '../../../logger';
const stripe = require('stripe')(process.env.STRIPE_SECRET);
import fmt from 'fmt-obj';
import mathjs from 'mathjs';

function resetProgress(obj) {
	return new Promise((resolve, reject) => {
		User.findByIdAndUpdate(obj._id, {
			completedQuestions: [],
			completedCorrectQuestions: [],
			completedRecalls: []
		}, { new: true }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(user);
		})
	});
}

function mastery(obj) {
	return new Promise((resolve, reject) => {
		User.find({})
			.select('_id progressReport')
			.exec((err, users) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				const userI = users.findIndex(e => e._id.toString() === obj._id);
				if (userI > -1) {
					const user = users[userI];
					const topicScores = {};
					users.forEach(u => {
						// logger.debug(u._id, u.progressReport.length, ' Progress reports');
						u.progressReport.forEach(r => {
							if (r.topic in topicScores) {
								topicScores[r.topic].scores.push(r.correct);
							} else {
								topicScores[r.topic] = { scores: [r.correct] };
							}
						});
					});
					// logger.debug(fmt(topicScores));
					Object.keys(topicScores).forEach(t => {
						topicScores[t].mean = mathjs.mean(topicScores[t].scores);
						topicScores[t].std = mathjs.std(topicScores[t].scores);
					});
					// logger.debug(fmt(topicScores));
					// logger.info(topicScores["57e24cbb1c498c3a484a1d3b"]);

					const progressReport = user.progressReport.map(e => {
						const topic = e.topic.toString();
						const zScore = (e.correct - topicScores[topic].mean) / topicScores[topic].std;
						return {
							topic: e.topic,
							correct: e.correct,
							answered: e.answered,
							zScore
						};
					});
					logger.debug(fmt(progressReport));
					User.findByIdAndUpdate(obj._id, { progressReport }, { new: true }, (err, user) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						return resolve(user);
					})
				} else {
					return reject('Did not find user');
				}
			});
	});
}
// mastery({ _id: "56e406cdcbbde3030089b2f2" });

function progressReport(obj) {
	return new Promise((resolve, reject) => {
		User.findById(obj._id)
			.populate('completedQuestions completedCorrectQuestions')
			.exec((err, user) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				const topicTotals = {};
				user.completedQuestions.forEach(e => {
					const topic = e.topic.toString();
					if (topic in topicTotals) {
						topicTotals[topic] += 1;
					} else {
						topicTotals[topic] = 1;
					}
				});
				const topicTotalsCorrect = {};
				user.completedCorrectQuestions.forEach(e => {
					const topic = e.topic.toString();
					if (topic in topicTotalsCorrect) {
						topicTotalsCorrect[topic] += 1;
					} else {
						topicTotalsCorrect[topic] = 1;
					}
				});
				logger.debug('TopicTotals: ', fmt(topicTotals));
				logger.debug('topicTotalsCorrect: ', fmt(topicTotalsCorrect));

				const report = [];
				const totals = {};
				let itemsProcessed = 0;
				Object.keys(topicTotals).forEach((t, i, array) => {
					const correct = topicTotalsCorrect[t] || 0;
					report.push({
						topic: t,
						correct: Number((correct / topicTotals[t] * 100).toFixed(2))
					});
					Question.count({ topic: t }, (err, count) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						totals[t] = count;
						itemsProcessed++;
						if (itemsProcessed === array.length) {
							logger.debug('db Counts: ', fmt(totals));
							report.map(e => {
								e.answered = Number((topicTotals[t] / totals[e.topic] * 100).toFixed(2));
								// TODO add standardDeviation to progressReport
								return e;
							});
							logger.debug(fmt(report));
							User.findByIdAndUpdate(obj._id, {
								progressReport: report
							}, { new: true }, (err, user) => {
								if (err) {
									logger.error(err);
									return reject(err);
								}
								return resolve(user);
							});
						}
					});
				});
			});
	});
}
// progressReport({_id:"56e406cdcbbde3030089b2f2"});

function addSubscription(obj, { plan }) {
	return new Promise((resolve, reject) => {
		User.findById(obj._id, (err, user) => {
			stripe.customers.retrieve(user.stripe, (err, customer) => {
				if (err) {
					return reject(err);
				}
				const periodEnd = customer.subscriptions.data.reduce((sum, sub) => {
					if (sub.current_period_end > sum) {
						return sub.current_period_end;
					} else {
						return sum;
					}
				}, 0);
				let oneDay = 24 * 60 * 60 * 1000;
				const today = new Date();
				const expires = new Date(periodEnd * 1000);
				let trial_period_days = 0;
				if (expires > today) {
					trial_period_days = Math.round(Math.abs((expires.getTime() - today.getTime()) / (oneDay)));
				}
				stripe.subscriptions.create({
					customer: customer.id,
					plan,
					trial_period_days
				}, (err, subscription) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					User.findByIdAndUpdate(obj._id, {
						activeUntil: new Date(subscription.current_period_end * 1000)
					}, (err) => {
						if (err) {
							logger.error(err);
							return reject(err);
						}
						return resolve(subscription);
					});
				});
			});
		});
	});
}

function reenableSubscription(obj, args) {
	return new Promise((resolve, reject) => {
		stripe.subscriptions.update(args.id, { plan: args.plan }, (err, confirmation) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			User.findByIdAndUpdate(obj._id, { plan: args.plan }, (err) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(confirmation);
			});
		});
	});
}

function cancelSubscription(obj, { id }) {
	return new Promise((resolve, reject) => {
		stripe.subscriptions.del(id, { at_period_end: true }, (err, confirmation) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(confirmation);
		});
	});
}

function updateCard(obj, { stripeToken }) {
	return new Promise((resolve, reject) => {
		User.findById(obj._id, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			stripe.customers.createSource(user.stripe, { source: stripeToken }, (err, card) => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				logger.debug(card);
				stripe.customers.update(user.stripe, { default_source: card.id }, (err) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					return resolve(card);
				});
			});
		});
	});
}

export { resetProgress, progressReport, addSubscription, reenableSubscription, cancelSubscription, updateCard };
