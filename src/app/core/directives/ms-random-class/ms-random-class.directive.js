function msRandomClassDirective() {
	'ngInject';
    'use strict';

    return {
        restrict: 'A',
        scope: {
            msRandomClass: '='
        },
        link: function(scope, iElement) {
            var randomClass = scope.msRandomClass[Math.floor(Math.random() * (scope.msRandomClass.length))];
            iElement.addClass(randomClass);
        }
    };
}
export default msRandomClassDirective;
