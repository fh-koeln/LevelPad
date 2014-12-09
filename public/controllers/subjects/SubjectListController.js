/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService) {

	'use strict';

	$scope.subjects = [];

	$scope.update = function () {
		$http.get('/api/subjects').success(function(subjects) {
			$scope.subjects = subjects;
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/subjects/new');
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

}]);
