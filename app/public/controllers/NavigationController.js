
angular.module('levelPad').controller('NavigationController', ['$scope', '$route', '$location', 'AuthService', function ($scope, $route, $location, authService) {

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

    $scope.login = function() {
		if ($location.path() == '/login' || $location.path() == '/signup') {
			$location.path('/login');
		} else {
			authService.showLogin();
		}
    };

	$scope.signup = function() {
		if ($location.path() == '/login' || $location.path() == '/signup') {
			$location.path('/signup');
		} else {
			authService.showSignup();
		}
	};

    $scope.logout = function() {
        authService.logout();
    };

}]);
