/* global alert */

angular.module('levelPad').controller('ModuleDetailController', [
	'$scope', '$routeParams', '$log', 'DialogService', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, DialogService, Module, Subject, CurrentModule) {

	'use strict';

	$scope.module = $scope.module || CurrentModule || new Module();

	// Notice: The following scope variables will be prefilled when
	// this detail controller is opened within another controller
	// in a modal dialog! So we must not override these callbacks here!

	if (!$scope.submit) {
		$scope.submit = function () {
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

	if (!$scope.showDeleteDialog) {
		$scope.showDeleteDialog = function (module) {
			var dialog = new DialogService('/modules/:module/delete');
			dialog.scope.module = angular.copy(module);
			dialog.scope.delete = function () {
				dialog.scope.module.$delete(function () {
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
