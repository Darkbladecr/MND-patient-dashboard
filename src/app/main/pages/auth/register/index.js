import angular from 'angular';
import RegisterController from './register.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './register.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_auth_register', {
        url: '/pages/auth/register',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_auth_register': {
                template,
                controller: 'RegisterController as vm'
            }
        },
        bodyClass: 'register'
    });
}

export default angular
    .module('app.pages.auth.register', [])
    .config(config)
    .controller('RegisterController', RegisterController);
