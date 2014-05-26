angular.module('levelPad').controller('SubjectController', function ($scope, $http) {
	'use strict';

	$http.get('/api/subjects').success(function(subjects) {
		$scope.subjects = subjects;
	});

});
