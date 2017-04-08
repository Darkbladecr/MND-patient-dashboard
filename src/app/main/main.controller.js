function MainController($scope, $rootScope) {
	'ngInject';
    'use strict';

    // Data

    //////////

    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function(event) {
        if (event.targetScope.$id === $scope.$id) {
            $rootScope.$broadcast('msSplashScreen::remove');
        }
    });
}
export default MainController;
