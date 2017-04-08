import angular from 'angular';
import UKMedicalSchools from '../../../../../server/models/enum/UKMedicalSchools';
import classYears from '../../../../../server/models/enum/classYears';
import './settings.scss';
import addSubscriptionController from './addSubscription.controller';
import addSubscriptionDialog from './addSubscriptionDialog.html';

class settingsController {
	constructor($ngRedux, usersService, AuthService, AuthActions, $state, $mdDialog, $mdToast, $document, $timeout) {
		'ngInject';
		this.store = $ngRedux;
		this.usersService = usersService;
		this.AuthService = AuthService;
		this.AuthActions = AuthActions;
		this.$state = $state;
		this.$mdDialog = $mdDialog;

		this.expired = AuthService.isExpired();
		$timeout(() => {
			if (AuthService.isExpired()) {
				$mdToast.show(
					$mdToast.simple()
					.textContent('Your subscription has expired, please renew.')
					.action('Renew')
					.highlightAction(true)
					.position('top right')
					.parent($document[0].querySelector('#toastBounds'))
					.hideDelay(false)
				).then(() => this.addSubscription());
			}
		}, 2000);

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
				usersService.updateCard(token.id).then(card => {
					this.user.stripe.sources.unshift(card);
				});
			}
		});
	}
	$onInit() {
		this.unsubscribe = this.store.connect(this.mapStateToThis, this.AuthActions)(this);
		this.user = this.reduxUser;
		this.getSelf();
	}
	$onDestroy() {
		this.unsubscribe();
	}
	mapStateToThis(state) {
		return {
			reduxUser: state.user
		};
	}
	getSelf() {
		this.usersService.getSelf().then(user => {
			this.user = user;
			this.user.examDate = new Date(this.user.examDate);
			this.activeSubscription = this.user.subscription.every(sub => !sub.cancel_at_period_end);
		});
	}
	changeYears(classYear) {
		this.years = classYear === 'Graduated' ? this.yearsReverse : this.yearsForward;
	}
	updateAccountDetails() {
		const update = {
			firstName: this.user.firstName,
			lastName: this.user.lastName,
			classYear: this.user.classYear,
			graduationYear: this.user.graduationYear,
			examDate: new Date(this.user.examDate)
		};
		this.AuthService.updateAccount(update).then(() => {
			this.getSelf();
		});
	}
	updatePassword() {
		this.AuthService.changePassword(this.passwordForm.oldPassword, this.passwordForm.password).then(() => {
			this.getSelf();
		});
	}
	addSubscription(event) {
		this.$mdDialog.show({
			controller: addSubscriptionController,
			controllerAs: '$ctrl',
			targetEvent: event,
			template: addSubscriptionDialog,
			parent: angular.element(document.body),
		}).then(() => {
			return;
		});
	}
	reenableSubscription(id, plan) {
		this.$mdDialog.show(this.$mdDialog.confirm()
			.title('Re-enable Subscription')
			.textContent('Are you sure you would like to re-enable your subscription? You will still be charged when you subscription restarts.')
			.ariaLabel('Re-enable Subscription')
			.ok('Re-enable Subscription')
			.cancel('Cancel')
		).then(() => {
			this.usersService.reenableSubscription(id, plan).then(() => {
				this.getSelf();
			});
		});
	}
	cancelSubscription(id) {
		this.$mdDialog.show(this.$mdDialog.confirm()
			.title('Cancel Subscription')
			.textContent('Are you sure you would like to cancel your subscription? You will still be able to access all features until your expiry date.')
			.ariaLabel('Cancel Subscription')
			.ok('Cancel Subscription')
			.cancel('Cancel')
		).then(() => {
			this.usersService.cancelSubscription(id).then(() => {
				this.getSelf();
			});
		});
	}
	changeCard() {
		this.stripeHandle.open({
			name: 'Ques',
			description: 'Update card used by Ques',
			email: this.user.username,
			allowRememberMe: false,
			zipCode: false,
			panelLabel: 'Update'
		});
	}
}

export default settingsController;
