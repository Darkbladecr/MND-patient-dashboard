const apiInterceptor = function($location, $window) {
	return {
		request: function(config) {
			config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
			return config;
		},

		requestError: function(config) {
			return config;
		},

		response: function(res) {
			return res;
		},

		responseError: function(res) {
			if (res.status === 401) {
				$location.path('/pages/auth/login');
			} else if (res.status === 404) {
				$location.path('/pages/errors/error-404');
			} else if (res.status >= 400) {
				$location.path('/pages/errors/error-500');
			}
			return res;
		}
	}
}
apiInterceptor.$inject = ['$location', '$window'];
export default apiInterceptor;
