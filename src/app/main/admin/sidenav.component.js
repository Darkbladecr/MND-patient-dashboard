import template from './sidenav.html';

class controller{
	constructor(toastService, AuthService){
		'ngInject';
		this.toastService = toastService;
		const token = AuthService.getToken();

		this.flowOptions = {
			target: this.importLocation,
			headers: {
				'X-Requested-By': 'QuesWebApp',
				'Authorization': token ? 'Bearer ' + token : null
			}
		}
	}
	uploadComplete($file, $message, $flow){
		this.toastService.simple($message);
		$flow.cancel();
		this.importCallback();
	}
	uploadError($file, $message, $flow){
		this.toastService.simple($message);
		$flow.cancel();
	}
}

export default {
	bindings: {
		title: '@',
		addTitle: '@',
		addElement: '&',
		importTitle: '@',
		importLocation: '<',
		importCallback: '&',
		elements: '<',
		onElementSelected: '&',
		elementSelected: '<',
		subTitle: '@',
		subElements: '<',
		onSubelementSelected: '&',
		subelementSelected: '<',
		resetFilters: '&',
	},
	controller,
	template
};
