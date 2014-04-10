'use strict';

angular.module('levelPad').controller('MainController', function ($http, $scope) {

	$http.get('/api/example/awesomeThings').success(function(awesomeThings) {
		$scope.awesomeThings = awesomeThings;
	});

});
