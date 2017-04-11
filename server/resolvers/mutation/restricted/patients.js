import { Patient, User } from '../../../models';
import logger from '../../../logger';

function createPatient(obj, {patient}) {
	return new Promise((resolve, reject) => {
		new Patient(patient).save((err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			User.findByIdAndUpdate(obj._id, { $addToSet: { patients: patient._id } }, err => {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(patient);
			});
		});
	});
}

function updatePatient(obj, {patient}){
	return new Promise((resolve, reject) => {
		const _id = patient._id;
		delete patient._id;
		Patient.findByIdAndUpdate(_id, patient, {new:true}, (err, patient) => {
			if(err){
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
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

export { createPatient, updatePatient, addAppointment };
