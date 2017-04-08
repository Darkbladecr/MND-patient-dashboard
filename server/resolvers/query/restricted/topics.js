import { Topic } from '../../../models';
import logger from '../../../logger';

function topic(obj, args) {
	return new Promise((resolve, reject) => {
		Topic.findById(args._id).exec((err, topic) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (topic) {
				return resolve(topic);
			}
		});
	});
}

function topics() {
	return new Promise((resolve, reject) => {
		Topic.find({}).sort('name').exec((err, topics) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (topics) {
				return resolve(topics);
			}
		});
	});
}
export { topic, topics };
