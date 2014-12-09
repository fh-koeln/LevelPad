
angular.module('levelPad').controller('DashboardController', [
	'$scope', '$rootScope', '$http', 'AuthService',
	function ($scope, $rootScope, $http, AuthService) {
		'use strict';

		$scope.user = AuthService.user;

		$scope.update = function () {
			var username = $scope.user ? $scope.user.username : null;
			var filter = {};
			var config = {
				params: filter
			};

			if (!username) {
				return;
			}

			// Get all subjects for the current module
			$http.get('/api/users/' + username + '/subjects', config).success(function(subjects) {
				$scope.subjects = subjects;
			});
		};

		$scope.update();
	}]);
