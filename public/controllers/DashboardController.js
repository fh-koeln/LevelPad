
angular.module('levelPad').controller('DashboardController', [
	'$scope', '$rootScope', '$http', 'AuthService', 'UserSubject',
	function ($scope, $rootScope, $http, AuthService, UserSubject) {
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

			UserSubject.query({ user: username }).$promise.then(function(subjects) {
				$scope.subjects = subjects;
			});
		};

		$scope.update();
	}]);
