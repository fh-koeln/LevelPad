'use strict';

var app = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ui.bootstrap',
	'ui',
	'tc.chartjs'
]);

app.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
}]);

app.factory('httpErrorInterceptor', ['$q', '$location', function($q, $location) {

	return {
		'responseError': function(response) {
			console.error('Receive status code ' + response.status + ' for ' + response.config.url);

			if (response.status === 401) {
				console.error('Authentication error in server response detected!');
			} else if (response.status === 403) {
				console.error('Access error in server response detected!');
//				$location.path('/403');
			} else if (response.status === 404) {
				console.error('Not found error in server response detected!');
//				$location.path('/404');
			} else if (response.status === 500) {
				console.error('Server error in server response detected!');
//				$location.path('/500');
			} else if (response.status === 503) {
				console.error('Server is not available');
//				$location.path('/503');
			}

			return $q.reject(response);
		}
	};
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpErrorInterceptor');
}]);

// Restrict routes
/*app.config(['$httpProvider', function ($httpProvider) {
	var requestInterceptor = ['$q', '$rootScope', '$injector',
		function ($q, $rootScope, $injector) {
			var interceptorInstance = {
				request: function (config) {
					//console.log(config);
					var $route = $injector.get('$route');
					if ($route.current) {
						var currentRoute = $route.current.$$route.originalPath;
						if ($route.routes[currentRoute]) {
							if ($route.routes[currentRoute].loginRequired) {
								console.log($route.current);
								return $q.reject('login_required');
							}
						}
					}
					return config || $q.when(config);
				}
			};
			return interceptorInstance;
		}];

	$httpProvider.interceptors.push(requestInterceptor);
}]);*/

app.config(function($routeProvider, $locationProvider) {
	// Errors

	$routeProvider.when('/403', {
		templateUrl: 'views/errors/403.html'
	});
	$routeProvider.when('/404', {
		templateUrl: 'views/errors/404.html'
	});
	$routeProvider.when('/500', {
		templateUrl: 'views/errors/500.html'
	});
	$routeProvider.when('/503', {
		templateUrl: 'views/errors/503.html'
	});

	// Login / Signup / Logout

	$routeProvider.when('/signup', {
		templateUrl: 'views/auth/signup-page.html',
		controller: 'SignupController'
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
		templateUrl: 'views/dashboard/dashboard.html',
		controller: 'DashboardController'
	});
	$routeProvider.when('/account', {
		templateUrl: 'views/account.html',
		controller: 'AccountController',
		loginRequired: true
	});

	// Administration -> Modules

	$routeProvider.when('/modules', {
		templateUrl: 'views/modules/list.html',
		controller: 'ModuleListController'
	});
	$routeProvider.when('/modules/new', {
		templateUrl: 'views/modules/edit.html',
		controller: 'ModuleDetailController'
	});
	$routeProvider.when('/modules/:module', {
		templateUrl: 'views/modules/show.html',
		controller: 'ModuleDetailController'
	});
	$routeProvider.when('/modules/:module/edit', {
		templateUrl: 'views/modules/edit.html',
		controller: 'ModuleDetailController'
	});
	$routeProvider.when('/modules/:module/delete', {
		templateUrl: 'views/modules/delete.html',
		controller: 'ModuleDetailController'
	});

	// Administration -> Users

	$routeProvider.when('/users', {
		templateUrl: 'views/users/list.html',
		controller: 'UserListController'
	});
	$routeProvider.when('/users/new', {
		templateUrl: 'views/users/edit.html',
		controller: 'UserDetailController'
	});
	$routeProvider.when('/users/:username', {
		templateUrl: 'views/users/show.html',
		controller: 'UserDetailController'
	});
	$routeProvider.when('/users/:username/edit', {
		templateUrl: 'views/users/edit.html',
		controller: 'UserDetailController'
	});
	$routeProvider.when('/users/:username/delete', {
		templateUrl: 'views/users/delete.html',
		controller: 'UserDetailController'
	});

	// Subjects

	$routeProvider.when('/subjects', {
		templateUrl: 'views/subjects/list.html',
		controller: 'SubjectListController'
	});
	$routeProvider.when('/subjects/new', {
		templateUrl: 'views/subjects/edit.html',
		controller: 'SubjectDetailController'
	});
	$routeProvider.when('/subjects/:subject', {
		templateUrl: 'views/subjects/show.html',
		controller: 'SubjectDetailController'
	});
	$routeProvider.when('/subjects/:subject/edit', {
		templateUrl: 'views/subjects/edit.html',
		controller: 'SubjectDetailController'
	});
	$routeProvider.when('/subjects/:subject/delete', {
		templateUrl: 'views/subjects/delete.html',
		controller: 'SubjectDetailController'
	});

	// MAGIC RULES!!!!!!!

	$routeProvider.when('/:module', {
		templateUrl: 'views/modules/show.html',
		controller: 'ModuleDetailController'
	});
	$routeProvider.when('/:module/:subject', {
		templateUrl: 'views/members/show.html',
		controller: 'MemberDetailController'
	});
	$routeProvider.when('/:module/:subject/edit', {
		templateUrl: 'views/subjects/edit.html',
		controller: 'SubjectDetailController'
	});

	// Subject -> Members

	$routeProvider.when('/:module/:subject/members', {
		templateUrl: 'views/members/list.html',
		controller: 'MemberListController'
	});
	$routeProvider.when('/:module/:subject/members/new', {
		templateUrl: 'views/members/edit.html',
		controller: 'MemberListController'
	});
	$routeProvider.when('/:module/:subject/members/:member', {
		templateUrl: 'views/members/show.html',
		controller: 'MemberDetailController'
	});
	$routeProvider.when('/:module/:subject/members/:member/evaluation', {
		templateUrl: 'views/evaluations/show.html',
		controller: 'EvaluationDetailController'
	});

	// Subject -> Tasks

	$routeProvider.when('/:module/:subject/tasks', {
		templateUrl: 'views/tasks/list.html',
		controller: 'TaskListController'
	});
	$routeProvider.when('/:module/:subject/tasks/new', {
		templateUrl: 'views/tasks/edit.html',
		controller: 'TaskDetailController'
	});
	$routeProvider.when('/:module/:subject/tasks/import', {
		templateUrl: 'views/tasks/import.html',
		controller: 'TaskImportController'
	});
	$routeProvider.when('/:module/:subject/tasks/:task', {
		templateUrl: 'views/tasks/show.html',
		controller: 'TaskDetailController'
	});
	$routeProvider.when('/:module/:subject/tasks/:task/edit', {
		templateUrl: 'views/tasks/edit.html',
		controller: 'TaskDetailController'
	});

	// Fallback

	$routeProvider.otherwise({
		templateUrl: 'views/errors/404.html'
	});

	$locationProvider.html5Mode(true);
});

app.run(function($rootScope, AuthService, AUTH_EVENTS, Session, $location) {

	AuthService.refresh().then(function() {
		$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
	}, function() {
		$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
	});

	$rootScope.$on('$locationChangeStart', function(event) {
		if ($location.path() === '/login' || $location.path() === '/logout' || $location.path() === '/signup') {
			return;
		}

		AuthService.refresh().then(function(res) {
			// Authentifizierung war erfolgreich
			Session.create(Date.now(), res.data);
			$rootScope.$broadcast(AUTH_EVENTS.loginRefreshed);
		}, function() {
			// Authentifizierung ist fehlgeschlagen, User abmelden
			event.preventDefault();
			AuthService.logout().then(function() {
				$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
			}, function() {
				$rootScope.$broadcast(AUTH_EVENTS.logoutFailed);
			});
		});
	});
});
