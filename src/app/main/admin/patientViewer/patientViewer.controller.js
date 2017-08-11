import angular from 'angular';
import d3 from 'd3';
import clinicLetterTemplate from './dialogs/clinicLetter.html';
import clinicLetterController from './dialogs/clinicLetter.controller';
import appointmentDialogController from './dialogs/appointment-dialog.controller';
import appointmentDialogTemplate from './dialogs/appointment-dialog.html';
const ipc = require('electron').ipcRenderer;

function chartOptions(str, legend) {
	return {
		chart: {
			type: 'lineChart',
			color: d3.scale.category10().range(),
			height: 400,
			margin: {
				top: 32,
				right: 32,
				bottom: 64,
				left: 48,
			},
			// isArea: true,
			useInteractiveGuideline: true,
			duration: 300,
			// clipEdge: true,
			clipVoronoi: false,
			interpolate: 'cardinal',
			// showLegend: false,
			xAxis: {
				// showMaxMin: false,
				axisLabel: 'Date',
				tickFormat: date => d3.time.format('%d %b %y')(new Date(date)),
				staggerLabels: true,
			},
			yAxis: {
				showMaxMin: true,
				// axisLabel: 'Weight',
				tickFormat: d => (d ? (str ? d + str : d) : null),
				// axisLabelDistance: 0
			},
			legend: {
				updateState: legend ? legend : false,
			},
		},
	};
}

class patientViewerController {
	constructor($mdDialog, patientsService, excelService, AuthService, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.patientsService = patientsService;
		this.excelService = excelService;
		this.AuthService = AuthService;

		this.selected = [];

		this.options = {
			autoSelect: true,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: true,
		};

		this.query = {
			order: 'clinicDate',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1,
		};
		this.graphDataWeight = this.patient.graphData;
		this.graphOptionsWeight = chartOptions('', true);
		this.graphDataEss = this.patient.graphData.filter(e =>
			e.key.includes('ESS')
		);
		this.graphOptionsEss = chartOptions();
		this.graphDataFvc = this.patient.graphData.filter(e =>
			e.key.includes('FVC')
		);
		this.graphOptionsFvc = chartOptions('%');
		this.graphDataSpO2 = this.patient.graphData.filter(e =>
			e.key.includes('spO2')
		);
		this.graphOptionsSpO2 = chartOptions('%');

		const alsfrs = this.calculateRates('alsfrs', 'total');
		const weight = this.calculateRates('weight');
		const fvcSitting = this.calculateRates('fvc', 'sitting');
		const fvcStanding = this.calculateRates('fvc', 'standing');
		this.rate = {
			alsfrs: isNaN(alsfrs) ? 0 : Number(alsfrs.toFixed(2)),
			weight: isNaN(weight) ? 0 : Number(weight.toFixed(2)),
			fvcSitting: isNaN(fvcSitting) ? 0 : Number(fvcSitting.toFixed(2)),
			fvcStanding: isNaN(fvcStanding)
				? 0
				: Number(fvcStanding.toFixed(2)),
		};
		$scope.$watch(
			'$ctrl.patient.appointments',
			(newValue, oldValue) => {
				if (newValue !== oldValue) {
					if (this.patient.appointments) {
						const alsfrs = this.calculateRates('alsfrs', 'total');
						const weight = this.calculateRates('weight');
						const fvcSitting = this.calculateRates(
							'fvc',
							'sitting'
						);
						const fvcStanding = this.calculateRates(
							'fvc',
							'standing'
						);
						this.rate = {
							alsfrs: isNaN(alsfrs)
								? 0
								: Number(alsfrs.toFixed(2)),
							weight: isNaN(weight)
								? 0
								: Number(weight.toFixed(2)),
							fvcSitting: isNaN(fvcSitting)
								? 0
								: Number(fvcSitting.toFixed(2)),
							fvcStanding: isNaN(fvcStanding)
								? 0
								: Number(fvcStanding.toFixed(2)),
						};
					}
				}
			},
			true
		);
	}
	refreshGraphs() {
		this.graphDataWeight = this.patient.graphData;
		this.graphOptionsWeight = chartOptions();
		this.graphApiWeight.refreshWithTimeout(5);
		this.graphDataEss = this.patient.graphData.filter(e =>
			e.key.includes('ESS')
		);
		this.graphOptionsEss = chartOptions();
		this.graphApiEss.refreshWithTimeout(5);
		this.graphDataFvc = this.patient.graphData.filter(e =>
			e.key.includes('FVC')
		);
		this.graphOptionsFvc = chartOptions('%');
		this.graphApiFvc.refreshWithTimeout(5);
		this.graphDataSpO2 = this.patient.graphData.filter(e =>
			e.key.includes('spO2')
		);
		this.graphOptionsSpO2 = chartOptions('%');
		this.graphApiSpO2.refreshWithTimeout(5);
	}
	calculateRates(key, subkey) {
		const rates = this.patient.appointments
			.map((appointment, i, arr) => {
				if (i - 1 > -1) {
					const prevA = arr[i - 1];
					const v = subkey
						? appointment[key][subkey]
						: appointment[key];
					const prevV = subkey ? prevA[key][subkey] : prevA[key];
					const monthMultiplier = Math.abs(
						new Date(appointment.clinicDate).getMonth() -
							new Date(prevA.clinicDate).getMonth()
					);
					return monthMultiplier === 0
						? 0
						: Math.abs(v - prevV) / monthMultiplier;
				} else {
					return 0;
				}
			})
			.filter(n => n !== 0);
		return rates.reduce((a, b) => a + b, 0) / rates.length;
	}
	printGraphs() {
		ipc.send('print-to-pdf');
	}
	addAppointment(ev) {
		this.selected = [
			{
				clinicDate: new Date(),
				assessor: `${this.AuthService.currentUser()
					.firstName} ${this.AuthService.currentUser().lastName}`,
			},
		];
		this.$mdDialog
			.show({
				locals: {
					patient: this.patient,
					appointment: angular.copy(this.selected[0]),
				},
				template: appointmentDialogTemplate,
				controller: appointmentDialogController,
				controllerAs: 'vm',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: true,
			})
			.then(
				patient => {
					this.selected = [];
					this.patient = patient;
					this.refreshGraphs();
				},
				() => {
					this.selected = [];
				}
			);
	}
	editAppointment(ev) {
		this.$mdDialog
			.show({
				locals: {
					patient: this.patient,
					appointment: angular.copy(this.selected[0]),
				},
				template: appointmentDialogTemplate,
				controller: appointmentDialogController,
				controllerAs: 'vm',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: true,
			})
			.then(
				patient => {
					this.selected = [];
					this.patient = patient;
					this.refreshGraphs();
				},
				() => {
					this.selected = [];
				}
			);
	}
	clinicLetter(ev, appointment) {
		this.$mdDialog.show(
			{
				locals: {
					event: ev,
					appointment,
				},
				controller: clinicLetterController,
				controllerAs: 'vm',
				template: clinicLetterTemplate,
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose: false,
				fullscreen: false,
			},
			() => {
				this.selected = [];
			},
			() => {
				this.selected = [];
			}
		);
	}
	exportAppointments() {
		const name = `${this.patient.firstName.charAt(0)}_${this.patient
			.lastName}`;
		const safename = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		this.excelService.exportAppointments(this.patient._id, safename);
	}
	deleteConfirm(ev, appointment) {
		const confirm = this.$mdDialog
			.confirm()
			.title('Delete Appointment')
			.textContent('Are you sure you want to delete this appointment?')
			.ariaLabel('Are you sure you want to delete this appointment?')
			.targetEvent(ev)
			.ok('Delete')
			.cancel('Cancel');
		this.$mdDialog.show(confirm).then(() => {
			this.patientsService
				.deleteAppointment(appointment._id)
				.then(patient => {
					this.selected = [];
					this.patient = patient;
					this.refreshGraphs();
				});
		});
	}
}
export default patientViewerController;
