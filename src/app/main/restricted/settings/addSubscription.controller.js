class addSubscriptionController {
	constructor($mdDialog, usersService) {
		'ngInject';
		this.$mdDialog = $mdDialog;
		this.usersService = usersService;
		if (process.env.NODE_ENV === 'production') {
			this.plan1 = 'launch-1month';
			this.plan2 = 'launch-3month';
		} else {
			this.plan1 = 'test-1month';
			this.plan2 = 'test-3month';
		}
	}
	save() {
		this.usersService.addSubscription(this.plan).then(() => {
			this.$mdDialog.hide();
		});
	}
	cancel() {
		this.$mdDialog.cancel();
	}
}

export default addSubscriptionController;
