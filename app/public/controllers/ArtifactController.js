'use strict';

angular.module('levelPad').controller('ArtifactController', function ($scope, $http) {

	$http.get('/api/subjects/:subject/artifacts').success(function(artifacts) {
		$scope.artifacts = artifacts;
	});

});
