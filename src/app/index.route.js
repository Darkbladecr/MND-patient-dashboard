import verticalNavigationTemplate from './core/layouts/vertical-navigation.html';
import toolbarTemplate from './toolbar/layouts/vertical-navigation/toolbar.html';
import navigationTemplate from './navigation/layouts/vertical-navigation/navigation.html';
import quickPanelTemplate from './quick-panel/quick-panel.html';

function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {
	'ngInject';
	'use strict';

	$locationProvider.html5Mode(true);

	$urlRouterProvider.otherwise('/pages/auth/login');

	// State definitions
	$stateProvider
		.state('app', {
			abstract: true,
			views: {
				'main@': {
					template: verticalNavigationTemplate,
					controller: 'MainController as vm'
				},
				'toolbar@app': {
					template: toolbarTemplate,
					controller: 'ToolbarController as vm'
				},
				'navigation@app': {
					template: navigationTemplate,
					controller: 'NavigationController as vm'
				},
				'quickPanel@app': {
					template: quickPanelTemplate,
					controller: 'QuickPanelController as vm'
				}
			}
		});
}
export default routeConfig;
