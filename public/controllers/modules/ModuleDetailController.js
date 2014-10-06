
angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', '$modal', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, $modal, Module, Subject, CurrentModule) {

	'use strict';
	console.log('ModuleDetailController: routeParams:', $routeParams);

	if (!$scope.module) {
		$scope.module = CurrentModule;
	}

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

	$scope.save = function() {
		console.log('save:', $scope.module);
		$scope.module.$save(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

	$scope.delete = function() {
		$scope.module.$delete(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

}]);
