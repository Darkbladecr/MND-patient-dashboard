import angular from 'angular';

function MsWidgetController($scope, $element) {
	'ngInject';
    'use strict';

    var vm = this;

    // Data
    vm.flipped = false;

    // Methods
    vm.flip = flip;

    //////////

    /**
     * Flip the widget
     */
    function flip() {
        if (!isFlippable()) {
            return;
        }

        // Toggle flipped status
        vm.flipped = !vm.flipped;

        // Toggle the 'flipped' class
        $element.toggleClass('flipped', vm.flipped);
    }

    /**
     * Check if widget is flippable
     *
     * @returns {boolean}
     */
    function isFlippable() {
        return (angular.isDefined($scope.flippable) && $scope.flippable === true);
    }
}

function msWidgetDirective() {
	'ngInject';
    'use strict';

    return {
        restrict: 'E',
        scope: {
            flippable: '=?'
        },
        controller: 'MsWidgetController',
        transclude: true,
        compile: function(tElement) {
            tElement.addClass('ms-widget');

            return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
                // Custom transclusion
                transcludeFn(function(clone) {
                    iElement.empty();
                    iElement.append(clone);
                });

                //////////
            };
        }
    };
}

function msWidgetFrontDirective() {
	'ngInject';
    'use strict';

    return {
        restrict: 'E',
        require: '^msWidget',
        transclude: true,
        compile: function(tElement) {
            tElement.addClass('ms-widget-front');

            return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
                // Custom transclusion
                transcludeFn(function(clone) {
                    iElement.empty();
                    iElement.append(clone);
                });

                // Methods
                scope.flipWidget = MsWidgetCtrl.flip;
            };
        }
    };
}

function msWidgetBackDirective() {
	'ngInject';
    'use strict';

    return {
        restrict: 'E',
        require: '^msWidget',
        transclude: true,
        compile: function(tElement) {
            tElement.addClass('ms-widget-back');

            return function postLink(scope, iElement, iAttrs, MsWidgetCtrl, transcludeFn) {
                // Custom transclusion
                transcludeFn(function(clone) {
                    iElement.empty();
                    iElement.append(clone);
                });

                // Methods
                scope.flipWidget = MsWidgetCtrl.flip;
            };
        }
    };
}
export { MsWidgetController, msWidgetDirective, msWidgetFrontDirective, msWidgetBackDirective };
