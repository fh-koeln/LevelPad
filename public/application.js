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

app.config(['$routeProvider', '$locationProvider', 'USER_ROLES', function($routeProvider, $locationProvider, USER_ROLES) {

	var defaultResolvers = {};

	defaultResolvers.userAuthenticated = ['$q', 'AuthService', function($q, AuthService) {
		var deferred = $q.defer();

		var reject = function() {
			deferred.reject('login_required');
		};

		AuthService.refresh().then(function(result) {
			deferred.resolve(result);
		}, reject);

		return deferred.promise;
	}];

	var routes = {
		// Errors
		'/403': {
			templateUrl: 'views/errors/403.html'
		},
		'/404': {
			templateUrl: 'views/errors/404.html'
		},
		'/500': {
			templateUrl: 'views/errors/500.html'
		},
		'/503': {
			templateUrl: 'views/errors/503.html'
		},

		// Login / Signup / Logout
		'/signup': {
			templateUrl: 'views/auth/signup-page.html',
			controller: 'SignupController',
			public: true,
			resolve: {
				data : ['AuthService', '$location', function(AuthService, $location) {
					if (!AuthService.isAuthenticated()) {
						$location.path('/login');
					}
				}]
			}
		},
		'/login': {
			templateUrl: 'views/auth/login-page.html',
			controller: 'LoginController',
			public: true,
			resolve: {
				data : ['AuthService', '$location', function(AuthService, $location) {
					if (AuthService.isAuthenticated()) {
						$location.path('/');
					}
				}]
			}
		},
		'/logout': {
			templateUrl: 'views/auth/logout-page.html',
			controller: 'LogoutController',
			resolve: {
				data : ['AuthService', '$location', function(AuthService, $location) {
					if (!AuthService.isAuthenticated()) {
						$location.path('/');
					}
				}]
			}
		},

		// Misc
		'/' : {
			templateUrl: 'views/dashboard/dashboard.html',
			controller: 'DashboardController'
		},
		'/account': {
			templateUrl: 'views/account.html',
			controller: 'AccountController',
		},

		// Administration -> Modules
		'/modules': {
			templateUrl: 'views/modules/list.html',
			controller: 'ModuleListController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'/modules/new': {
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController'
		},
		'/modules/:module': {
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController'
		},
		'/modules/:module/edit': {
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController'
		},
		'/modules/:module/delete': {
			templateUrl: 'views/modules/delete.html',
			controller: 'ModuleDetailController'
		},
		'/users': {
			templateUrl: 'views/users/list.html',
			controller: 'UserListController'
		},
		'/users/new': {
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController'
		},
		'/users/:username': {
			templateUrl: 'views/users/show.html',
			controller: 'UserDetailController'
		},
		'/users/:username/edit': {
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController'
		},
		'/users/:username/delete': {
			templateUrl: 'views/users/delete.html',
			controller: 'UserDetailController'
		},

		// Subjects
		'/subjects': {
			templateUrl: 'views/subjects/list.html',
			controller: 'SubjectListController'
		},
		'/subjects/new': {
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},
		'/subjects/:subject': {
			templateUrl: 'views/subjects/show.html',
			controller: 'SubjectDetailController'
		},
		'/subjects/:subject/edit': {
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},
		'/subjects/:subject/delete': {
			templateUrl: 'views/subjects/delete.html',
			controller: 'SubjectDetailController'
		},

		// MAGIC RULES!!!!!!!
		'/:module': {
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController'
		},
		'/:module/:subject': {
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController'
		},
		'/:module/:subject/edit': {
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},

		// Subject -> Members
		'/:module/:subject/members': {
			templateUrl: 'views/members/list.html',
			controller: 'MemberListController'
		},
		'/:module/:subject/members/new': {
			templateUrl: 'views/members/edit.html',
			controller: 'MemberListController'
		},
		'/:module/:subject/members/:member': {
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController'
		},
		'/:module/:subject/members/:member/evaluation': {
			templateUrl: 'views/evaluations/show.html',
			controller: 'EvaluationDetailController'
		},

		// Subject -> Tasks
		'/:module/:subject/tasks': {
			templateUrl: 'views/tasks/list.html',
			controller: 'TaskListController'
		},
		'/:module/:subject/tasks/new': {
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'/:module/:subject/tasks/import': {
			templateUrl: 'views/tasks/import.html',
			controller: 'TaskImportController'
		},

		// Subject-> Tasks -> Level
		'/:module/:subject/tasks/:task': {
			templateUrl: 'views/tasks/show.html',
			controller: 'TaskDetailController'
		},
		'/:module/:subject/tasks/:task/edit': {
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'/:module/:subject/tasks/:task/levels': {
			templateUrl: 'views/levels/list.html',
			controller: 'LevelListController'
		},
		'/:module/:subject/tasks/:task/levels/new': {
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
		'/:module/:subject/tasks/:task/levels/:level': {
			templateUrl: 'views/levels/show.html',
			controller: 'LevelDetailController'
		},
		'/:module/:subject/tasks/:task/levels/:level/edit': {
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
	};


	angular.forEach(routes, function(params, location) {
		params.location = location;

		var resolve = angular.extend({}, defaultResolvers, params.resolve || {});

		if (params.public) {
			delete resolve.userAuthenticated;
		}

		// Add role based resolver
		if (params.role) {
			resolve.role = ['$q', 'AuthService', function($q, AuthService) {
				var deferred = $q.defer();

				if (AuthService.isAuthorized(params.role)) {
					deferred.resolve();
				} else {
					deferred.reject('missing_role');
				}
			}];
		}

		params.resolve = resolve;

		$routeProvider.when(location, params);
	});


	// Fallback
	$routeProvider.otherwise({
		templateUrl: 'views/errors/404.html'
	});

	$locationProvider.html5Mode(true);
}]);

/*app.run(function($rootScope, AuthService, AUTH_EVENTS, Session, $location, $injector) {
	console.log($rootScope);


	$rootScope.$on('$routeChangeStart', function (event, next) {
		var $route = $injector.get('$route');
		if ($route.routes) {
			var currentPath = next.$$route.originalPath,
				currentRoute = null;

			if ($route.routes[currentRoute]) {
				currentRoute = $route.routes[currentPath];
			}

			if (currentRoute.authorizedRoles) {
				if (!AuthService.isAuthorized(currentRoute.authorizedRoles)) {
					event.preventDefault();
					if (AuthService.isAuthenticated()) {
						// user is not allowed
						$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
					} else {
						// user is not logged in
						$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
					}
				}
			}
		}
	});
});*/
