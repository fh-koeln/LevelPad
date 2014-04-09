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
	});
	$routeProvider.when('/chat', {
		templateUrl: 'views/chat.html',
		controller: 'ChatController'
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	});
	
	$locationProvider.html5Mode(true);
});
