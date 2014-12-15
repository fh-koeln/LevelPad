
angular.module('levelPad').controller('DashboardController', [
	'$scope', '$rootScope', '$http', 'AuthService', 'DialogService', 'AlertService',
	function ($scope, $rootScope, $http, AuthService, DialogService, AlertService) {
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

		$scope.showCreateDialog = function() {
			var dialog = new DialogService('/subjects/new');
			dialog.scope.submit = function() {
				this._save().then(function() {
					$scope.update();
					dialog.submit();
				}, function() {
					AlertService.showError('Fehler!',-1);
				});
			};
			dialog.open();
		};

	}]);
