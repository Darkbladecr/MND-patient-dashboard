import { restricted } from '../restricted';
import { User, TempUser } from '../../models';
import logger from '../../logger';

function usernameAvailable(obj, { username }) {
	return new Promise((resolve, reject) => {
		const usernameLowerCase = username.toLowerCase();
		User.findOne({ username: usernameLowerCase }, (err, user) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			if (user) {
				resolve(false);
			} else {
				TempUser.findOne({ username: usernameLowerCase }, (err, user) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					if (user) {
						resolve(false);
					} else {
						resolve(true);
					}
				});
			}
		});
	});
}

const Query = {
	restricted,
	usernameAvailable
};

export default Query;
