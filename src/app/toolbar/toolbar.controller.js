import angular from 'angular';

export default class ToolbarController {
	constructor($scope, $state, $mdSidenav, $mdDialog, msNavigationService, AuthService, toastService, $timeout) {
		'ngInject';
		this.$state = $state;
		this.$mdSidenav = $mdSidenav;
		this.$mdDialog = $mdDialog;
		this.msNavigationService = msNavigationService;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.$timeout = $timeout;
		this.loggedIn = AuthService.isLoggedIn();

		this.currentUser = AuthService.currentUser()

		this.bodyEl = angular.element('body');
		this.userStatusOptions = [{
			'title': 'Online',
			'icon': 'icon-checkbox-marked-circle',
			'color': '#4CAF50'
		}, {
			'title': 'Away',
			'icon': 'icon-clock',
			'color': '#FFC107'
		}, {
			'title': 'Do not Disturb',
			'icon': 'icon-minus-circle',
			'color': '#F44336'
		}, {
			'title': 'Invisible',
			'icon': 'icon-checkbox-blank-circle-outline',
			'color': '#BDBDBD'
		}, {
			'title': 'Offline',
			'icon': 'icon-checkbox-blank-circle-outline',
			'color': '#616161'
		}];
		this.userStatus = this.userStatusOptions[0];
	}
	toggleSidenav(sidenavId) {
		this.$mdSidenav(sidenavId).toggle();
	}
	setUserStatus(status) {
		this.userStatus = status;
	}
	logout() {
		this.AuthService.logOut();
		this.$timeout(() => this.$state.go('app.pages_auth_login'));
	}
	toggleHorizontalMobileMenu() {
		this.bodyEl.toggleClass('ms-navigation-horizontal-mobile-menu-active');
	}
	toggleMsNavigationFolded() {
		this.msNavigationService.toggleFolded();
	}
}
