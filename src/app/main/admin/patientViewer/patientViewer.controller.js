import angular from 'angular';
import d3 from 'd3';

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
				left: 48
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
				tickFormat: (date) => d3.time.format('%d %b %y')(new Date(date)),
				staggerLabels: true
			},
			yAxis: {
				showMaxMin: true,
				// axisLabel: 'Weight',
				tickFormat: (d) => d ? str ? d + str : d : null,
				// axisLabelDistance: 0
			},
			legend: {
				updateState: legend ? legend : false,
			}
		}
	};
}

class patientViewerController {
	constructor($mdDialog, patientsService) {
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
		this.graphDataWeight = this.patient.graphData;
		this.graphOptionsWeight = chartOptions('', true);
		this.graphDataEss = this.patient.graphData.filter(e => e.key.includes('ESS'));
		this.graphOptionsEss = chartOptions();
		this.graphDataFvc = this.patient.graphData.filter(e => e.key.includes('FVC'));
		this.graphOptionsFvc = chartOptions('%');
		this.graphDataSpO2 = this.patient.graphData.filter(e => e.key.includes('spO2'));
		this.graphOptionsSpO2 = chartOptions('%');
	}
	exists(item, list) {
		return list.indexOf(item) > -1;
	}
	toggle(item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) {
			list.splice(idx, 1);
		} else {
			list.push(item);
		}
	}
	refreshGraphs() {
		this.graphDataWeight = this.patient.graphData;
		this.graphOptionsWeight = chartOptions();
		this.graphApiWeight.refreshWithTimeout(5);
		this.graphDataEss = this.patient.graphData.filter(e => e.key.includes('ESS'));
		this.graphOptionsEss = chartOptions();
		this.graphApiEss.refreshWithTimeout(5);
		this.graphDataFvc = this.patient.graphData.filter(e => e.key.includes('FVC'));
		this.graphOptionsFvc = chartOptions('%');
		this.graphApiFvc.refreshWithTimeout(5);
		this.graphDataSpO2 = this.patient.graphData.filter(e => e.key.includes('spO2'));
		this.graphOptionsSpO2 = chartOptions('%');
		this.graphApiSpO2.refreshWithTimeout(5);
	}
	addAppointment(ev) {
		this.$mdDialog.show({
			locals: {
				event: ev,
				patientId: this.patient._id,
				appointment: {}
			},
			contentElement: '#appointmentEditor',
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
			contentElement: '#appointmentEditor',
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
}
export default patientViewerController;
