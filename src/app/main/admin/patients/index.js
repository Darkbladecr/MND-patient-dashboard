import angular from 'angular';
import controller from './patients.controller';
import template from './patients.html';
import { authorized } from '../../navigationAuthorization';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';

	// State
	$stateProvider
		.state('app.admin_patients', {
			url: '/patients',
			views: {
				'content@app': {
					template: '<admin-patients></admin-patients>'
				}
			}
		});

	// Navigation
	msNavigationServiceProvider.saveItem('fuse', {
		title: 'Admin',
		group: true,
		hidden: authorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuse.patients', {
		title: 'Patients',
		icon: 'icon-account-multiple',
		state: 'app.admin_patients',
		hidden: authorized,
		weight: 1
	});
}
export default angular
	.module('app.admin.patients', [])
	.config(config)
	.component('adminPatients', {
		controller,
		template
	});
