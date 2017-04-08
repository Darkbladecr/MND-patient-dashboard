import angular from 'angular';
import ResetPasswordController from './reset-password.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './reset-password.html';

function config($stateProvider) {
	'ngInject';
	'use strict';

	// State
	$stateProvider.state('app.pages_auth_reset-password', {
		url: '/pages/auth/reset-password',
		views: {
			'main@': {
				template: contentTemplate,
				controller: 'MainController as vm'
			},
			'content@app.pages_auth_reset-password': {
				template,
				controller: 'ResetPasswordController as vm'
			}
		},
		resolve: resolve,
		bodyClass: 'reset-password'
	});
}

function resolve($q, $location) {
	'ngInject';
	'use strict';
	var search = $location.search();
	var mongoId = /^[0-9a-fA-F]{24}$/;
	if (mongoId.test(search.id)) {
		return $q.resolve();
	} else {
		return $q.reject('NOT_FOUND');
	}
}

export default angular
	.module('app.pages.auth.reset-password', [])
	.config(config)
	.controller('ResetPasswordController', ResetPasswordController);
