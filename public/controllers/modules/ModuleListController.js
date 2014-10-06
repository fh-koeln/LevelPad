/* global angular, alert */

angular.module('levelPad').controller('ModuleListController', ['$scope', '$modal', 'Module', function ($scope, $modal, Module) {
	'use strict';

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
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
