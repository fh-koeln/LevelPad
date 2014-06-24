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

/*app.factory('httpErrorInterceptor', ['$q', '$rootScope', '$location', function($q, $rootScope, $location) {

	return {
		'responseError': function(response) {
			if (response.status === 401) {
				console.error('Authentitication error in server response detected!' +
						' Automatically logout the user!');
			} else if ( response.status === 403) {
				console.error('Access error in server response detected!');
				$location.path('/403');
			} else if ( response.status === 404) {
				console.error('Not found error in server response detected!');
				$location.path('/404');
			} else if ( response.status === 500) {
				console.error('Server error in server response detected!');
				$location.path('/500');
			} else if ( response.status === 503) {
				console.error('Server is not available');
				$location.path('/503');
			}

			return $q.reject(response);
		}
	};
}]);


app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpErrorInterceptor');
}]);*/

app.config(function($routeProvider, $locationProvider) {
	// Errors

	$routeProvider.when('/403', {
		templateUrl: 'views/errors/403.html',
	});
	$routeProvider.when('/404', {
		templateUrl: 'views/errors/404.html',
	});
	$routeProvider.when('/500', {
		templateUrl: 'views/errors/500.html',
	});
	$routeProvider.when('/503', {
		templateUrl: 'views/errors/503.html',
	});

	// Login / Signup / Logout

	$routeProvider.when('/signup', {
		templateUrl: 'views/auth/signup-page.html',
		controller: 'AccountController'
	});
	$routeProvider.when('/login', {
		templateUrl: 'views/auth/login-page.html',
		controller: 'LoginController'
	});
	$routeProvider.when('/logout', {
		templateUrl: 'views/auth/logout-page.html',
		controller: 'LogoutController'
	});

	// Basics

	$routeProvider.when('/', {
		templateUrl: 'views/main.html',
		controller: 'MainController'
	});
	$routeProvider.when('/dashboard', {
		templateUrl: 'views/dashboard.html',
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

	// Maybe we could make this later part of the dashboard...
	// Or we show a "whats new" timeline there?
	$routeProvider.when('/modules', {
		templateUrl: 'views/modules/list.html',
		controller: 'ModuleListController'
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
	$routeProvider.when('/:module/:subject/tasks/new', {
		templateUrl: 'views/tasks/edit.html',
		controller: 'TasksController'
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

