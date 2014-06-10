'use strict';

var app = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute'
]);

app.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
}]);

app.config(function ($routeProvider, $locationProvider) {

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

	// Maybe we could make this later part of the homescreen...
	// Or we show a "whats new" timeline there?
	$routeProvider.when('/modules', {
		templateUrl: 'views/modules/index.html',
		controller: 'ModulesController'
	});

	// MAGIC RULES!!!!!!!
	$routeProvider.when('/:module', {
		templateUrl: 'views/modules/show.html',
		controller: 'ModulesController'
	});

	$routeProvider.when('/:module/:subject', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});

	$routeProvider.when('/:module/:subject/tasks', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/tasks/:task', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/teams', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/teams/:team', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/students', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/students/:student', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/assistants', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});
	$routeProvider.when('/:module/:subject/assistants/:assistant', {
		templateUrl: 'views/subjects/index.html',
		controller: 'SubjectsController'
	});

	// Fallback

	$routeProvider.otherwise({
		templateUrl: 'views/errors/404.html'
	});

	$locationProvider.html5Mode(true);
});
