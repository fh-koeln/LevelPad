
angular.module('levelPad').controller('ApplicationController', ['$rootScope', '$scope', '$location', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', 'Session', function($rootScope, $scope, $location, USER_ROLES, AUTH_EVENTS, AuthService, Session) {


	AuthService.refresh().then(function(res) {
		Session.create(Date.now(), res.data);
		$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
	}, function() {
		$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	});

	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		switch (rejection) {
			case 'login_required':
				console.log('login_required');
				break;
			case 'missing_role':
				console.log('missing_role');
				break;
			default:
				console.error('router', 'Unhandled route resolver rejection', rejection);
		}
	});

	/*$rootScope.$on('$locationChangeStart', function(event) {
		if ($location.path() === '/login' || $location.path() === '/logout' || $location.path() === '/signup') {
			return;
		}

		AuthService.refresh().then(function(res) {
			// Authentifizierung war erfolgreich
			Session.create(Date.now(), res.data);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
		}, function() {
			// Authentifizierung ist fehlgeschlagen, User abmelden
			event.preventDefault();
			AuthService.logout().then(function() {
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			}, function() {
				$rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
			});
		});
	});*/
}]);
