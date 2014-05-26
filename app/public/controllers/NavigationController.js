angular.module('levelPad').controller('NavigationController', ['$scope', '$route', '$location', '$log', 'AuthService', function ($scope, $route, $location, $log, authService) {
    'use strict';

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

	$scope.showLoginDialog = function() {
		$log.info('Show modal login dialog...');
		$('#loginDialog').modal();
	};

	$scope.showSignupDialog = function() {
		$log.info('Show modal signup dialog...');
		$('#signupDialog').modal();
	};

	authService.$watch('loggedIn', function(loggedIn) {
		if (loggedIn) {
			$log.info('Hide all modal dialogs...');
			$('#loginDialog, #signupDialog').modal('hide');
			if ($location.path() === '/' || $location.path() === '/login' || $location.path() === '/signup' || $location.path() === '/logout') {
				$location.path('/');
			}
		} else {
			if ($location.path() === '/logout') {
				$location.path('/');
			}
		}
	});

    $scope.login = function() {
		if ($location.path() === '/login' || $location.path() === '/signup') {
			$location.path('/login');
		} else {
			$scope.showLoginDialog();
		}
    };

	$scope.signup = function() {
		if ($location.path() === '/login' || $location.path() === '/signup') {
			$location.path('/signup');
		} else {
			$scope.showSignupDialog();
		}
	};

    $scope.logout = function() {
        authService.logout();
    };

	// Automatically load the current user status to update the navigation bar fields.
	authService.verifyStatus();

}]);
