'use strict';

angular.module('levelPad').controller('ArtifactController', function ($scope, $http) {

	$http.get('/subjects/:subject/artifacts').success(function(artifacts) {
		$scope.artifacts = artifacts;
	});

});
