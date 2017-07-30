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
			'vm.patient',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (newValue.gender === 'male') {
						this.predictedFVC =
							newValue.height / 100 * 5.76 -
							(new Date().getFullYear() -
								new Date(newValue.dateOfBirth).getFullYear()) *
								0.026 -
							4.34;
					} else {
						this.predictedFVC =
							newValue.height / 100 * 4.43 -
							(new Date().getFullYear() -
								new Date(newValue.dateOfBirth).getFullYear()) *
								0.026 -
							2.89;
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
