import { Patient, User } from '../../../models';
import logger from '../../../logger';

function createPatient(obj, { patient }) {
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

function updatePatient(obj, { patient }) {
	return new Promise((resolve, reject) => {
		const _id = patient._id;
		delete patient._id;
		Patient.findByIdAndUpdate(_id, patient, { new: true }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

function deletePatient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.findByIdAndRemove(_id, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

function addAppointment(obj, { patientId, appointment }) {
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

function updateAppointment(obj, { appointment }) {
	return new Promise((resolve, reject) => {
		appointment.weight = appointment.weight * 100;
		Patient.findOneAndUpdate({ 'appointments._id': appointment._id }, {
			$set: {
				'appointments.$': appointment
			}
		}, { new: true }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

// const appointment = {
// 	"clinicDate": "2017-04-11T23:00:00.000Z",
// 	"weight": 6420,
// 	"alsfrs": { "speech": 3, "salivation": 3, "swallowing": 2, "handwriting": 3, "cutting": 3, "dressing": 3, "turning": 3, "walking": 3, "climbing": 3, "dyspnea": 3, "orthopnea": 3, "respiratory": 2, "total": 34 },
// 	"ess": { "sittingAndReading": null, "watching": null, "sittingInactive": null, "carPassenger": null, "lyingDown": null, "sittingAndTalking": null, "sittingAfterLunch": null, "carTraffic": null, "total": null },
// 	"fvc": { "sitting": 81, "supine": 82 },
// 	"snp": 46,
// 	"spO2": 97,
// 	"abg": { "pH": 0, "pO2": 0, "pCO2": 0 }
// };
//
// Patient.findOneAndUpdate({ "appointments._id": "58ee9b53ae149941319e612f" }, {
// 	$set: {
// 		'appointments.$': appointment
// 	}
// }, { new: true }, (err, p) => {
// 	console.log(p.appointments);
// });

function deleteAppointment(obj, { appointmentId }) {
	return new Promise((resolve, reject) => {
		Patient.findOneAndUpdate({ 'appointments._id': appointmentId }, {
			$pull: { 'appointments._id': appointmentId }
		}, { new: true }, (err, patient) => {
			if (err) {
				logger.error(err);
				return reject(err);
			}
			return resolve(patient);
		})
	});
}

export { createPatient, updatePatient, deletePatient, addAppointment, updateAppointment, deleteAppointment };
