import angular from 'angular';
import 'angular-jwt';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import 'angular1-apollo';

import { APIInterceptor, APIInterceptorRun } from './api-interceptor';
// import APIInterceptor from './api.service';
import AuthService from './auth.service';
import categoriesService from './categories.service';
import graphqlService from './graphql.service';
import pictureService from './picture.service';
import questionsService from './questions.service';
import recallsService from './recalls.service';
import toastService from './toast.service';
import usersService from './users.service';
import marksheetService from './marksheet.service';
import todoService from './todo.service';

function config($httpProvider, apolloProvider) {
	'ngInject';
	'use strict';

	const networkInterface = createNetworkInterface({ uri: '/graphql' });
	networkInterface.use([{
		applyMiddleware(req, next) {
			if (!req.options.headers) {
				req.options.headers = {}; // Create the header object if needed.
			}
			req.options.headers['X-Requested-By'] = 'QuesWebApp';
			req.options.headers.Authorization = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null;
			next();
		}
	}]);
	networkInterface.useAfter([{
		applyAfterware({ response }, next) {
			if (response.status === 401) {
				return window.location = '/pages/auth/login';
			} else if (response.status === 404) {
				return window.location = '/error/404';
			} else if (response.status === 500) {
				return window.location = '/error/500';
			}
			next();
		}
	}]);

	const connectToDevTools = process.env.NODE_ENV === 'production' ? false : true;
	const client = new ApolloClient({
		networkInterface,
		addTypename: false,
		connectToDevTools,
		dataIdFromObject: (result) => {
			if (result._id) {
				return result._id;
			}
			return null;
		}
	});
	apolloProvider.defaultClient(client);

	$httpProvider.defaults.headers.common['X-Requested-By'] = 'QuesWebApp';
	$httpProvider.interceptors.push('APIInterceptor');
}

export default angular
	.module('app.services', [
		'angular-jwt',
		'angular-apollo'
	])
	.factory('APIInterceptor', APIInterceptor)
	.config(config)
	.run(APIInterceptorRun)
	.service('graphqlService', graphqlService)
	.service('toastService', toastService)
	.service('AuthService', AuthService)
	.service('categoriesService', categoriesService)
	.service('usersService', usersService)
	.service('questionsService', questionsService)
	.service('recallsService', recallsService)
	.service('pictureService', pictureService)
	.service('marksheetService', marksheetService)
	.service('todoService', todoService);