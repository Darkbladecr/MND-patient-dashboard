export default class UserDialogController {
	constructor($ngRedux, $mdDialog, user, UserActions) {
		'ngInject';
		this.store = $ngRedux;
		this.$mdDialog = $mdDialog;
		this.UserActions = UserActions;
		this.title = '_id' in user ? 'Edit User' : 'New User';
		this.user = user;
	}
	updateUser() {
		if ('_id' in this.user) {
			const userData = {
				_id: this.user._id,
				username: this.user.username,
				firstName: this.user.firstName,
				lastName: this.user.lastName,
			};
			this.store.dispatch(
				this.UserActions.updateUser(userData)
			);
			this.closeDialog();
		} else {
			this.store.dispatch(
				this.UserActions.createUser(this.user)
			);
			this.closeDialog();
		}
	}
	closeDialog() {
		this.$mdDialog.hide();
	}
	cancelDialog(){
		this.$mdDialog.cancel();
	}
}
