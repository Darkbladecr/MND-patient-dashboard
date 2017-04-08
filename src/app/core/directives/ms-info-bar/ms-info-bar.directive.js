import template from './ms-info-bar.html';

function msInfoBarDirective($document) {
	'ngInject';
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        transclude: true,
        template,
        link: function(scope, iElement) {
            var body = $document.find('body'),
                bodyClass = 'ms-info-bar-active';

            // Add body class
            body.addClass(bodyClass);

            /**
             * Remove the info bar
             */
            function removeInfoBar() {
                body.removeClass(bodyClass);
                iElement.remove();
                scope.$destroy();
            }

            // Expose functions
            scope.removeInfoBar = removeInfoBar;
        }
    };
}
export default msInfoBarDirective;
