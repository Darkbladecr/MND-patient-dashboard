import { Patient, User } from '../../../models';
import logger from '../../../logger';

function createPatient(obj, args) {
	return new Promise((resolve, reject) => {
		const patient = new Patient(args.data);
		patient.save((err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			User.findByIdAndUpdate(obj._id, { patients: { $addToSet: patient._id } }, err => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(patient);
			});
		});
	});
}

function addAppointment(obj, args) {
	return new Promise((resolve, reject) => {
		Patient.findByIdAndUpdate(args._id, { appointments: { $addToSet: args.appointment } }, { new: true }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		})
	});
}

export { createPatient, addAppointment };
