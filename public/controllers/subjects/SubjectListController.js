/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, CurrentModule, CurrentSubject) {
	'use strict';
	$scope.module = CurrentModule;
	$scope.subject = CurrentSubject;

    $scope.update = function () {
		// Get all subjects for the current module
		$http.get('/api/subjects').success(function(subjects) {
		$scope.subjects = subjects;
	});
	};
    $scope.update();
        
	$scope.go = function(path) {
		$location.path(path);
	};

	$scope.update = function() {

	};
	$scope.update();

}]);
