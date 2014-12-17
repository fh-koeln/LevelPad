angular.module('levelPad').factory('AuthService', function ($rootScope, $q, $http, $cookieStore, AUTH_EVENTS, USER_ROLES) {
	var authService = {},
		currentUser = $cookieStore.get('user') || { username: '', role: USER_ROLES.public };

	$cookieStore.remove('user');

	function changeUser(user) {
		angular.extend(currentUser, user);
	}

	authService.login = function(credentials) {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: '/api/login',
			data: credentials
		}).success(function(user) {
			changeUser(user);
			$rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed, user);
			deferred.resolve(user);
		}).error(function(res) {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, res);
			deferred.reject(res);
		});

		return deferred.promise;
	};

	authService.refresh = function() {
		var deferred = $q.defer();

		$http({
			method: 'GET',
			url: '/api/users/me'
		}).success(function(user) {
			changeUser(user);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed, user);
			deferred.resolve(user);
		}).error(function(res) {
			$rootScope.$broadcast(AUTH_EVENTS.loginFailed, res);
			deferred.reject(res);
		});

		return deferred.promise;
	};

	authService.signup = function(user) {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: '/api/users',
			data: user
		}).success(function(user) {
			changeUser(user);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed, user);
			$rootScope.$broadcast(AUTH_EVENTS.signupSuccess, user);
			deferred.resolve(user);
		}).error(function(res) {
			changeUser({
				username: '',
				role: USER_ROLES.public
			});
			$rootScope.$broadcast(AUTH_EVENTS.signupFailed, res);
			deferred.reject(res);
		});

		return deferred.promise;
	};

	authService.logout = function() {
		var deferred = $q.defer();

		$http({
			method: 'POST',
			url: '/api/logout'
		}).success(function() {
			changeUser({
				username: '',
				role: USER_ROLES.public
			});
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			deferred.resolve();
		}).error(function(res) {
			$rootScope.$broadcast(AUTH_EVENTS.logoutFailed, res);
			deferred.reject(res);
		});

		return deferred.promise;
	};

	authService.isAuthenticated = function() {
		return !!currentUser.username;
	};

	authService.isAuthorized = function(authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}

		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(currentUser.role) !== -1);
	};

	authService.user = currentUser;
	authService.userRoles = USER_ROLES;

	return authService;
});
