function APIInterceptor($q, $location, $rootScope) {
	'ngInject';
	return {
		request(req) {
			req.headers.Authorization = localStorage.getItem('token') ? 'Bearer ' + localStorage.getItem('token') : null;
			return req;
		},
		responseError(res) {
			if (res.status === 401) {
				return $rootScope.$emit('unauthorized');
			} else if (res.status === 404) {
				return $rootScope.$emit('not_found');
			} else if (res.status >= 400) {
				return $rootScope.$emit('server_error');
			}
			return $q.reject(res);
		}
	};
}

function APIInterceptorRun($rootScope, $state) {
	'ngInject';
	$rootScope.$on('unauthorized', () => $state.transitionTo('app.pages_auth_login'));
	$rootScope.$on('not_found', () => $state.transitionTo('app.pages_error-404'));
	$rootScope.$on('server_error', () => $state.transitionTo('app.pages_error-500'));

}

export { APIInterceptor, APIInterceptorRun };
