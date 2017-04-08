import angular from 'angular';
import './test.scss';

import { user as adminUser, users } from './admin/users/users.state';
import { autoRehydrate, persistStore } from 'redux-persist';
import { categories, category, concepts, topic, topics, CategoryActions } from './categories.state';
import { marksheet } from './restricted/marksheet.state';
import { todo } from './restricted/todo.state';

import LogRocket from 'logrocket';
import MainController from './main.controller';
import appAdmin from './admin';
import appPages from './pages';
import appSamples from './samples';
import appRestricted from './restricted';
import { combineReducers } from 'redux';
import localforage from 'localforage';
import { lightgallery } from './main.directive';
import { questions } from './admin/questions/questions.state';
import { recalls } from './admin/recall/recall.state';
import thunk from 'redux-thunk';
import { user } from './pages/auth/auth.state';

if (process.env.NODE_ENV === 'production') {
	LogRocket.init('sysmed/quesmed', {
		shouldShowReportingButton: false,
	});
}

const config = ($ngReduxProvider) => {
	'ngInject';
	let rootReducer = combineReducers({
		admin: combineReducers({
			concepts,
			questions,
			recalls,
			users,
			user: adminUser
		}),
		topics,
		topic,
		categories,
		category,
		user,
		marksheet,
		todo
	});
	const enhancers = [autoRehydrate()];
	if (process.env.NODE_ENV === 'production') {
		enhancers.push(LogRocket.reduxEnhancer());
	} else {
		if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
			enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
		}
	}
	$ngReduxProvider.createStoreWith(rootReducer, [thunk], enhancers);

};

let storePersistor = {};

const run = ($rootScope, $ngRedux) => {
	'ngInject';
	storePersistor = persistStore($ngRedux, {
		storage: localforage
	});
	const withDevTools = (
		// process.env.NODE_ENV === 'development' &&
		typeof window !== 'undefined' && window.devToolsExtension
	);
	if (withDevTools) {
		$rootScope.$evalAsync();
		$ngRedux.subscribe(() => {
			setTimeout($rootScope.$apply.bind($rootScope), 100);
		});
	}
};


export default angular.module('app.main', [
		//Pages
		appPages.name,
		appSamples.name,
		appRestricted.name,
		appAdmin.name
	])
	.config(config)
	.run(run)
	.controller('MainController', MainController)
	.factory('CategoryActions', CategoryActions)
	.directive('lightgallery', lightgallery);

export { storePersistor };
