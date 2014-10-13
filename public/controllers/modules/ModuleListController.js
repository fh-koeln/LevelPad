/* global angular, alert */

angular.module('levelPad').controller('ModuleListController', ['$scope', '$route', 'DialogService', 'Module', function ($scope, $route, DialogService, Module) {
	'use strict';

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/modules/new');
		dialog.scope.module = new Module();
		dialog.scope.submit = function() {
			dialog.scope.module.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

	$scope.showEditDialog = function(module) {
		var dialog = new DialogService('/modules/:module/edit');
		dialog.scope.module = angular.copy(module);
		dialog.scope.submit = function() {
			dialog.scope.module.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

	$scope.showDeleteDialog = function(module) {
		var dialog = new DialogService('/modules/:module/delete');
		dialog.scope.module = angular.copy(module);
		dialog.scope.submit = function() {
			dialog.scope.module.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};
}]);
