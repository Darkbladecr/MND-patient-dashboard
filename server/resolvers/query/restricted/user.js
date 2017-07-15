import { User } from '../../../models';
import logger from '../../../logger';

function user({ _id }) {
	return new Promise((resolve, reject) => {
		User.findOne({ _id }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(user);
		});
	});
}

export { user };
