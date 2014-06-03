/* global angular, alert */

angular.module('levelPad').controller('ModuleController', ['$scope', 'Module', function ($scope, Module) {
	'use strict';

	$scope.update = function() {
		$scope.modules = Module.query(function() {

		}, function() {
			alert('Could not load modules.');
		});
	};
	$scope.update();

}]);
