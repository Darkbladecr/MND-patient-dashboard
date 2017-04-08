import angular from 'angular';
import MaintenanceController from './maintenance.controller';
import contentTemplate from '../../../core/layouts/content-only.html'
import template from './maintenance.html';

function config($stateProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider.state('app.pages_maintenance', {
        url: '/pages/maintenance',
        views: {
            'main@': {
                template: contentTemplate,
                controller: 'MainController as vm'
            },
            'content@app.pages_maintenance': {
                template,
                controller: 'MaintenanceController as vm'
            }
        },
        bodyClass: 'maintenance'
    });
}

export default angular
    .module('app.pages.maintenance', [])
    .config(config)
    .controller('MaintenanceController', MaintenanceController);
