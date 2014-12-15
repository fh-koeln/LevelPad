/* global angular, alert */

angular.module('levelPad').controller('SubjectListController', [
	'$scope', '$http', '$routeParams', '$location', '$log', 'Module', 'Subject', 'DialogService',
	function ($scope, $http, $routeParams, $location, $log, Module, Subject, DialogService) {

	'use strict';
	$scope.subjects = [];
	$scope.sections = [];

	var groupByYearAndSemester = function(subjects) {
		// a key value pair, key is only used for lookup while the value
		// contains year, semester and a list subjects which will
		// be set then a a list of list to the view
		var sectionGroups = [], sections = [];

		angular.forEach(subjects, function(subject) {
			if (!sectionGroups[subject.year + '_' + subject.semester]) {
				sectionGroups[subject.year + '_' + subject.semester] = {
					year: subject.year,
					semester: subject.semester,
					subjects: [ subject ]
				};
			} else {
				sectionGroups[subject.year + '_' + subject.semester].subjects.push(subject);
			}
		});

		for (var key in sectionGroups) {
			sections.push(sectionGroups[key]);
		}

		return sections;
	};

	$scope.update = function () {
		$http.get('/api/subjects').success(function(subjects) {
			$scope.subjects = subjects;
			$scope.sections = groupByYearAndSemester(subjects);
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

	$scope.showJoinDialog = function(subject) {
		var dialog = new DialogService('/:module/:subject/join');
		dialog.scope.subject = subject;
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
