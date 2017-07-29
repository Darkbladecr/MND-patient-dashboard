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

		// return this.apollo
		// 	.query({
		// 		query: patientById,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			_id,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			const patient = result.patient;
		// 			patient.dateOfBirth = new Date(patient.dateOfBirth);
		// 			patient.diagnosisDate = patient.diagnosisDate
		// 				? new Date(patient.diagnosisDate)
		// 				: null;
		// 			patient.onsetDate = patient.onsetDate
		// 				? new Date(patient.onsetDate)
		// 				: null;
		// 			patient.gastrostomyDate = patient.gastrostomyDate
		// 				? new Date(patient.gastrostomyDate)
		// 				: null;
		// 			patient.nivDate = patient.nivDate
		// 				? new Date(patient.nivDate)
		// 				: null;
		// 			patient.deathDate = patient.deathDate
		// 				? new Date(patient.deathDate)
		// 				: null;
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.query({
		// 		query: getPatients,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			search,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			return result.patients.map(p => {
		// 				p.dateOfBirth = new Date(p.dateOfBirth);
		// 				return p;
		// 			});
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: createPatient,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			patient,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Patient created.');
		// 			const patient = result.createPatient;
		// 			patient.dateOfBirth = new Date(patient.dateOfBirth);
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: updatePatient,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			patient: update,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Patient updated.');
		// 			const patient = result.updatePatient;
		// 			patient.dateOfBirth = new Date(patient.dateOfBirth);
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: gql`
		// 			mutation deletePatient($token: String!, $_id: String!) {
		// 				restricted(token: $token) {
		// 					deletePatient(_id: $_id) {
		// 						_id
		// 					}
		// 				}
		// 			}
		// 		`,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			_id: patient._id,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Patient deleted.');
		// 			return result.deletePatient._id;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: addAppointmentQL,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			patientId,
		// 			appointment,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Appointment added.');
		// 			const patient = result.addAppointment;
		// 			patient.appointments = patient.appointments.map(a => {
		// 				a.clinicDate = new Date(a.clinicDate);
		// 				return a;
		// 			});
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: updateAppointmentQL,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			appointment: update,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Appointment updated.');
		// 			const patient = result.updateAppointment;
		// 			patient.appointments = patient.appointments.map(a => {
		// 				a.clinicDate = new Date(a.clinicDate);
		// 				return a;
		// 			});
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
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
		// return this.apollo
		// 	.mutate({
		// 		mutation: deleteAppointmentQL,
		// 		variables: {
		// 			token: this.AuthService.getToken(),
		// 			appointmentId,
		// 		},
		// 	})
		// 	.then(this.graphqlService.extract)
		// 	.then(
		// 		result => {
		// 			this.toastService.simple('Appointment deleted.');
		// 			const patient = result.deleteAppointment;
		// 			patient.appointments = patient.appointments.map(a => {
		// 				a.clinicDate = new Date(a.clinicDate);
		// 				return a;
		// 			});
		// 			return patient;
		// 		},
		// 		err => this.graphqlService.error(err)
		// 	);
	}
}
