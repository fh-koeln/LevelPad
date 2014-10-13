
angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', '$modal', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, $modal, Module, Subject, CurrentModule) {

	'use strict';
	console.log('ModuleDetailController: routeParams:', $routeParams);
	console.log($scope.module);

	$scope.module = $scope.module || CurrentModule || new Module();

	console.log($scope.module);

	$scope.update = function () {
		$scope.semester = [
			{ key: 'sose', name: 'Sommersemester' },
			{ key: 'wise', name: 'Wintersemester' }
		];

		// Get all subjects for the current module
		Subject.query({
			module: CurrentModule
		}, function(subjects) {
			$scope.subjects = subjects;
		}, function() {
			$log.error('Could not load subjects.');
		});
	};
	$scope.update();

		/*
	$scope.showCreateDialog = function() {
		var scope = $scope.$new();
		scope.module = new Module();

		var modalInstance = $modal.open({
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			scope: scope
		});

		scope.save = function() {
			modalInstance.close(scope.module);
		};
		scope.close = function() {
			modalInstance.dismiss('cancel');
		};

		modalInstance.result.then(function(result) {
			$scope.update();
		});
	};

	$scope.showEditDialog = function(module) {
		console.log('edit via detail');
		var scope = $scope.$new();
		scope.module = angular.copy(module);

		var modalInstance = $modal.open({
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			scope: scope
		});

		scope.save = function() {
			modalInstance.close(scope.module);
		};
		scope.close = function() {
			modalInstance.dismiss('cancel');
		};

		modalInstance.result.then(function() {
			$scope.update();
		});
	};

	$scope.showDeleteDialog = function(module) {
		var scope = $scope.$new();
		scope.module = angular.copy(module);

		var modalInstance = $modal.open({
			templateUrl: 'views/modules/delete.html',
			controller: 'ModuleDetailController',
			scope: scope
		});

		scope.save = function() {
			modalInstance.close(scope.module);
		};
		scope.close = function() {
			modalInstance.dismiss('cancel');
		};

		modalInstance.result.then(function() {
			$scope.update();
		});
	};
	*/

	if (!$scope.submit) {
		$scope.submit = function () {
			console.log('detail save scope', $scope);
			alert('detail save');
			$scope.module.$save(function () {
				$scope.update();
			}, function () {
				alert('Error!');
			});
		};
	}

	if (!$scope.delete) {
		$scope.delete = function () {
			$scope.module.$delete(function () {
				$scope.update();
			}, function () {
				alert('Error!');
			});
		};
	}

}]);
