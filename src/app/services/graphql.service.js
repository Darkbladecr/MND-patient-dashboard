import angular from 'angular';

export default class graphqlService {
	constructor(toastService, $state) {
		'ngInject';
		this.toastService = toastService;
		this.$state = $state;
	}
	extract(result) {
		if (result.graphQLErrors) {
			throw result;
		} else {
			if ('restricted' in result.data) {
				return angular.copy(result.data.restricted);
			} else if ('admin' in result.data) {
				return angular.copy(result.data.admin);
			} else {
				return angular.copy(result.data);
			}
		}
	}
	error(err) {
		const errMessages = err.graphQLErrors.map(e => e.message);
		if (errMessages.includes('Token is invalid or missing.')) {
			return this.$state.go('app.pages.auth.login');
		} else if (errMessages.includes('Token expired.')) {
			return this.$state.go('app.pages.auth.login');
		// } else if (errMessages.includes('Your account has expired.')) {
		// 	return this.$state.go('app.pages.auth.login');
		} else if (errMessages.includes('Not Authorized.')) {
			return this.$state.go('app.restricted_dashboard');
		}
		return this.toastService.error(errMessages.join(' '));
	}
}
