import { Patient } from '../../../models';
import logger from '../../../logger';

function patient(obj, {_id}){
	return new Promise((resolve, reject) => {
		Patient.findById(_id, (err, patient) => {
			if(err){
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

function patients(obj, {search}) {
	return new Promise((resolve, reject) => {
		const patients = search && search.length > 1 ? Patient.find({ $text: { $search: search } }, { score: { $meta: 'textScore' } }) : Patient.find({});
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
