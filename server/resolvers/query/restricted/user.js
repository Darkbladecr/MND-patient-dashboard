import { User } from '../../../models';
import logger from '../../../logger';

function user(obj) {
	return new Promise((resolve, reject) => {
		User.findById(obj._id, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(user);
		});
	});
}

export { user };
