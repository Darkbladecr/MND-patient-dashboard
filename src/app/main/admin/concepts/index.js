import controller from './concepts.controller';
import template from './concepts.html';
import angular from 'angular';
import { authorizedAuthor } from '../../navigationAuthorization';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider
		.state('app.admin_concepts', {
			url: '/admin/concepts',
			views: {
				'content@app': {
					template: '<admin-concepts></admin-concepts>'
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

	msNavigationServiceProvider.saveItem('fuse.concepts', {
		title: 'Concepts',
		icon: 'icon-bookmark-plus',
		state: 'app.admin_concepts',
		hidden: authorizedAuthor,
		weight: 1
	});
}

export default angular.module('app.admin.concepts', [])
	.config(config)
	.component('adminConcepts', {
		template,
		controller
	});
