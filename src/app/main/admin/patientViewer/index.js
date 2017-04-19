import angular from 'angular';
import controller from './patientViewer.controller.js';
import template from './patientViewer.html';
import './patientViewer.scss';
import appointmentDialogController from './dialogs/appointment-dialog.controller';
import appointmentDialogTemplate from './dialogs/appointment-dialog.html';

require('d3');
require('nvd3/build/nv.d3');
require('nvd3/build/nv.d3.css');
require('angular-nvd3');

function config($stateProvider) {
	'ngInject';

	// State
	$stateProvider
		.state('app.patientViewer', {
			url: '/patients/:patientId',
			views: {
				'content@app': {
					template: '<patient-viewer patient="vm.patient"></patient-viewer>',
					controller: 'patientCtrl as vm',
					resolve: {
						patient: (patientsService, $stateParams) => {
							'ngInject';
							return patientsService.getPatientById($stateParams.patientId);
						}
					}
				}
			}
		});
}

function patientCtrl(patient, $state){
	'ngInject';
	if(patient){
		this.patient = patient;
	} else {
		$state.go('app.admin_patients');
	}
}
export default angular
	.module('app.admin.patientViewer', [
		'nvd3'
	])
	.config(config)
	.controller('patientCtrl', patientCtrl)
	.component('patientViewer', {
		bindings: {
			patient: '<'
		},
		controller,
		template
	})
	.component('appointmentDialog', {
		bindings: {
			patientId: '<',
			appointment: '<'
		},
		controller: appointmentDialogController,
		controllerAs: 'vm',
		template: appointmentDialogTemplate
	});
