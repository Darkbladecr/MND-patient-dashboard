import angular from 'angular';
import ForgotPasswordController from './forgot-password.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './forgot-password.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_auth_forgot-password', {
        url: '/pages/auth/forgot-password',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_auth_forgot-password': {
                template,
                controller: 'ForgotPasswordController as vm'
            }
        },
        bodyClass: 'forgot-password'
    });
}

export default angular
    .module('app.pages.auth.forgot-password', [])
    .config(config)
    .controller('ForgotPasswordController', ForgotPasswordController);
