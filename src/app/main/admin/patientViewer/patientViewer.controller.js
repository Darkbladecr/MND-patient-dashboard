import angular from 'angular';
import appointmentDialogController from './dialogs/appointment-dialog.controller';
import appointmentDialogTemplate from './dialogs/appointment-dialog.html';

const d3 = require('d3');
import data from '../../../data/dashboard/analytics/data.json';

class patientViewerController {
	constructor($mdDialog, patientsService, $scope) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.patientsService = patientsService;

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

		this.graphType = 'weight';
		// $scope.$watch(() => this.graphType, (newValue) => {
		// 	if (newValue) {
		// 		let values = this.patient.appointments.map(a => { return { x: a.clinicDate, y: a[newValue] } }).sort((a,b) => b.x - a.x);
		// 		if (newValue === 'fvc'){
		// 			const data = [];
		// 			data.push({
		// 				key: 'FVC Sitting',
		// 				values: values.map(a => {
		// 					a.y = a.y.sitting === null ? 0 : a.y.sitting;
		// 					return a;
		// 				})
		// 			});
		// 			data.push({
		// 				key: 'FVC Supine',
		// 				values: values.map(a => {
		// 					a.y = a.y.supine === null ? 0 : a.y.supine;
		// 					return a;
		// 				})
		// 			});
		// 			this.graphData = data;
		// 		} else {
		// 			if (newValue === 'alsfrs' || newValue === 'ess') {
		// 				values = values.map(a => {
		// 					a.y = a.y.total;
		// 					return a;
		// 				});
		// 			}
		// 			this.graphData = [{
		// 				key: newValue,
		// 				values
		// 			}];
		// 		}
		// 		// this.graphData.forEach(t => console.table(t.values));
		// 		this.graphApi.refresh();
		// 	}
		// });

		this.chart = {
			options: {
				chart: {
					type: 'lineWithFocusChart',
					// color: ['#2196F3'],
					height: 400,
					margin: {
						top: 32,
						right: 32,
						bottom: 64,
						left: 48
					},
					// isArea: true,
					// useInteractiveGuideline: true,
					duration: 300,
					clipEdge: true,
					clipVoronoi: false,
					interpolate: 'cardinal',
					showLegend: false,
					xAxis: {
						// showMaxMin: false,
						tickFormat: (date) => d3.timeFormat('%d %b %y')(date)
					},
					yAxis: {
						showMaxMin: true
					},
					x2Axis: {
						// showMaxMin: false,
						tickFormat: (date) => d3.timeFormat('%d %b %y')(date)
					},
					y2Axis: {
						// showMaxMin: false
					},
					// forceY: [0],
					// interactiveLayer: {
					// 	tooltip: {
					// 		gravity: 's',
					// 		classes: 'gravity-s'
					// 	}
					// },
				}
			}
		}
		this.updateGraph();
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
			this.patient.appointments = this.patient.appointments.filter(a => a._id !== appointment._id);
		});
	}
	updateGraph() {
		let values = this.patient.appointments.map(a => {
			return { x: a.clinicDate, y: a[this.graphType] }
		}).sort((a, b) => b.x - a.x);
		if (this.graphType === 'fvc') {
			const data = [];
			data.push({
				key: 'FVC Sitting',
				values: values.map(a => {
					return {
						x: a.x,
						y: a.y.sitting
					};
				})
			});
			data.push({
				key: 'FVC Supine',
				values: values.map(a => {
					return {
						x: a.x,
						y: a.y.supine
					};
				})
			});
			this.graphData = data;
		} else {
			if (this.graphType === 'alsfrs' || this.graphType === 'ess') {
				values = values.map(a => {
					a.y = a.y.total;
					return a;
				});
			}
			this.graphData = [{
				key: this.graphType,
				values
			}];
		}
		// console.log(this.graphData);
		// this.graphData.forEach(t => console.table(t.values));
		// this.graphApi.refreshWithTimeout(5);
	}
}
export default patientViewerController;
