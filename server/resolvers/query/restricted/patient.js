import { Patient } from '../../../models';
import logger from '../../../logger';

function patient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({ _id }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

function patients(obj, { search }) {
	return new Promise((resolve, reject) => {
		let patients;
		if (search && search.length > 1) {
			const regex = new RegExp(search);
			patients = Patient.find(
				{
					$or: [
						{ firstName: { $regex: regex } },
						{ lastName: { $regex: regex } },
					],
				},
				(err, patients) => {
					if (err) {
						logger.error(err);
						return reject(err);
					}
					return resolve(patients);
				}
			);
		} else {
			patients = Patient.find({});
		}
		patients.exec((err, patients) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patients);
		});
	});
}

export { patient, patients };
