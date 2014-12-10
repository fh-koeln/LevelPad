
angular.module('levelPad').controller('ApplicationController', ['$rootScope', '$scope', '$location', 'USER_ROLES', 'AUTH_EVENTS', 'AuthService', function($rootScope, $scope, $location, USER_ROLES, AUTH_EVENTS, AuthService) {

	AuthService.refresh();

	$scope.location = $location;
	$scope.userRoles = AuthService.userRoles;
	$scope.currentUser = AuthService.user;

	$rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
		switch (rejection) {
			case 'login_required':
				$location.path('/login');
				break;
			case 'missing_role':
				$location.path('/');
				break;
			default:
				console.error('router', 'Unhandled route resolver rejection', rejection);
		}
	});
}]);
