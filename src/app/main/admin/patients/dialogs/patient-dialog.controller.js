export default class UserDialogController {
	constructor($mdDialog, patient, patientsService) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.patientsService = patientsService;
		this.minDate = new Date(1900, 0, 1);

		this.title = '_id' in patient ? 'Edit Patient' : 'Add New Patient';
		this.patient = patient;
	}
	updatePatient() {
		if ('_id' in this.patient) {
			this.patientsService
				.updatePatient(this.patient)
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
