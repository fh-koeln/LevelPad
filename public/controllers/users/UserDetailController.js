
angular.module('levelPad').controller('UserDetailController', [
	'$scope', '$routeParams', '$log', '$modal', 'User',
	function ($scope, $routeParams, $log, $modal, User) {

	'use strict';
	console.log('UserDetailController: routeParams:', $routeParams);
	console.log($scope.user);

	$scope.user = $scope.user || new User();

	console.log($scope.user);

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

}]);
