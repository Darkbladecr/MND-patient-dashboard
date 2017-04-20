import patientById from '../graphql/patientById.gql';
import addAppointmentQL from '../graphql/addAppointment.gql';
import updateAppointmentQL from '../graphql/updateAppointment.gql';
import deleteAppointmentQL from '../graphql/deleteAppointment.gql';
import gql from 'graphql-tag';

export default class patientsService {
	constructor(apollo, graphqlService, AuthService){
		'ngInject';
		this.apollo = apollo;
		this.graphqlService = graphqlService;
		this.AuthService = AuthService;
	}
	getPatientById(_id){
		return this.apollo.query({
			query: patientById,
			variables: {
				token: this.AuthService.getToken(),
				_id
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.patient;
			patient.dateOfBirth = new Date(patient.dateOfBirth);
			patient.diagnosisDate = patient.diagnosisDate ? new Date(patient.diagnosisDate) : null;
			patient.onsetDate = patient.onsetDate ? new Date(patient.onsetDate) : null;
			patient.gastrostomyDate = patient.gastrostomyDate ? new Date(patient.gastrostomyDate) : null;
			patient.nivDate = patient.nivDate ? new Date(patient.nivDate) : null;
			patient.deathDate = patient.deathDate ? new Date(patient.deathDate) : null;
			return patient;
		}, err => this.graphqlService.error(err));
	}
	getPatients(search){
		return this.apollo.query({
			query: gql`query getPatients($token: String!, $search:String) {
				  restricted(token: $token) {
				    patients(search: $search){
				      _id
				      firstName
				      lastName
					  gender
					  ethnicity
					  diagnosisDate
					  onsetDate
					  mndType
					  gastrostomyDate
					  nivDate
					  deathDate
					  deathPlace
					  patientNumber
					  NHSnumber
					  dateOfBirth
					  createdAt
					  lastUpdated
					  appointments {
						  _id
					  }
				    }
				  }
				}`,
			variables: {
				token: this.AuthService.getToken(),
				search
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.patients.map(p => {
				p.dateOfBirth = new Date(p.dateOfBirth);
				return p;
			});
		}, err => this.graphqlService.error(err));
	}
	createPatient(patient){
		return this.apollo.mutate({
			mutation: gql`mutation createPatient($token: String!, $patient:PatientInput!){
				restricted(token:$token){
					createPatient(patient:$patient){
						_id
						firstName
						lastName
						gender
						ethnicity
						diagnosisDate
						onsetDate
						mndType
						gastrostomyDate
						nivDate
						deathDate
						deathPlace
						patientNumber
						NHSnumber
						dateOfBirth
						createdAt
						lastUpdated
					}
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				patient
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.addPatient;
			patient.dateOfBirth = new Date(patient.dateOfBirth);
			return patient;
		}, err => this.graphqlService.error(err));
	}
	updatePatient(patient){
		return this.apollo.mutate({
			mutation: gql`mutation updatePatient($token: String!, $patient:PatientInput!){
				restricted(token:$token){
					updatePatient(patient:$patient){
						_id
						firstName
						lastName
						gender
						ethnicity
						diagnosisDate
						onsetDate
						mndType
						gastrostomyDate
						nivDate
						deathDate
						deathPlace
						patientNumber
						NHSnumber
						dateOfBirth
						createdAt
						lastUpdated
					}
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				patient
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.updatePatient;
			patient.dateOfBirth = new Date(patient.dateOfBirth);
			return patient;
		}, err => this.graphqlService.error(err));
	}
	deletePatient(patient){
		return this.apollo.mutate({
			mutation: gql`mutation deletePatient($token: String!, $_id:String!){
				restricted(token:$token){
					deletePatient(_id:$_id){
						_id
					}
				}
			}`,
			variables: {
				token: this.AuthService.getToken(),
				_id: patient._id
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			return result.deletePatient._id;
		}, err => this.graphqlService.error(err));
	}
	addAppointment(patientId, appointment){
		return this.apollo.mutate({
			mutation: addAppointmentQL,
			variables: {
				token: this.AuthService.getToken(),
				patientId,
				appointment
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.addAppointment;
			patient.appointments = patient.appointments.map(a => {
				a.clinicDate = new Date(a.clinicDate);
				return a;
			});
			return patient;
		}, err => this.graphqlService.error(err));
	}
	updateAppointment(appointment){
		return this.apollo.mutate({
			mutation: updateAppointmentQL,
			variables: {
				token: this.AuthService.getToken(),
				appointment
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.updateAppointment;
			patient.appointments = patient.appointments.map(a => {
				a.clinicDate = new Date(a.clinicDate);
				return a;
			});
			return patient;
		}, err => this.graphqlService.error(err));
	}
	deleteAppointment(appointmentId){
		return this.apollo.mutate({
			mutation: deleteAppointmentQL,
			variables: {
				token: this.AuthService.getToken(),
				appointmentId
			}
		})
		.then(this.graphqlService.extract)
		.then(result => {
			const patient = result.deleteAppointment;
			patient.appointments = patient.appointments.map(a => {
				a.clinicDate = new Date(a.clinicDate);
				return a;
			});
			return patient;
		}, err => this.graphqlService.error(err));
	}
}
