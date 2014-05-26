
angular.module('levelPad').controller('NavigationController', ['$scope', '$route', '$location', 'AuthService', function ($scope, $route, $location, authService) {

    console.log('Current location: ' + $location.path());

    $scope.items = [];

    for (var route in $route.routes) {
        if ($route.routes[route].title) {
            $scope.items.push({
                title: $route.routes[route].title,
                path: route
            });
        }
    }

    $scope.$location = $location;

	authService.$watch('loggedIn', function(loggedIn) {
		$scope.loggedIn = loggedIn;
	});
	$scope.loggedIn = authService.loggedIn;
	authService.verifyLogin();

    $scope.login = function() {
		authService.showLogin();
    };

    $scope.logout = function() {
        authService.logout();
    };

}]);
