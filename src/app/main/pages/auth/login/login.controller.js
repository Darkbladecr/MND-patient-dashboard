export default class LoginController {
	constructor(AuthService, $state) {
		'ngInject';
		this.AuthService = AuthService;
		this.$state = $state;
	}
	submit() {
		const user = {
			username: this.form.email,
			password: this.form.password,
			remember: this.form.remember || false
		};
		this.AuthService.logIn(user).then(() => {
			if (this.AuthService.isLoggedIn()) {
				this.$state.go('app.admin_patients');
			}
		});
	}
}
