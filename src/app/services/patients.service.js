import { patient, patients } from './resolvers/query/restricted/patient';
import {
	createPatient as insertPatient,
	updatePatient as modifyPatient,
	deletePatient as removePatient,
	addAppointment as insertAppointment,
	updateAppointment as modifyAppointment,
	deleteAppointment as removeAppointment,
} from './resolvers/mutation/restricted/patients';
import { PatientResolve } from './resolvers/population';

export default class patientsService {
	constructor(apollo, graphqlService, AuthService, toastService) {
		'ngInject';
		this.apollo = apollo;
		this.graphqlService = graphqlService;
		this.AuthService = AuthService;
		this.toastService = toastService;
	}
	getPatientById(_id) {
		return new Promise(resolve => {
			patient({}, { _id }).then(
				p => {
					PatientResolve.graphData(p).then(
						graphs => {
							const final = Object.assign({}, p, {
								graphData: graphs,
							});
							return resolve(final);
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
				p => resolve(p),
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
			insertPatient({}, { patient }).then(
				p => {
					this.toastService.simple('Patient created.');
					return resolve(p);
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
			modifyPatient({}, { patient: update }).then(
				p => {
					this.toastService.simple('Patient updated.');
					return resolve(p);
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
			removePatient({}, { _id: patient._id }).then(
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
			insertAppointment({}, { patientId, appointment }).then(
				p => {
					PatientResolve.graphData(p).then(
						graphs => {
							const final = Object.assign({}, p, {
								graphData: graphs,
							});
							this.toastService.simple('Appointment added.');
							return resolve(final);
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
			modifyAppointment({}, { appointment: update }).then(
				p => {
					PatientResolve.graphData(p).then(
						graphs => {
							const final = Object.assign({}, p, {
								graphData: graphs,
							});
							this.toastService.simple('Appointment updated.');
							return resolve(final);
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
			removeAppointment({}, { appointmentId }).then(
				p => {
					PatientResolve.graphData(p).then(
						graphs => {
							const final = Object.assign({}, p, {
								graphData: graphs,
							});
							this.toastService.simple('Appointment deleted.');
							return resolve(final);
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
