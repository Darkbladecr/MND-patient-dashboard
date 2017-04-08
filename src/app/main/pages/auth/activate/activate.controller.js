export default class ActivateController {
	constructor(AuthService, $stateParams, $timeout, $state) {
		'ngInject';
		this.AuthService = AuthService
		this.$stateParams = $stateParams;
		this.$timeout = $timeout;
		this.$state = $state;

		this.activated = false;
		this.title = 'Activating Your Account'
		this.message = 'Loading...';
	}
	$onInit() {
		this.AuthService.activate(this.$stateParams.id).then(() => {
			this.activated = true;
			this.message = 'Account activated, you can now login.';
			this.$timeout(() => this.$state.go('app.restricted_dashboard'), 3000);
		}, (err) => {
			this.title = 'Activation Error';
			this.message = err;
		});
	}
}
