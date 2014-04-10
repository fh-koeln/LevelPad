'use strict';

angular.module('levelPad').controller('MainController', function ($scope, $http) {

	$http.get('/api/example/awesomeThings').success(function(awesomeThings) {
		$scope.awesomeThings = awesomeThings;
	});

});
