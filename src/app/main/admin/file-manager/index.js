import './file-manager.scss';
import angular from 'angular';
import { authorizedAdmin } from '../../navigationAuthorization';

import adminFileManager from './file-manager.component';
import fileDetailsSidenav from './sidenavs/details/file-details-sidenav.component';
import fileMainSidenav from './sidenavs/main/file-main-sidenav.component';
import fileManagerGrid from './views/grid/grid-view.component';
import fileManagerList from './views/list/list-view.component';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider.state('app.file-manager', {
		url: '/admin/file-manager',
		views: {
			'content@app': {
				template: '<admin-file-manager></admin-file-manager>'
			}
		},
		bodyClass: 'file-manager'
	});

	// Navigation
	msNavigationServiceProvider.saveItem('fuse', {
		title: 'Admin',
		group: true,
		hidden: authorizedAdmin,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuse.file-manager', {
		title: 'File Manager',
		icon: 'icon-folder',
		state: 'app.file-manager',
		hidden: authorizedAdmin,
		weight: 1
	});
}

export default angular.module('app.file-manager', [])
	.config(config)
	.component('adminFileManager', adminFileManager)
	.component('fileManagerList', fileManagerList)
	.component('fileManagerGrid', fileManagerGrid)
	.component('fileDetailsSidenav', fileDetailsSidenav)
	.component('fileMainSidenav', fileMainSidenav);
