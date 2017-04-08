import angular from 'angular';
import LoginController from './login.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './login.html';

function config($stateProvider) {
	'ngInject';
	'use strict';

	// State
	$stateProvider.state('app.pages_auth_login', {
		url: '/pages/auth/login',
		views: {
			'main@': {
				template: contentTemplate,
				controller: 'MainController as vm'
			},
			'content@app.pages_auth_login': {
				template,
				controller: 'LoginController as vm'
			}
		},
		bodyClass: 'login'
	});
}

export default angular
	.module('app.pages.auth.login', [])
	.config(config)
	.controller('LoginController', LoginController);
