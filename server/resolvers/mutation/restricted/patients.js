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

function addAppointment(obj, {patientId, appointment}) {
	return new Promise((resolve, reject) => {
		Patient.findByIdAndUpdate(patientId, { $addToSet: { appointments: appointment } }, { new: true }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		})
	});
}

function updateAppointment(obj, {patientId, appointment}) {
	return new Promise((resolve, reject) => {
		Patient.findById(patientId, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			patient.appointments.map(a => {
				// TODO figure out how to update appointment
				return a;
			})
			return resolve(patient);
		})
	});
}

export { createPatient, updatePatient, addAppointment, updateAppointment };
