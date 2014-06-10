
angular.module('levelPad').service('AuthService', ['$rootScope', '$http', '$cookieStore', '$log', function($rootScope, $http, $cookieStore, $log) {

	var $scope = $rootScope;//.$new();

	// We don't know if we are already logged in!
	$scope.loggedIn = null;
	$scope.user = null;

	/**
	 * Monitor ALL AngularJS HTTP communication and trigger that we are logged out
	 * if we receive an 401 or 403 status code on one these connections.
	 */
	angular.module('levelPad').config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push(function($q) {
			return {
				'responseError': function(response) {
					if (response.status === 401 || response.status === 403) {
						console.error('Detect authentitication error ' +
								response.status + ' in server response!' +
								' Automatically logout the user!');
						$scope.loggedIn = false;
					}
					return $q.reject(response);
				}
			};
		});
	}]);

	$scope.verifyStatus = function(callback) {
		$log.log('Get current account...');
		$http({
			method: 'GET',
			url: '/api/users/me'
		}).success(function(response) {
			$log.log('Authentification check was successful!');
			$scope.loggedIn = true;
			$scope.user = response;
			if (callback) {
				callback(null, response);
			}
		}).error(function(response) {
			$log.error('Authentification check failed!');
			$log.error(response);
			$scope.loggedIn = false;
			$scope.user = null;
			if (callback) {
				callback(response);
			}
		});
	};

	$scope.login = function(user, callback) {
		$log.log('Login user ' + user.username + '...');

		$http({
			method: 'POST',
			url: '/api/login',
			data: user
		}).success(function(response) {
			// We will receive the login mask here if the login failed.
			// So we also check if we could get the current user information now...
			//$scope.verifyStatus(callback);
			$log.log(response);
			$('#loginDialog').modal('hide');
			$('#signupDialog').modal();
		}).error(function(response) {
			$log.error('Login failed!');
			$log.error(response);
			$scope.loggedIn = false;
			$scope.user = null;
			if (callback) {
				callback(response);
			}
		});
	};

	$scope.signup = function(user, callback) {
		$log.log('Register user ' + user.username + '...');

		delete user.password;

		$http({
			method: 'POST',
			url: '/api/users',
			data: user
		}).success(function(response) {
			// We will receive the login mask here if the login failed.
			// So we also check if we could get the current user information now...
			//$scope.verifyStatus(callback);
			$log.log(response);
		}).error(function(response) {
			$log.error('Signup failed!');
			$log.error(response);
			$scope.loggedIn = false;
			$scope.user = null;
			if (callback) {
				callback(response);
			}
		});
	};

	$scope.logout = function(callback) {
		$log.log('Logout user ' + ($scope.user ? $scope.user.username : null) + '...');

		$http({
			method: 'POST',
			url: '/api/logout'
		}).success(function() {
			$log.log('Logout was successful!');
			$scope.loggedIn = false;
			$scope.user = null;
			if (callback) {
				callback(null);
			}
		}).error(function(response) {
			$log.error('Logout failed!');
			$log.error(response);
			if (callback) {
				callback(response);
			}
		});
	};

	return $scope;
}]);
