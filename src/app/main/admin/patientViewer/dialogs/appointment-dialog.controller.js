import angular from 'angular';
export default class AppointmentDialogController {
	constructor($mdDialog, patientsService, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.alfrsDialog = $mdDialog;
		this.patientsService = patientsService;

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

		$scope.$watch(
			'vm.appointment.alsfrs',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (this.appointment) {
						if (this.appointment.alsfrs) {
							const keys = Object.keys(
								this.appointment.alsfrs
							).filter(e => e !== 'total');
							this.appointment.alsfrs.total = keys.reduce(
								(sum, k) =>
									k !== '__typename'
										? sum + this.appointment.alsfrs[k]
										: sum,
								0
							);
						} else {
							this.appointment.alsfrs.total = 0;
						}
					}
				}
			},
			true
		);
		$scope.$watch(
			'vm.appointment.ess',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (this.appointment) {
						if (this.appointment.ess) {
							const keys = Object.keys(
								this.appointment.ess
							).filter(e => e !== 'total');
							this.appointment.ess.total = keys.reduce(
								(sum, k) =>
									k !== '__typename'
										? sum + this.appointment.ess[k]
										: sum,
								0
							);
						} else {
							this.appointment.ess.total = 0;
						}
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
