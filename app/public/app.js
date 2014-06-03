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

	// Login / Signup / Logout

	$routeProvider.when('/signup', {
		templateUrl: 'views/auth/signup-page.html',
		controller: 'AccountController'
	});
	$routeProvider.when('/login', {
		templateUrl: 'views/auth/login-page.html',
		controller: 'AccountController'
	});
	$routeProvider.when('/logout', {
		templateUrl: 'views/auth/logout-page.html',
		controller: 'AccountController'
	});

	// Basics

	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainController'
	});
	$routeProvider.when('/account', {
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
	$routeProvider.when('/subjects/:subject', {
		templateUrl: 'views/subject.html',
		controller: 'SubjectController'
	});
	$routeProvider.when('/subjects/:subject/artifacts', {
		templateUrl: 'views/artifacts.html',
		controller: 'ArtifactController'
	});

	// Admin

	$routeProvider.when('/admin/modules', {
		templateUrl: 'views/admin/modules.html',
		controller: 'AdminModuleController'
	});
	$routeProvider.when('/admin/students', {
		templateUrl: 'views/admin/students.html',
		controller: 'AdminStudentController'
	});
	$routeProvider.when('/admin/subjects', {
		templateUrl: 'views/admin/subjects.html',
		controller: 'AdminSubjectController'
	});

	// Fallback

	$routeProvider.otherwise({
		templateUrl: 'views/errors/404.html'
	});

	$locationProvider.html5Mode(true);
});
