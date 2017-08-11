import angular from 'angular';
export default class AppointmentDialogController {
	constructor($mdDialog, patientsService, $scope, appointment, patient) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.alfrsDialog = $mdDialog;
		this.patientsService = patientsService;
		this.appointment = appointment;
		this.patient = patient;

		this.minDate = new Date(1900, 0, 1);

		$scope.$watch(
			'vm.appointment.weight',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (
						this.appointment &&
						this.appointment.weight &&
						this.patient &&
						this.patient.height
					) {
						const bmi =
							this.appointment.weight /
							(this.patient.height * this.patient.height / 10000);
						this.appointment.bmi = Number(bmi.toFixed(2));
					}
				}
			},
			true
		);
		$scope.$watch(
			'vm.appointment.alsfrs',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					const alsfrsValues = Object.assign(
						{},
						this.appointment.alsfrs
					);
					delete alsfrsValues.total;
					this.appointment.alsfrs.total = Object.values(
						alsfrsValues
					).reduce((a, b) => a + b, 0);
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
				.addAppointment(this.patient._id, appointment)
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
