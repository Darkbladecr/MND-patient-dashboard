import angular from 'angular';
export default class AppointmentDialogController {
	constructor($mdDialog, patientId, appointment, patientsService, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.alfrsDialog = $mdDialog;
		this.patientsService = patientsService;
		this.patientId = patientId;

		this.title = '_id' in appointment ? 'Edit Appointment' : 'Add New Appointment';
		this.appointment = appointment;
		this.appointment.clinicDate = appointment.hasOwnProperty('clinicDate') ? this.appointment.clinicDate : new Date();

		$scope.$watch('vm.appointment.alsfrs', (newValue, oldValue) => {
			if (newValue !== oldValue) {
				const keys = Object.keys(this.appointment.alsfrs).filter(e => e !== 'total');
				this.appointment.alsfrs.total = keys.reduce((sum, k) => sum + this.appointment.alsfrs[k], 0);
			}
		}, true);
		$scope.$watch('vm.appointment.ess', (newValue, oldValue) => {
			if (newValue !== oldValue) {
				const keys = Object.keys(this.appointment.ess).filter(e => e !== 'total');
				this.appointment.ess.total = keys.reduce((sum, k) => sum + this.appointment.ess[k], 0);
			}
		}, true);
	}
	updateAppointment() {
		const appointment = JSON.parse(angular.toJson(this.appointment));
		if ('_id' in appointment) {
			this.patientsService.updateAppointment(appointment).then(appointment => this.closeDialog(appointment));
		} else {
			this.patientsService.addAppointment(this.patientId, appointment).then(appointment => this.closeDialog(appointment));
		}
	}
	closeDialog(data) {
		this.$mdDialog.hide(data);
	}
	cancelDialog(){
		this.$mdDialog.cancel();
	}
}
