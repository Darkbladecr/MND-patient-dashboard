import angular from 'angular';
import { authorizedAuthor } from '../../navigationAuthorization';
import controller from './recall.controller';
import template from './recall.html';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider
		.state('app.admin_recalls', {
			url: '/admin/recalls',
			views: {
				'content@app': {
					template: '<admin-recalls></admin-recalls>'
				}
			}
		});

	// Navigation
	msNavigationServiceProvider.saveItem('fuse', {
		title: 'Admin',
		group: true,
		hidden: authorizedAuthor,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuse.recalls', {
		title: 'Recalls',
		icon: 'icon-flip-to-front',
		state: 'app.admin_recalls',
		hidden: authorizedAuthor,
		weight: 1
	});
}

export default angular.module('app.admin.recalls', [])
	.config(config)
	.component('adminRecalls', {
		controller,
		template
	});
