import 'jquery';
import '../libs_modified/fatools.scss';
import angular from 'angular';

import appCore from './core';
import IndexController from './index.controller';
import apiService from './index.api';
import appMain from './main/main.module';
import appNavigation from './navigation';
import appQuickPanel from './quick-panel';
import appServices from './services';
import appToolbar from './toolbar';
import config from './index.config';
import routeConfig from './index.route';
import runBlock from './index.run';

angular
    .module('fuse', [

        // Core
        appCore.name,
        appServices.name,

        // Navigation
        appNavigation.name,

        // Toolbar
        appToolbar.name,

        // Quick Panel
        appQuickPanel.name,

        // Apps
		appMain.name
        // 'app.dashboards',
        // 'app.calendar',
        // 'app.e-commerce',
        // 'app.mail',
        // 'app.chat',
        // 'app.file-manager',
        // 'app.gantt-chart',
        // 'app.scrumboard',
        // 'app.todo',
        // 'app.contacts',
        // 'app.notes',

        // Pages
        // appPages.name,
        // appAdmin.name,
        // 'app.sample'

        // User Interface
        // 'app.ui',

        // Components
        // 'app.components'
    ])
    .run(runBlock)
    .config(config)
    .config(routeConfig)
    .controller('IndexController', IndexController)
    .factory('api', apiService)
    ;
