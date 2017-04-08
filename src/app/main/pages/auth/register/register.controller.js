import UKMedicalSchools from '../../../../../../server/models/enum/UKMedicalSchools';
import classYears from '../../../../../../server/models/enum/classYears';

export default class RegisterController {
	constructor(AuthService, $state, $scope, $log) {
		'ngInject';
		this.AuthService = AuthService;
		this.$state = $state;
		this.$scope = $scope;
		this.$log = $log;

		if(process.env.NODE_ENV === 'production'){
			this.plan1 = 'launch-1month';
			this.plan2 = 'launch-3month';
		} else {
			this.plan1 = 'test-1month';
			this.plan2 = 'test-3month';
		}

		this.universities = UKMedicalSchools;
		this.classes = classYears;
		const today = new Date();
		const year = today.getFullYear();
		this.yearsForward = [];
		this.yearsReverse = [];
		for (var i = 0; i < 10; i++) {
			this.yearsForward.push(year + i);
			this.yearsReverse.push(year - i);
		}
		this.years = this.yearsForward;
		this.stripeHandle = StripeCheckout.configure({
			key: process.env.NODE_ENV === 'production' ? 'pk_live_qSUng1c2iZoJIIwLvCgbl1mh' : 'pk_test_ztbYgbnxewC0WH9Cm8I7OiY5',
			image: 'https://s3.amazonaws.com/stripe-uploads/acct_16tNGEBMTSmKGzYQmerchant-icon-1489014360435-logo.png',
			locale: 'auto',
			token: (token) => {
				let user = {
					firstName: this.form.firstName,
					lastName: this.form.lastName,
					classYear: this.form.classYear,
					graduationYear: this.form.graduationYear,
					university: this.form.university,
					plan: this.form.plan,
					stripe: token.id,
					username: this.form.username,
					password: this.form.password,
					passwordConfirm: this.form.passwordConfirm
				};
				this.AuthService.register(user).then(() => {
					return this.$state.go('app.pages_auth_login');
				});
			}
		});
	}
	changeYears(classYear) {
		this.years = classYear === 'Graduated' ? this.yearsReverse : this.yearsForward;
	}
	checkUsername() {
		if(this.form.username && this.form.username.length > 5 ){
			this.AuthService.usernameAvailable(this.form.username).then((available) => {
				this.$scope.registerForm.email.$setValidity('available', available);
			});
		}
	}
	submit() {
		const amount = this.form.plan === this.plan1 ? 1000 : 1500;
		this.stripeHandle.open({
			name: 'Ques',
			description: `${this.form.plan === this.plan1 ? '1 month' : '3 months'} subscription to Ques`,
			email: this.form.username,
			allowRememberMe: false,
			zipCode: false,
			currency: 'gbp',
			amount
		});
	}
	samples() {
		this.$state.go('app.sample_questions');
	}
}
