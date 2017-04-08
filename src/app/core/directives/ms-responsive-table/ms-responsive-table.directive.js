import angular from 'angular';

function msResponsiveTableDirective() {
	'ngInject';
    'use strict';

    return {
        restrict: 'A',
        link: function(scope, iElement) {
            // Wrap the table
            var wrapper = angular.element('<div class="ms-responsive-table-wrapper"></div>');
            iElement.after(wrapper);
            wrapper.append(iElement);

            //////////
        }
    };
}
export default msResponsiveTableDirective;
