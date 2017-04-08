export default class ResetPasswordController {
	constructor(AuthService, $state, $location) {
		'ngInject';
		this.AuthService = AuthService;
		this.$state = $state;
		this.$location = $location;

		this.form = {};
	}
	reset() {
		let search = this.$location.search();
		this.AuthService.resetPassword(this.form.email, search.id, this.form.password)
			.then(() => this.$state.go('app.pages_auth_login'));
	}
}
