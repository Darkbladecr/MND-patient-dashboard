import patientById from '../graphql/patientById.gql';
import addAppointmentQL from '../graphql/addAppointment.gql';
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
}
