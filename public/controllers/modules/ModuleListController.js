/* global angular, alert */

angular.module('levelPad').controller('ModuleListController', ['$scope', '$stateParams', 'DialogService', 'Module', function ($scope, $stateParams, DialogService, Module) {

	'use strict';
	console.log('ModuleDetailController $stateParams', $stateParams);

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
			this._save().then(function() {
				$scope.update();
				dialog.submit();
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
