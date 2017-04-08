import angular from 'angular';
import Error404Controller from './error-404.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './error-404.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_error-404', {
        url: '/error/404',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_error-404': {
                template,
                controller: 'Error404Controller as vm'
            }
        },
        bodyClass: 'error-404'
    });
}

export default angular
    .module('app.pages.error-404', [])
    .config(config)
    .controller('Error404Controller', Error404Controller);
