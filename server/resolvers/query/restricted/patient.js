import { Patient } from '../../../models';
import logger from '../../../logger';

function patients() {
	return new Promise((resolve, reject) => {
		Patient.find({}, (err, patients) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patients);
		});
	});
}

export { patients };
