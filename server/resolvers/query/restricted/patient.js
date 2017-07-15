import { Patient } from '../../../models';
import logger from '../../../logger';

function patient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({ _id }).then(
			patient => resolve(patient),
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function patients(obj, { search }) {
	return new Promise((resolve, reject) => {
		Patient.find({}).then(
			patients => {
				if (search && search.length > 1) {
					const regex = new RegExp(search);
					return resolve(
						patients.filter(
							p =>
								regex.test(p.firstName) ||
								regex.test(p.lastName)
						)
					);
				} else {
					resolve(patients);
				}
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

export { patient, patients };
