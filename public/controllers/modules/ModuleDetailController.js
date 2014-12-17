/* global alert */

angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', 'DialogService', 'Module',
	function ($scope, $routeParams, $log, DialogService, Module) {

	'use strict';


	$scope.update = function() {
		var moduleSlug = $routeParams.module || $scope.moduleSlug;
		if (moduleSlug) {
			$scope.module = Module.get({
				module: moduleSlug
			}, function() {
			});
		} else {
			$scope.module = new Module();
		}
	};

	$scope.update();

	$scope._save = function() {
		return $scope.module.$save();
	};

	$scope._delete = function() {
		return $scope.module.$delete();
	};

	$scope.showDeleteDialog = function(module) {
		var dialog = new DialogService('/modules/:module/delete');
		console.log(module);
		dialog.scope.moduleSlug = module.slug;
		dialog.scope.delete = function () {
			this._delete().then(function() {
				dialog.submit();
				$route.reload();
			}, function () {
				alert('Fehler!');
			});
		};
		dialog.open();
	};
}]);
