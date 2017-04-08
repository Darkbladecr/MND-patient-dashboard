export default class toastService {
	constructor($mdToast, $document) {
		'ngInject';
		this.$mdToast = $mdToast;
		this.$document = $document;
	}
	simple(message, position = 'top right', parent = '#toastBounds', time = 3000) {
		return this.$mdToast.show(
			this.$mdToast.simple()
			.textContent(message)
			.position(position)
			.parent(this.$document[0].querySelector(parent))
			.hideDelay(time)
		);
	}
	error(message, position = 'top right', parent = '#toastBounds', time = 0){
		return this.$mdToast.show(
			this.$mdToast.simple()
			.textContent(message)
			.action('Close')
			.position(position)
			.parent(this.$document[0].querySelector(parent))
			.hideDelay(time)
		);
	}
}
