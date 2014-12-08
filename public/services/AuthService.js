angular.module('levelPad').factory('AuthService', function ($http, Session) {
	var authService = {};

	authService.login = function(credentials) {
		return $http({
			method: 'POST',
			url: '/api/login',
			data: credentials
		});
	};

	authService.refresh = function() {
		return $http({
			method: 'GET',
			url: '/api/users/me'
		});
	};

	authService.signup = function(user) {
		return $http({
			method: 'POST',
			url: '/api/users',
			data: user
		});
	};

	authService.logout = function() {
		return $http({
			method: 'POST',
			url: '/api/logout'
		});
	};

	authService.isAuthenticated = function() {
		return !!Session.user;
	};

	authService.isAuthorized = function(authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) {
			authorizedRoles = [authorizedRoles];
		}
		return (authService.isAuthenticated() &&
			authorizedRoles.indexOf(Session.user.role) !== -1);
	};

	return authService;
});
