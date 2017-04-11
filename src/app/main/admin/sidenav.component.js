import template from './sidenav.html';
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
	template
};
