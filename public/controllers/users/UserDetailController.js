
angular.module('levelPad').controller('UserDetailController', [
	'$scope', '$routeParams', '$log', 'DialogService', 'User',
	function ($scope, $routeParams, $log, DialogService, User) {

		'use strict';
		console.log('UserDetailController: routeParams:', $routeParams);
		console.log($scope.user);

		$scope.user = $scope.user || new User();

		$scope.update = function () {

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
				var dialog = new DialogService('/users/:user/delete');
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
