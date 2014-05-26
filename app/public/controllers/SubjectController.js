'use strict';

angular.module('levelPad').controller('SubjectController', function ($scope, $http) {

	$http.get('/api/subjects').success(function(subjects) {
		$scope.subjects = subjects;
	});

});
