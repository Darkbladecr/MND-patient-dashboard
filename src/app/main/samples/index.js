import angular from 'angular';
import { notAuthorized } from '../navigationAuthorization';

import controllerSampleQustions from './questions/questions.controller';
import templateSampleQuestions from '../restricted/test/testQuestions.html';

import controllerSampleRecalls from './recalls/recalls.controller';
import templateSampleRecalls from '../restricted/recallTodo/testRecalls.html';

function config($stateProvider, msNavigationServiceProvider) {
	'ngInject';
	'use strict';
	// State
	$stateProvider
		.state('app.sample_questions', {
			url: '/sample/questions',
			views: {
				'content@app': {
					template: '<sample-questions></sample-questions>'
				}
			}
		})
		.state('app.sample_recalls', {
			url: '/sample/recalls',
			views: {
				'content@app': {
					template: '<sample-recalls></sample-realls>'
				}
			}
		});

	// Navigation
	msNavigationServiceProvider.saveItem('fuseSamples', {
		title: 'SAMPLES',
		group: true,
		hidden: notAuthorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseSamples.sample_questions', {
		title: 'Questions',
		icon: 'icon-forum',
		state: 'app.sample_questions',
		hidden: notAuthorized,
		weight: 1
	});

	msNavigationServiceProvider.saveItem('fuseSamples.sample_recalls', {
		title: 'Ques Cards',
		icon: 'icon-flip-to-front',
		state: 'app.sample_recalls',
		hidden: notAuthorized,
		weight: 1
	});
}

export default angular.module('app.samples', [])
	.config(config)
	.component('sampleQuestions', {
		controller: controllerSampleQustions,
		template: templateSampleQuestions
	})
	.component('sampleRecalls', {
		controller: controllerSampleRecalls,
		template: templateSampleRecalls
	});
