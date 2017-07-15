import { Patient, Appointment } from '../../../models';
import logger from '../../../logger';

function createPatient(obj, { patient }) {
	return new Promise((resolve, reject) => {
		Patient.create(patient).save().then(
			patient => {
				return resolve(patient);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function updatePatient(obj, { patient }) {
	return new Promise((resolve, reject) => {
		const _id = patient._id;
		delete patient._id;
		Patient.findOneAndUpdate({ _id }, patient).then(
			patient => {
				return resolve(patient);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function deletePatient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.findOneAndDelete({ _id }).then(
			patient => {
				return resolve(patient);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function addAppointment(obj, { patientId, appointment }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({ _id: patientId }).then(
			patient => {
				patient.appointments.push(Appointment.create(appointment));
				patient.save().then(
					patient => resolve(patient),
					err => {
						throw err;
					}
				);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function updateAppointment(obj, { appointment }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({
			'appointments._id': appointment._id,
		}).then(
			patient => {
				patient.appointments = patient.appointments.map(
					a => (a._id === appointment._id ? appointment : a)
				);
				patient.save().then(
					patient => {
						return resolve(patient);
					},
					err => {
						throw err;
					}
				);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

function deleteAppointment(obj, { appointmentId }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({ 'appointments._id': appointmentId }).then(
			patient => {
				patient.appointments = patient.appointments.filter(
					a => a._id !== appointmentId
				);
				patient.save().then(
					patient => resolve(patient),
					err => {
						throw err;
					}
				);
			},
			err => {
				logger.error(err);
				return reject(err);
			}
		);
	});
}

export {
	createPatient,
	updatePatient,
	deletePatient,
	addAppointment,
	updateAppointment,
	deleteAppointment,
};
