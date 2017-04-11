import angular from 'angular';
import controller from './patient.controller.js';
import template from './patient.html';
import './patientViewer.scss';

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
	.module('app.admin.patientViewer', [])
	.config(config)
	.controller('patientCtrl', patientCtrl)
	.component('patientViewer', {
		bindings: {
			patient: '<'
		},
		controller,
		template
	});
