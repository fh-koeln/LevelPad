angular.module('levelPad').factory('AuthService', function ($http, Session) {
	return {
		login: function(credentials) {
			return $http({
					method: 'POST',
					url: '/api/login',
					data: credentials
				})
				.then(function(res) {
					Session.create(Date.now(), res.data);
				});
		},

		logout: function() {
			return $http({
				method: 'POST',
				url: '/api/logout'
			})
			.then(function() {
				Session.destroy();
			});
		},

		isAuthenticated: function () {
			return !!Session.user.id;
		},

		isAuthorized: function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (this.isAuthenticated() &&
				authorizedRoles.indexOf(Session.user.role) !== -1);
		}
	};
});
