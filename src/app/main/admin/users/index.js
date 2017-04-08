import angular from 'angular';
import controller from './users.controller';
import template from './users.html';
import { authorizedAuthor, authorizedAdmin } from '../../navigationAuthorization';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';

	// State
	$stateProvider
		.state('app.admin_users', {
			url: '/admin/users',
			views: {
				'content@app': {
					template: '<admin-users></admin-users>'
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

	msNavigationServiceProvider.saveItem('fuse.users', {
		title: 'Users',
		icon: 'icon-account-multiple',
		state: 'app.admin_users',
		hidden: authorizedAdmin,
		weight: 1
	});
}
export default angular
	.module('app.admin.users', [])
	.config(config)
	.component('adminUsers', {
		controller,
		template
	});
