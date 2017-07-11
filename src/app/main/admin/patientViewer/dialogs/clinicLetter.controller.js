export default class ClinicLetterController {
	constructor($mdDialog, outcomes) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.outcomes = outcomes;
	}
	closeDialog() {
		this.$mdDialog.hide();
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
}
