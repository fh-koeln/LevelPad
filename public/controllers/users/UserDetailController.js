
angular.module('levelPad').controller('UserDetailController', [
	'$scope', '$routeParams', '$log', 'DialogService', 'User',
	function ($scope, $routeParams, $log, DialogService, User) {

		'use strict';
		console.log('UserDetailController: routeParams:', $routeParams);

		$scope.update = function () {
			// Get the current user
			if (!$scope.user && $routeParams.username) {
				$scope.user = User.get({
					username: $routeParams.username
				}, function(user) {

				}, function() {
					$log.error('Could not load subjects.');
				});
			}
		};
		$scope.update();

		if (!$scope.submit) {
			$scope.submit = function () {
				console.log('detail save scope', $scope);
				alert('detail save');
				$scope.user.$save(function () {
					$scope.update();
				}, function () {
					alert('Error!');
				});
			};
		}

		if (!$scope.delete) {
			$scope.delete = function () {
				$scope.user.$delete(function () {
					$scope.update();
				}, function () {
					alert('Error!');
				});
			};
		}

		if (!$scope.showDeleteDialog) {
			$scope.showDeleteDialog = function (user) {
				var dialog = new DialogService('/users/:username/delete');
				dialog.scope.user = angular.copy(user);
				dialog.scope.delete = function () {
					dialog.scope.user.$delete(function () {
						dialog.submit();
						$scope.update();
					}, function () {
						alert('Fehler!');
					});
				};
				dialog.open();
			};
		}

}]);
