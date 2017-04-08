import angular from 'angular';
import LogRocket from 'logrocket';
import template from './feedback.html';

class feedbackController {
	constructor($ngRedux, $mdDialog, $http) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.user = this.store.getState().user;
		this.$http = $http;
	}
	sendFeedback() {
		const { user } = this.store.getState();
		let recording = '';
		if(process.env.NODE_ENV === 'production'){
			recording = LogRocket.recordingURL;
			LogRocket.identify(user._id, {
				name: `${user.firstName} ${user.lastName}`,
				email: user.username
			});
		}
		let message = `${this.messageBody}

---
LogRocket: ${recording}
User: ${JSON.stringify(this.user, null, 2)}`;

		let conversation = {
			username: `${this.user.firstName}_${this.user.lastName}`,
			icon_emoji: ':inbox_tray:',
			text: 'New Help Ticket Received',
			attachments: [{
				title: this.subject,
				title_link: recording,
				text: `${this.messageBody}

---
<${recording}|LogRocket Recording>
<mailto:${this.user.username}|${this.user.username}>`
			}]
		}
		this.$http.post('/api/slack_support', { slack: conversation, subject: this.subject, message }).then(() => this.closeDialog());
	}
	closeDialog() {
		this.$mdDialog.hide();
	}
	cancelDialog() {
		this.$mdDialog.cancel();
	}
}

export default class ToolbarController {
	constructor($ngRedux, $scope, $state, $mdSidenav, $mdDialog, msNavigationService, AuthService, toastService, $timeout) {
		'ngInject';
		this.store = $ngRedux;
		this.$state = $state;
		this.$mdSidenav = $mdSidenav;
		this.$mdDialog = $mdDialog;
		this.msNavigationService = msNavigationService;
		this.AuthService = AuthService;
		this.toastService = toastService;
		this.$timeout = $timeout;
		this.loggedIn = AuthService.isLoggedIn();

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
		let unsubscribe = this.store.connect(this.mapStateToThis)(this);
		$scope.$on('$destroy', unsubscribe);
	}
	mapStateToThis(state) {
		return {
			currentUser: state.user
		};
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
	feedback(ev) {
		this.$mdDialog.show({
			controller: feedbackController,
			controllerAs: 'vm',
			template,
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose: false
		}).then(() => this.toastService.simple('Message sent.'));
	}
	subscribe(){
		this.$state.go('app.pages_auth_register');
	}
}
