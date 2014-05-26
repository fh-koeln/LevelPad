'use strict';

var module = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
]);

module.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
}]);

module.config(function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		title: 'Home',
		templateUrl: 'views/main.html',
		controller: 'MainController'
	});
	$routeProvider.when('/account', {
		title: 'Account',
		templateUrl: 'views/account.html',
		controller: 'AccountController'
	});
	$routeProvider.when('/users', {
		templateUrl: 'views/users.html',
		controller: 'UserController'
	});
	$routeProvider.when('/subjects', {
		templateUrl: 'views/subjects.html',
		controller: 'SubjectController'
	});
	$routeProvider.when('/subjects/:subject/artifacts', {
		templateUrl: 'views/artifacts.html',
		controller: 'ArtifactController'
	});
	$routeProvider.when('/signup', {
		templateUrl: 'views/auth/signup-page.html',
		controller: 'AuthController'
	});
	$routeProvider.when('/login', {
		templateUrl: 'views/auth/login-page.html',
		controller: 'AuthController'
	});
	$routeProvider.when('/logout', {
		templateUrl: 'views/auth/logout-page.html',
		controller: 'AuthController'
	});
	$routeProvider.otherwise({
		templateUrl: 'views/errors/404.html'
	});

	$locationProvider.html5Mode(true);
});
