import angular from 'angular';
import contentTemplate from './../../../../core/layouts/content-only.html';
import template from './terms-conditions.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_terms-conditions', {
        url: '/pages/terms-conditions',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_terms-conditions': {
                template
            }
        },
        bodyClass: 'terms-conditions'
    });
}
export default angular
    .module('app.pages.terms-conditions', [])
    .config(config);
