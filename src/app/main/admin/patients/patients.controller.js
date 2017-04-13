import angular from 'angular';
import PatientDialogController from './dialogs/patient-dialog.controller';
import dialogTemplate from './dialogs/patient-dialog.html';

export default class UsersController {
	constructor($mdDialog, $mdSidenav, usersService, patientsService, AuthService, $scope, $q, $window, $state) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.$mdSidenav = $mdSidenav;
		this.usersService = usersService;
		this.patientsService = patientsService;
		this.AuthService = AuthService;
		this.$scope = $scope;
		this.$q = $q;
		this.$window = $window;
		this.$state = $state;

		this.selected = [];
		this.search = '';

		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true
		};

		this.query = {
			order: '-createdAt',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1
		};
		this.bookmark = null;
		this.$scope.$watch(() => this.search, (newValue, oldValue) => {
			if (!oldValue) {
				this.bookmark = this.query.page;
			}
			if (newValue !== oldValue) {
				this.query.page = 1;
				this.getPatients(this.search);
			}
			if (!newValue) {
				this.query.page = this.bookmark;
			}
		});
	}
	$onInit(){
		this.getPatients();
	}
	pageChange(){
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
	getPatients(search) {
		const deferred = this.$q.defer();
		this.promise = deferred.promise;
		this.patientsService.getPatients(search).then(patients => {
			this.patients = patients;
			deferred.resolve();
		});
	}
	viewPatient(patient) {
		this.$state.go('app.patientViewer', {patientId: patient._id});
	}
	addPatient(ev) {
		this.$mdDialog.show({
			locals: {
				event: ev,
				patient: {}
			},
			controller: PatientDialogController,
			controllerAs: 'vm',
			template: dialogTemplate,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false,
			fullscreen: false
		}).then(patient => {
			this.patients = [...this.patients, patient];
		});
	}
	editPatient(ev, patient) {
		this.patientsService.getPatientById(patient._id).then(patient => {
			this.$mdDialog.show({
				locals: {
					event: ev,
					patient
				},
				controller: PatientDialogController,
				controllerAs: 'vm',
				template: dialogTemplate,
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: false
			}).then(patient => {
				this.selected = [];
				this.patients.map(p => p._id === patient._id ? patient : p);
			});
		});
	}
	deleteConfirm(ev, patient) {
		const confirm = this.$mdDialog.confirm()
			.title(`Delete Patient`)
			.textContent(`Are you sure you want to delete ${patient.firstName} ${patient.lastName}?`)
			.ariaLabel('Are you sure you want to delete this user?')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.patientsService.deletePatient(patient);
			this.patients.filter(p => p._id !== patient._id);
		});
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	resetFilters() {
		this.search = '';
		this.getPatients(this.search);
	}
}
