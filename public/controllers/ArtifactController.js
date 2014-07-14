angular.module('levelPad').controller('ArtifactController', function ($scope, $http) {
	'use strict';

	$http.get('/api/subjects/:subject/artifacts').success(function(artifacts) {
		$scope.artifacts = artifacts;
	});

});
