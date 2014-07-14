angular.module('levelPad').factory('AuthService', function ($http, Session) {
	return {
		login: function(credentials) {
			return $http({
				method: 'POST',
				url: '/api/login',
				data: credentials
			});
		},

		refresh: function() {
			return $http({
				method: 'GET',
				url: '/api/users/me'
			});
		},

		signup: function(user) {
			return $http({
				method: 'POST',
				url: '/api/users',
				data: user
			});
		},

		logout: function() {
			return $http({
				method: 'POST',
				url: '/api/logout'
			});
		},

		isAuthenticated: function() {
			return !!Session.user.id;
		},

		isAuthorized: function(authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (this.isAuthenticated() &&
				authorizedRoles.indexOf(Session.user.role) !== -1);
		}
	};
});
