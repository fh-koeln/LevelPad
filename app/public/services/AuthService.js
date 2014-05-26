
var automaticallyLogout;

angular.module('levelPad').config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push(function($q) {
        return {
            'responseError': function(rejection) {
                if (rejection.status == 401 || rejection.status == 403) {
                    console.error('Detect authentitication error '
                        + rejection.status + ' in server response!'
                        + ' Automatically logout the user!');
                    if (automaticallyLogout) {
                        automaticallyLogout();
                    } else {
                        window.location.href = 'logout';
                    }
                }
                return $q.reject(rejection);
            }
        };
    });
}]);

angular.module('levelPad').service('AuthService', ['$rootScope', '$log', '$http', function($rootScope, $log, $http) {

    var $scope = $rootScope.$new();

    // We don't know if we are already logged in!
    $scope.loggedIn = null;

	$scope.showLogin = function() {
		$log.info('Show modal login dialog...');
		$('#login').modal();
	};

	$scope.hideLogin = function() {
		$log.info('Hide modal login dialog...');
		$('#login').modal('hide');
	};

    $scope.verifyLogin = function(callback) {
        $log.log('Verify login state...');
        $http({
            method: 'GET',
            url: '/api/account'
        }).success(function() {
            $log.log('Authentification check was successful!');
            console.log(arguments);
            $scope.loggedIn = true;
            if (callback) {
                callback(null, true);
            }
        }).error(function(response) {
            $log.error('Authentification check failed!');
            $log.error(response);
			$scope.loggedIn = false;
            if (callback) {
                callback(response, false);
            }
        });
    };

    $scope.login = function(username, password, callback) {
        $log.log('Login user ' + username + ' in the background...');

        $http({
            method: 'POST',
            url: '/api/login',
            params: { username: username, password: password }
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
        $log.log('Handle manual logout in the background...');

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

    automaticallyLogout = function() {
        $scope.loggedIn = false;
    };

	$scope.$watch('loggedIn', function(loggedIn) {
		console.log('Logged in state changed: ' + loggedIn);
	});

	return $scope;
}]);
