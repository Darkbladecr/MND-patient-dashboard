import angular from 'angular';
import Error500Controller from './error-500.controller';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './error-500.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_error-500', {
        url: '/error/500',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_error-500': {
                template,
                controller: 'Error500Controller as vm'
            }
        },
        bodyClass: 'error-500'
    });

}

export default angular
    .module('app.pages.error-500', [])
    .config(config)
    .controller('Error500Controller', Error500Controller);
