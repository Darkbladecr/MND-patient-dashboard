import { User } from '../../../models';
import logger from '../../../logger';

function user({ _id }) {
	return new Promise((resolve, reject) => {
		User.findOne({ _id }).then(
			user => resolve(user),
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

export { user };
