
angular.module('levelPad').service('AuthService', ['$rootScope', '$http', '$cookieStore', '$log', function($rootScope, $http, $cookieStore, $log) {

	var $scope = $rootScope;//.$new();

	// We don't know if we are already logged in!
	$scope.loggedIn = null;
	$scope.user = null;

	angular.module('levelPad').config(['$httpProvider', function($httpProvider) {
		$httpProvider.interceptors.push(function($q) {
			return {
				'responseError': function(rejection) {
					if (rejection.status == 401 || rejection.status == 403) {
						console.error('Detect authentitication error '
							+ rejection.status + ' in server response!'
							+ ' Automatically logout the user!');
						$scope.loggedIn = false;
					}
					return $q.reject(rejection);
				}
			};
		});
	}]);

	$scope.showLogin = function() {
		$log.info('Show modal login dialog...');
		$('#loginDialog').modal();
	};

	$scope.hideLogin = function() {
		$log.info('Hide modal login dialog...');
		$('#loginDialog').modal('hide');
	};

	$scope.showSignup = function() {
		$log.info('Show modal signup dialog...');
		$('#signupDialog').modal();
	};

	$scope.hideLogin = function() {
		$log.info('Hide modal signup dialog...');
		$('#signupDialog').modal('hide');
	};

    $scope.loadUser = function() {
        $log.log('Get current user...');
        $http({
            method: 'GET',
            url: '/api/account'
        }).success(function(response) {
            $log.log('Authentification check was successful!');
            $scope.loggedIn = true;
			$scope.user = response;
        }).error(function(response) {
            $log.error('Authentification check failed!');
            $log.error(response);
			$scope.loggedIn = false;
			$scope.user = null;
        });
    };
	$scope.loadUser();

    $scope.login = function(username, password, callback) {
        $log.log('Login user ' + username + '...');

        $http({
            method: 'POST',
            url: '/api/login',
            data: { username: username, password: password }
        }).success(function() {
            // We will receive the login mask here if the login failed.
            // So we also check if we could get the current user information now...
            $scope.verifyLogin(callback);
        }).error(function(response) {
            $log.error('Authentification check failed after login!');
            $log.error(response);
            if (callback) {
                callback(response, false);
            }
        });
    };

    $scope.logout = function(callback) {
        $log.log('Logout...');

        $http({
            method: 'POST',
            url: '/api/logout'
        }).success(function() {
            $log.log('Logout was successful!');
            $scope.loggedIn = false;
            if (callback) {
                callback(null, true);
            }
        }).error(function(response) {
            $log.error('Logout failed!');
            $log.error(response);
            if (callback) {
                callback(response, false);
            }
        });
    };

	return $scope;
}]);
