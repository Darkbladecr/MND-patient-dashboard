import angular from 'angular';
import InvoiceController from './invoice.controller';
import modernTemplate from '../../../main/pages/invoice/views/modern/modern.html';
import compactTemplate from '../../../main/pages/invoice/views/compact/compact.html';

function config($stateProvider, msApiProvider) {
	'ngInject';
    'use strict';

    // State
    $stateProvider
        .state('app.pages_invoice_modern', {
            url: '/pages/invoice/modern',
            views: {
                'content@app': {
                    template: modernTemplate,
                    controller: 'InvoiceController as vm'
                }
            },
            resolve: {
                Invoice: function(msApi) {
                    return msApi.resolve('invoice@get');
                }
            },
            bodyClass: 'invoice printable'
        })
        .state('app.pages_invoice_compact', {
            url: '/pages/invoice/compact',
            views: {
                'content@app': {
                    template: compactTemplate,
                    controller: 'InvoiceController as vm'
                }
            },
            resolve: {
                Invoice: function(msApi) {
                    return msApi.resolve('invoice@get');
                }
            },
            bodyClass: 'invoice printable'
        });

    // Api
    msApiProvider.register('invoice', ['app/data/invoice/invoice.json']);
}

export default angular
    .module('app.pages.invoice', [])
    .config(config)
    .controller('InvoiceController', InvoiceController);
