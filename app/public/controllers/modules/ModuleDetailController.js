
angular.module('levelPad').controller('ModulesController', [
	'$scope', '$routeParams', '$log', 'Module', 'Subject', 'CurrentModule',
	function ($scope, $routeParams, $log, Module, Subject, CurrentModule) {

	'use strict';
	$scope.module = CurrentModule;

	console.log('SubjectsController: routeParams:', $routeParams);

	$scope.update = function () {
		if ($routeParams.module) {
			// Get all subjects for the current module
			Subject.query({
				module: $routeParams.module
			}, function(subjects) {
				$scope.subjects = subjects;
			}, function() {
				$log.error('Could not load subjects.');
			});
		} else {
			// Get all modules
			Module.query(function(modules) {
				$scope.modules = modules;
			}, function() {
				$log.error('Could not load modules.');
			});
		}
	};
	$scope.update();

}]);
