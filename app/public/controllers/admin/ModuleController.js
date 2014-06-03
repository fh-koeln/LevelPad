/* global angular, alert */

angular.module('levelPad').controller('AdminModuleController', ['$scope', 'Module', function ($scope, Module) {
	'use strict';

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		$scope.module = new Module();
		$('#edit').modal();
	};

	$scope.showEditDialog = function(module) {
		$scope.module = angular.copy(module);
		$('#edit').modal();
	};

	$scope.showDeleteDialog = function(module) {
		$scope.module = angular.copy(module);
		$('#delete').modal();
	};

	$scope.hideDialog = function() {
		$('#edit, #delete').modal('hide');
		$scope.module = null;
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
