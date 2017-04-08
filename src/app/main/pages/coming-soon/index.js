import angular from 'angular';
import ComingSoonController from './coming-soon.controller';
import contentTemplate from '../../../core/layouts/content-only.html'
import template from './coming-soon.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_coming-soon', {
        url: '/pages/coming-soon',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_coming-soon': {
                template,
                controller: 'ComingSoonController as vm'
            }
        },
        bodyClass: 'coming-soon'
    });
}

export default angular
    .module('app.pages.coming-soon', [])
    .config(config)
    .controller('ComingSoonController', ComingSoonController);
