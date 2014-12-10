/* global angular, alert */

angular.module('levelPad').controller('ModuleListController', ['$scope', '$route', 'DialogService', 'Module', function ($scope, $route, DialogService, Module) {
	'use strict';

	$scope.update = function() {
		$scope.modules = [];
		Module.query(function(modules) {
			$scope.modules = modules;
		}, function() {
			alert('Could not load modules.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/modules/new');
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
		dialog.scope.moduleSlug = module.slug;
		dialog.scope.submit = function() {
			this._save().then(function() {
				$scope.update();
				dialog.submit();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.scope.showConfirmDeleteDialog = function() {
			dialog.cancel();
			this.showDeleteDialog(module);
		};
		dialog.open();
	};
}]);
