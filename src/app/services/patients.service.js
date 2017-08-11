const { patient, patients } = require('electron').remote.require(
	'./backend/resolvers/query/restricted/patient'
);
const {
	createPatient,
	updatePatient,
	deletePatient,
	addAppointment,
	updateAppointment,
	deleteAppointment,
} = require('electron').remote.require(
	'./backend/resolvers/mutation/restricted/patients'
);
const { PatientResolve } = require('electron').remote.require(
	'./backend/resolvers/population'
);

function nullDates(d) {
	if (d instanceof Date && d === new Date(0)) {
		return null;
	} else {
		return d;
	}
}
function resolveDates(patient) {
	patient.diagnosisDate = nullDates(patient.diagnosisDate);
	patient.onsetDate = nullDates(patient.onsetDate);
	patient.gastrostomyDate = nullDates(patient.gastrostomyDate);
	patient.nivDate = nullDates(patient.nivDate);
	patient.deathDate = nullDates(patient.deathDate);
	return patient;
}

export default class patientsService {
	constructor(graphqlService, AuthService, toastService) {
		'ngInject';
		this.graphqlService = graphqlService;
		this.AuthService = AuthService;
		this.toastService = toastService;
	}
	getPatientById(_id) {
		return new Promise(resolve => {
			patient({}, { _id }).then(
				p => {
					PatientResolve.appointments(p).then(
						appointments => {
							appointments = appointments.map(a =>
								Object.assign({}, a)
							);
							p = Object.assign({}, p, {
								appointments,
							});
							PatientResolve.graphData(p).then(
								graphs => {
									const final = Object.assign({}, p, {
										graphData: graphs,
									});
									return resolve(resolveDates(final));
								},
								err => {
									throw err;
								}
							);
						},
						err => {
							throw err;
						}
					);
				},
				err => this.toastService.error(err)
			);
		});
	}
	getPatients(search) {
		return new Promise(resolve => {
			patients({}, { search }).then(
				patients => {
					const final = patients.map(resolveDates);
					return resolve(final);
				},
				err => this.toastService.error(err)
			);
		});
	}
	createPatient(patient) {
		return new Promise(resolve => {
			createPatient({}, { patient }).then(
				p => {
					this.toastService.simple('Patient created.');
					return resolve(resolveDates(p));
				},
				err => this.toastService.error(err)
			);
		});
	}
	updatePatient(patient) {
		const update = {
			_id: patient._id,
			firstName: patient.firstName,
			lastName: patient.lastName,
			gender: patient.gender,
			ethnicity: patient.ethnicity,
			height: patient.height,
			referredBy: patient.referredBy,
			postcode: patient.postcode,
			diagnosisDate: patient.diagnosisDate,
			onsetDate: patient.onsetDate,
			mndType: patient.mndType,
			gastrostomyDate: patient.gastrostomyDate,
			nivDate: patient.nivDate,
			deathDate: patient.deathDate,
			deathPlace: patient.deathPlace,
			dateOfBirth: patient.dateOfBirth,
			patientNumber: patient.patientNumber,
			NHSnumber: patient.NHSnumber,
		};
		return new Promise(resolve => {
			updatePatient({}, { patient: update }).then(
				p => {
					this.toastService.simple('Patient updated.');
					return resolve(resolveDates(p));
				},
				err => this.toastService.error(err)
			);
		});
	}
	deletePatient(patient) {
		return new Promise(resolve => {
			deletePatient({}, { _id: patient._id }).then(
				p => {
					this.toastService.simple('Patient deleted.');
					return resolve(p._id);
				},
				err => this.toastService.error(err)
			);
		});
	}
	addAppointment(patientId, appointment) {
		return new Promise(resolve => {
			addAppointment({}, { patientId, appointment }).then(
				p => {
					PatientResolve.appointments(p).then(
						appointments => {
							appointments = appointments.map(a =>
								Object.assign({}, a)
							);
							p = Object.assign({}, p, {
								appointments,
							});
							PatientResolve.graphData(p).then(
								graphs => {
									const final = Object.assign({}, p, {
										graphData: graphs,
									});
									this.toastService.simple(
										'Appointment added.'
									);
									return resolve(final);
								},
								err => {
									throw err;
								}
							);
						},
						err => {
							throw err;
						}
					);
				},
				err => this.toastService.error(err)
			);
		});
	}
	updateAppointment(appointment) {
		const update = Object.assign({}, appointment);
		return new Promise(resolve => {
			updateAppointment({}, { appointment: update }).then(
				p => {
					PatientResolve.appointments(p).then(
						appointments => {
							appointments = appointments.map(a =>
								Object.assign({}, a)
							);
							p = Object.assign({}, p, { appointments });
							PatientResolve.graphData(p).then(
								graphs => {
									const final = Object.assign({}, p, {
										graphData: graphs,
									});
									this.toastService.simple(
										'Appointment updated.'
									);
									return resolve(final);
								},
								err => {
									throw err;
								}
							);
						},
						err => {
							throw err;
						}
					);
				},
				err => this.toastService.error(err)
			);
		});
	}
	deleteAppointment(appointmentId) {
		return new Promise(resolve => {
			deleteAppointment({}, { appointmentId }).then(
				p => {
					PatientResolve.appointments(p).then(
						appointments => {
							appointments = appointments.map(a =>
								Object.assign({}, a)
							);
							p = Object.assign({}, p, {
								appointments,
							});
							PatientResolve.graphData(p).then(
								graphs => {
									const final = Object.assign({}, p, {
										graphData: graphs,
									});
									this.toastService.simple(
										'Appointment deleted.'
									);
									return resolve(final);
								},
								err => {
									throw err;
								}
							);
						},
						err => {
							throw err;
						}
					);
				},
				err => this.toastService.error(err)
			);
		});
	}
}
