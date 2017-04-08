import angular from 'angular';
import { authorizedAuthor } from '../../navigationAuthorization';
import controller from './questions.controller';
import template from './questions.html';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider
		.state('app.admin_questions', {
			url: '/admin/questions',
			views: {
				'content@app': {
					template: '<admin-questions></admin-questions>'
				}
			}
		});

	// Navigation
	msNavigationServiceProvider.saveItem('fuse', {
		title: 'Admin',
		group: true,
		hidden: authorizedAuthor,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuse.questions', {
		title: 'Questions',
		icon: 'icon-forum',
		state: 'app.admin_questions',
		hidden: authorizedAuthor,
		weight: 1
	});
}

export default angular.module('app.admin.questions', [])
	.config(config)
	.component('adminQuestions', {
		controller,
		template
	});
