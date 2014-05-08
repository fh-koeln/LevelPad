'use strict';

angular.module('levelPad').controller('SubjectController', function ($scope, $http) {

	$http.get('/subjects').success(function(subjects) {
		$scope.subjects = subjects;
	});

});
