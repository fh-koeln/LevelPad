'use strict';

var app = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ui.bootstrap'
]);

app.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
}]);

app.factory('httpErrorInterceptor', ['$q', '$location', function($q, $location) {

	return {
		'responseError': function(response) {
			if (response.status === 401) {
				console.error('Authentitication error in server response detected!');
			} else if (response.status === 403) {
				console.error('Access error in server response detected!');
				$location.path('/403');
			} else if (response.status === 404) {
				console.error('Not found error in server response detected!');
				$location.path('/404');
			} else if (response.status === 500) {
				console.error('Server error in server response detected!');
				$location.path('/500');
			} else if (response.status === 503) {
				console.error('Server is not available');
				$location.path('/503');
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
		templateUrl: 'views/modules/show.html',
		controller: 'DashboardController'
	});
	$routeProvider.when('/dashboard', {
		templateUrl: 'views/dashboard.html',
		controller: 'MainController'
	});
	$routeProvider.when('/account', {
		templateUrl: 'views/account.html',
		controller: 'AccountController',
		loginRequired: true,
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
		controller: 'ModuleDetailController'
	});
	$routeProvider.when('/:module/edit', {
		templateUrl: 'views/modules/edit.html',
		controller: 'ModuleDetailController'
	});

	$routeProvider.when('/:module/:subject', {
		redirectTo: '/:module/:subject/tasks'
	});

	$routeProvider.when('/:module/:subject/tasks', {
		templateUrl: 'views/tasks/list.html',
		controller: 'TaskListController'
	});
	$routeProvider.when('/:module/:subject/tasks/new', {
		templateUrl: 'views/tasks/edit.html',
		controller: 'TaskDetailController'
	});
	$routeProvider.when('/:module/:subject/tasks/:task', {
		templateUrl: 'views/tasks/edit.html',
		controller: 'TaskDetailController'
	});

	$routeProvider.when('/:module/:subject/teams', {
		templateUrl: 'views/teams/list.html',
		controller: 'TeamListController'
	});
	$routeProvider.when('/:module/:subject/teams/new', {
		templateUrl: 'views/teams/edit.html',
		controller: 'TeamDetailController'
	});
	$routeProvider.when('/:module/:subject/teams/:team', {
		templateUrl: 'views/teams/edit.html',
		controller: 'TeamDetailController'
	});
	$routeProvider.when('/:module/:subject/students', {
		templateUrl: 'views/students/list.html',
		controller: 'StudentListController'
	});
	$routeProvider.when('/:module/:subject/students/new', {
		templateUrl: 'views/students/edit.html',
		controller: 'StudentDetailController'
	});
	$routeProvider.when('/:module/:subject/students/:student', {
		templateUrl: 'views/students/edit.html',
		controller: 'StudentDetailController'
	});
	$routeProvider.when('/:module/:subject/settings', {
		templateUrl: 'views/subjects/settings.html',
		controller: 'SubjectDetailController'
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
