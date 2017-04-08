import angular from 'angular';
import ActivateController from './activate.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './activate.html';

function config($stateProvider) {
	'ngInject';
	'use strict';

	// State
	$stateProvider.state('app.pages_auth_activate', {
		url: '/pages/auth/activate/:id',
		views: {
			'main@': {
				template: contentTemplate,
				controller: 'MainController as vm'
			},
			'content@app.pages_auth_activate': {
				template,
				controller: 'ActivateController as vm'
			}
		},
		resolve: {
			userId: resolve
		},
		bodyClass: 'activate'
	});
}

function resolve($q, $stateParams) {
	'ngInject';
	'use strict';
	var checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
	if (checkForHexRegExp.test($stateParams.id)) {
		return $q.resolve();
	} else {
		return $q.reject('AUTH_REQUIRED');
	}
}

export default angular
	.module('app.pages.auth.activate', [])
	.config(config)
	.controller('ActivateController', ActivateController);
