
angular.module('levelPad').controller('UserDetailController', [
	'$scope', '$stateParams', '$log', 'DialogService', 'User',
	function ($scope, $stateParams, $log, DialogService, User) {

		'use strict';
		console.log('UserDetailController: routeParams:', $stateParams);

		$scope.roles = [
			{ role: 'guest', name: 'Gast' },
			{ role: 'lecturer', name: 'Professor' },
			{ role: 'student', name: 'Student' },
			{ role: 'assistant', name: 'Assistant' },
			{ role: 'administrator', name: 'Administrator' },
		];


		$scope.update = function () {
			// Get the current user
			if (!$scope.user && $stateParams.username) {
				$scope.user = User.get({
					username: $stateParams.username
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
