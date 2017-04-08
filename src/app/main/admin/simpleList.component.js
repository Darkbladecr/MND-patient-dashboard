import angular from 'angular';
import template from './simpleList.html';

class controller {
	constructor($window) {
		'ngInject';
		this.$window = $window;
		this.options = {
			autoSelect: false,
			boundaryLinks: true,
			largeEditDialog: false,
			pageSelector: false,
			rowSelection: false
		};
		this.query = {
			order: 'name',
			limit: 10,
			limitOptions: [10, 25, 50],
			page: 1
		};
	}
	pageChange(){
		const container = this.$window.innerWidth < 600 ? angular.element(document.getElementById('content')) : angular.element(document.getElementById('list-pane'));
		container.scrollTop(0);
	}
}

export default {
	bindings: {
		items: '<',
		editDialog: '&',
		deleteDialog: '&',
	},
	controller,
	template
};
