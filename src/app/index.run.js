function runBlock($rootScope, $timeout, $state, editableThemes, AuthService) {
	'ngInject';
	'use strict';

	// 3rd Party Dependencies
	editableThemes.default.submitTpl =
		'<md-button class="md-icon-button" type="submit" aria-label="save"><md-icon md-font-icon="icon-checkbox-marked-circle" class="md-accent-fg md-hue-1"></md-icon></md-button>';
	editableThemes.default.cancelTpl =
		'<md-button class="md-icon-button" ng-click="$form.$cancel()" aria-label="cancel"><md-icon md-font-icon="icon-close-circle" class="icon-cancel"></md-icon></md-button>';

	// Activate loading indicator
	const stateChangeStartEvent = $rootScope.$on(
		'$stateChangeStart',
		function() {
			$rootScope.loadingProgress = true;
		}
	);

	// De-activate loading indicator
	const stateChangeSuccessEvent = $rootScope.$on(
		'$stateChangeSuccess',
		function(event, toState) {
			$timeout(() => ($rootScope.loadingProgress = false));

			const loggedIn = AuthService.isLoggedIn();
			if (loggedIn) {
				if (/^app.pages_auth/.test(toState.name)) {
					event.preventDefault();
					$timeout(() => $state.go('app.admin_patients'));
				}
			} else {
				if (!/^app.pages_auth/.test(toState.name)) {
					event.preventDefault();
					$timeout(() => $state.go('app.pages_auth_login'));
				}
			}
		}
	);

	// Store state in the root scope for easy access
	$rootScope.state = $state;

	// Cleanup
	$rootScope.$on('$destroy', function() {
		stateChangeStartEvent();
		stateChangeSuccessEvent();
	});
	$rootScope.$on('$stateChangeError', function(
		event,
		toState,
		toParams,
		fromState,
		fromParams,
		error
	) {
		switch (error) {
			case 'AUTH_REQUIRED':
				$state.go('app.pages_auth_login');
				break;
			case '!AUTH_REQUIRED':
				$state.go('app.admin_patients');
				break;
			case 'AUTH_LOW':
				$state.go('app.admin_patients');
				break;
			case 'BAD_REQUEST':
				$state.go('app.pages_error-500');
				break;
			case 'NOT_FOUND':
				$state.go('app.pages_error-404');
				break;
			default:
				$state.go('app.pages_error-404');
		}
	});
}
export default runBlock;
