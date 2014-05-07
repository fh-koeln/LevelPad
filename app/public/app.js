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

	$routeProvider.when('/login', {
		templateUrl: 'views/auth/login.html',
		controller: 'AuthController'
	});
	$routeProvider.when('/logout', {
		templateUrl: 'views/auth/logout.html',
		controller: 'AuthController'
	});
	$routeProvider.when('/account', {
		templateUrl: 'views/auth/account.html',
		controller: 'AccountController'
	});

	$routeProvider.when('/chat', {
		templateUrl: 'views/chat.html',
		controller: 'ChatController'
	});
	$routeProvider.when('/users', {
		templateUrl: 'views/users.html',
		controller: 'UserController'
	});
	$routeProvider.otherwise({
		templateUrl: 'views/404.html'
	});
//	$routeProvider.otherwise({
//		redirectTo: '/'
//	});
	
	$locationProvider.html5Mode(true);
});
