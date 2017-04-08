export default class ForgotPasswordController{
	constructor(AuthService){
		'ngInject';
		this.AuthService = AuthService;
		this.form = {};
	}
	reset(email){
		return this.AuthService.reset(email);
	}
}
