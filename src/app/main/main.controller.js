function MainController($scope, $rootScope) {
	'ngInject';
	
    // Remove the splash screen
    $scope.$on('$viewContentAnimationEnded', function(event) {
        if (event.targetScope.$id === $scope.$id) {
            $rootScope.$broadcast('msSplashScreen::remove');
        }
    });
}
export default MainController;
