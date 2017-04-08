import angular from 'angular';
import { authorized, authorizedExpired } from '../navigationAuthorization';

import { MarksheetActions } from './marksheet.state';
import { TodoActions } from './todo.state';
import dashboardController from './dashboard/dashboard.controller';
import dashboardTemplate from './dashboard/dashboard.html';
import queryController from './query/query.controller';
import queryTemplate from './query/query.html';
import recallQueryController from './queryRecall/query.controller';
import recallQueryTemplate from './queryRecall/query.html';
import testController from './test/questions.controller';
import testTemplate from './test/testQuestions.html';
import recallTodoController from './recallTodo/recalls.controller';
import recallTodoTemplate from './recallTodo/testRecalls.html';
import settingsController from './settings/settings.controller';
import settingsTemplate from './settings/settings.html';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider
		.state('app.restricted_dashboard', {
			url: '/dashboard',
			views: {
				'content@app': {
					template: '<restricted-dashboard></restricted-dashboard>'
				}
			}
		})
		.state('app.restricted_settings', {
			url: '/settings',
			views: {
				'content@app': {
					template: '<restricted-settings></restricted-settings>'
				}
			}
		})
		.state('app.restricted_query', {
			url: '/question-builder',
			views: {
				'content@app': {
					template: '<restricted-query></restricted-query>'
				}
			}
		})
		.state('app.restricted_test', {
			url: '/questions',
			views: {
				'content@app': {
					template: '<restricted-test></restricted-test>'
				}
			}
		})
		.state('app.restricted_recallquery', {
			url: '/card-builder',
			views: {
				'content@app': {
					template: '<restricted-recall-query></restricted-recall-query>'
				}
			}
		})
		.state('app.restricted_recall', {
			url: '/cards',
			views: {
				'content@app': {
					template: '<restricted-recall-test></restricted-recall-test>'
				}
			}
		});

	// Navigation
	msNavigationServiceProvider.saveItem('fuseRestricted', {
		title: 'PAGES',
		group: true,
		hidden: authorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseRestricted.dashboard', {
		title: 'Dashboard',
		icon: 'icon-tile-four',
		state: 'app.restricted_dashboard',
		hidden: authorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseRestricted.query', {
		title: 'Questions',
		icon: 'icon-format-list-numbers',
		state: 'app.restricted_query',
		hidden: authorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseRestricted.recallquery', {
		title: 'Ques Cards',
		icon: 'icon-checkbox-multiple-marked',
		state: 'app.restricted_recallquery',
		hidden: authorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseExpired', {
		title: 'SETTINGS',
		group: true,
		hidden: authorizedExpired,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseExpired.settings', {
		title: 'My Settings',
		icon: 'icon-account',
		state: 'app.restricted_settings',
		hidden: authorizedExpired,
		weight: 1
	});
}

export default angular.module('app.restricted', [])
	.config(config)
	.factory('MarksheetActions', MarksheetActions)
	.factory('TodoActions', TodoActions)
	.component('restrictedDashboard', {
		controller: dashboardController,
		template: dashboardTemplate
	})
	.component('restrictedSettings', {
		controller: settingsController,
		template: settingsTemplate
	})
	.component('restrictedQuery', {
		controller: queryController,
		template: queryTemplate
	})
	.component('restrictedRecallQuery', {
		controller: recallQueryController,
		template: recallQueryTemplate
	})
	.component('restrictedTest', {
		controller: testController,
		template: testTemplate
	})
	.component('restrictedRecallTest', {
		controller: recallTodoController,
		template: recallTodoTemplate
	});
