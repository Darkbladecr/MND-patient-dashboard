import controller from './categories.controller';
import template from './categories.html';
import angular from 'angular';
import { authorizedAuthor } from '../../navigationAuthorization';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';

	// State
	$stateProvider
		.state('app.admin_categories', {
			url: '/admin/categories',
			views: {
				'content@app': {
					template: '<categories-admin></categories-admin>'
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

	msNavigationServiceProvider.saveItem('fuse.categories', {
		title: 'Categories',
		icon: 'icon-label',
		state: 'app.admin_categories',
		hidden: authorizedAuthor,
		weight: 1
	});
}
export default angular.module('app.admin.categories', [])
	.config(config)
	.component('categoriesAdmin', {
		template,
		controller
	});
