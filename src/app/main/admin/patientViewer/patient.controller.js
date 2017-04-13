import angular from 'angular';
import appointmentDialogController from './dialogs/appointment-dialog.controller';
import appointmentDialogTemplate from './dialogs/appointment-dialog.html';

class patientViewerController {
	constructor($mdDialog) {
		'ngInject';
		this.$mdDialog = $mdDialog;

		this.patient.appointments = this.patient.appointments.map(a => {
			a.clinicDate = new Date(a.clinicDate);
			return a;
		});
		this.selected = [];

		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true
		};

		this.query = {
			order: 'clinicDate',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1
		};
	}
	addAppointment(ev) {
		this.$mdDialog.show({
			locals: {
				event: ev,
				patientId: this.patient._id,
				appointment: {}
			},
			controller: appointmentDialogController,
			controllerAs: 'vm',
			template: appointmentDialogTemplate,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false,
			fullscreen: false
		}).then(patient => {
			this.patient = patient;
		});
	}
	editAppointment(ev, appointment) {
		this.$mdDialog.show({
			locals: {
				event: ev,
				patientId: this.patient._id,
				appointment
			},
			controller: appointmentDialogController,
			controllerAs: 'vm',
			template: appointmentDialogTemplate,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false,
			fullscreen: false
		}).then(patient => {
			this.selected = [];
			this.patient = patient;
		});
	}
	deleteConfirm(ev, appointment) {
		const confirm = this.$mdDialog.confirm()
			.title('Delete Appointment')
			.textContent('Are you sure you want to delete this appointment?')
			.ariaLabel('Are you sure you want to delete this appointment?')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.patientsService.deleteAppointment(appointment._id);
			this.patient.appointments = this.patient.appointments.filter(a => a !== appointment._id);
		});
	}
}
export default patientViewerController;
