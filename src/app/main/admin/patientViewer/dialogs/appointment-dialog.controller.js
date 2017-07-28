import angular from 'angular';
export default class AppointmentDialogController {
	constructor($mdDialog, patientsService, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.alfrsDialog = $mdDialog;
		this.patientsService = patientsService;

		this.minDate = new Date(1900, 0, 1);

		$scope.$watch(
			'vm.appointment.weight',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (
						this.appointment &&
						this.appointment.weight &&
						this.appointment.height
					) {
						const bmi =
							this.appointment.weight /
							(this.appointment.height * this.appointment.height);
						this.appointment.bmi = Number(bmi.toFixed(2));
					}
				}
			},
			true
		);

		$scope.$watch(
			'vm.appointment.height',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (
						this.appointment &&
						this.appointment.weight &&
						this.appointment.height
					) {
						const bmi =
							this.appointment.weight /
							(this.appointment.height * this.appointment.height);
						this.appointment.bmi = Number(bmi.toFixed(2));
					}
				}
			},
			true
		);
	}
	updateAppointment() {
		const appointment = JSON.parse(angular.toJson(this.appointment));
		if ('_id' in appointment) {
			this.patientsService
				.updateAppointment(appointment)
				.then(appointment => this.closeDialog(appointment));
		} else {
			this.patientsService
				.addAppointment(this.patientId, appointment)
				.then(appointment => this.closeDialog(appointment));
		}
	}
	closeDialog(data) {
		this.$mdDialog.hide(data);
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
}
