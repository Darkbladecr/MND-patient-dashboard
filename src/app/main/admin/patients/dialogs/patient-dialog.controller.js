export default class UserDialogController {
	constructor($mdDialog, patient, patientsService) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.patientsService = patientsService;

		this.title = '_id' in patient ? 'Edit Patient' : 'Add New Patient';
		this.patient = patient;
	}
	updatePatient() {
		if ('_id' in this.patient) {
			const patient = {
				_id: this.patient._id,
				firstName: this.patient.firstName,
				lastName: this.patient.lastName,
				gender: this.patient.gender,
				ethnicity: this.patient.ethnicity,
				postcode: this.patient.postcode,
				diagnosisDate: this.patient.diagnosisDate,
				onsetDate: this.patient.onsetDate,
				mndType: this.patient.mndType,
				gastrostomyDate: this.patient.gastrostomyDate,
				nivDate: this.patient.nivDate,
				deathDate: this.patient.deathDate,
				deathPlace: this.patient.deathPlace,
				dateOfBirth: this.patient.dateOfBirth,
				patientNumber: this.patient.patientNumber,
				NHSnumber: this.patient.NHSnumber,
			};
			this.patientsService
				.updatePatient(patient)
				.then(patient => this.closeDialog(patient));
		} else {
			this.patientsService
				.createPatient(this.patient)
				.then(patient => this.closeDialog(patient));
		}
	}
	closeDialog(data) {
		this.$mdDialog.hide(data);
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
}
