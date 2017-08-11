const { Patient } = require('../../../models');

function patient(obj, { _id }) {
	return new Promise((resolve, reject) => {
		Patient.findOne({ _id }, (err, patient) => {
			if (err) {
				return reject(err);
			}
			return resolve(patient);
		});
	});
}

const isnum = /^\d+$/;

function patients(obj, { search }) {
	return new Promise((resolve, reject) => {
		if (search && search.length > 1) {
			if (isnum.test(search)) {
				if (search.length === 10) {
					Patient.find({ NHSnumber: search }, (err, patient) => {
						if (err) {
							return reject(err);
						}
						return resolve(patient);
					});
				} else {
					Patient.find({ patientNumber: search }, (err, patient) => {
						if (err) {
							return reject(err);
						}
						return resolve(patient);
					});
				}
			} else {
				const regex = new RegExp(search);
				Patient.find(
					{
						$or: [
							{ firstName: { $regex: regex } },
							{ lastName: { $regex: regex } },
						],
					},
					(err, patients) => {
						if (err) {
							return reject(err);
						}
						return resolve(patients);
					}
				);
			}
		} else {
			Patient.find({}, (err, patients) => {
				if (err) {
					return reject(err);
				}
				return resolve(patients);
			});
		}
	});
}

module.exports = { patient, patients };
