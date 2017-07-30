const { Patient, Appointment } = require('../../../models');

function createPatient(obj, args) {
	return new Promise((resolve, reject) => {
		const patient = Object.assign({}, args.patient);
		Patient.insert(patient, (err, patient) => {
			if (err) {
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

function updatePatient(obj, args) {
	return new Promise((resolve, reject) => {
		const _id = args.patient._id;
		delete args.patient._id;
		const patient = Object.assign({}, args.patient);
		Patient.update(
			{ _id },
			{ $set: patient },
			{},
			(err, numReplaced, patient) => {
				if (err) {
					return reject(err);
				}
				return resolve(patient);
			}
		);
	});
}

function deletePatient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.remove({ _id }, {}, err => {
			if (err) {
				return reject(err);
			}
			return resolve({ _id });
		});
	});
}

function addAppointment(obj, { patientId, appointment }) {
	return new Promise((resolve, reject) => {
		const clinic = Object.assign({}, appointment);
		Appointment.insert(clinic, (err, appointment) => {
			if (err) {
				return reject(err);
			}
			Patient.update(
				{ _id: patientId },
				{ $addToSet: { appointments: appointment._id } },
				{},
				(err, numReplaced, patient) => {
					if (err) {
						return reject(err);
					}
					return resolve(patient);
				}
			);
		});
	});
}

function updateAppointment(obj, { appointment }) {
	return new Promise((resolve, reject) => {
		const clinic = Object.assign({}, appointment);
		Appointment.update({ _id: clinic._id }, clinic, {}, err => {
			if (err) {
				return reject(err);
			}
			Patient.findOne(
				{ appointments: appointment._id },
				(err, patient) => {
					if (err) {
						return reject(err);
					}
					return resolve(patient);
				}
			);
		});
	});
}

function deleteAppointment(obj, { appointmentId }) {
	return new Promise((resolve, reject) => {
		Appointment.remove({ _id: appointmentId }, {}, err => {
			if (err) {
				return reject(err);
			}
			Patient.update(
				{ appointments: appointmentId },
				{
					$pull: { appointments: appointmentId },
				},
				{},
				(err, num, patient) => {
					if (err) {
						return reject(err);
					}
					return resolve(patient);
				}
			);
		});
	});
}

module.exports = {
	createPatient,
	updatePatient,
	deletePatient,
	addAppointment,
	updateAppointment,
	deleteAppointment,
};
