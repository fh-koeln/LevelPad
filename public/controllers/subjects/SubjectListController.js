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

    $scope.showCreateDialog = function() {
		$scope.subject = new Subject();
		$('#edit').modal();
	};

	$scope.showEditDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#edit').modal();
	};

	$scope.showDeleteDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#delete').modal();
	};

	$scope.hideDialog = function() {
		$('#edit, #delete').modal('hide');
		$scope.subject = null;
	};

	$scope.save = function() {
		console.log('save:', $scope.subject);
		$scope.subject.module = $scope.module;
		$scope.subject.$save(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

	$scope.delete = function() {
		$scope.subject.$delete(function() {
			$scope.hideDialog();
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};    
        
}]);
