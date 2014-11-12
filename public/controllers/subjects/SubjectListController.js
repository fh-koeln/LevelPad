/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService', 'CurrentModule', 'CurrentSubject',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService, CurrentModule, CurrentSubject) {
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
        var dialog = new DialogService('/subjects/new');
        dialog.scope.subject = new Subject();
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

	$scope.showEditDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#edit').modal();
	};

	$scope.showDeleteDialog = function(subject) {
		$scope.subject = angular.copy(subject);
		$('#delete').modal();
	};

	$scope.save = function() {
		console.log('save:', $scope.subject);
		$scope.subject.module = $scope.module;
		$scope.subject.$save(function() {
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};

	$scope.delete = function() {
		$scope.subject.$delete(function() {
			$scope.update();
		}, function() {
			alert('Error!');
		});
	};    
        
}]);
