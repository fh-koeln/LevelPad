'use strict';

var module = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
]);

module.config(function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainController'
	}).otherwise({
		redirectTo: '/'
	});
	
	$locationProvider.html5Mode(true);
});
