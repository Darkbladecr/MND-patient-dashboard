export default class RegisterController {
	constructor(AuthService, $state, $scope, $log) {
		'ngInject';
		this.AuthService = AuthService;
		this.$state = $state;
		this.$scope = $scope;
		this.$log = $log;

	}
	checkUsername() {
		if(this.form.username && this.form.username.length > 5 ){
			this.AuthService.usernameAvailable(this.form.username).then((available) => {
				this.$scope.registerForm.email.$setValidity('available', available);
			});
		}
	}
	submit() {
		const user = {
			username: this.form.username,
			firstName: this.form.firstName,
			lastName: this.form.lastName,
			password: this.form.password,
			passwordConfirm: this.form.passwordConfirm
		};
		this.AuthService.register(user).then(() => {
			return this.$state.go('app.pages_auth_login');
		});
	}
}
