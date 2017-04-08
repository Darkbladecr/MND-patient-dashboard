import angular from 'angular';
function NavigationController($scope) {
	'ngInject';
	'use strict';

	var vm = this;

	// Data
	vm.bodyEl = angular.element('body');
	vm.folded = true;
	vm.msScrollOptions = {
		suppressScrollX: true
	};

	// Methods
	vm.toggleMsNavigationFolded = toggleMsNavigationFolded;

	//////////

	/**
	 * Toggle folded status
	 */
	function toggleMsNavigationFolded() {
		vm.folded = !vm.folded;
	}

	// Close the mobile menu on $stateChangeSuccess
	$scope.$on('$stateChangeSuccess', function() {
		vm.bodyEl.removeClass('ms-navigation-horizontal-mobile-menu-active');
	});
}
export default NavigationController;
