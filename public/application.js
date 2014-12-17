'use strict';

var app = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.bootstrap',
	'ui',
	'ui.router',
	'tc.chartjs',
	'btford.markdown'
]);

app.config(['$logProvider', function($logProvider) {
	$logProvider.debugEnabled(true);
}]);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push( ['$q', function($q) {

		return {
			'responseError': function(response) {
				if (response.status === 401) {
					console.error('Authentication error in server response detected!');
				} else if (response.status === 403) {
					console.error('Access error in server response detected!');
				} else if (response.status === 404) {
					console.error('Not found error in server response detected!');
				} else if (response.status === 500) {
					console.error('Server error in server response detected!');
				} else if (response.status === 503) {
					console.error('Server is not available');
				}

				return $q.reject(response);
			}
		};
	}]);
}]);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'USER_ROLES', function($stateProvider, $urlRouterProvider, $locationProvider, USER_ROLES) {

	var defaultResolvers = {};

	defaultResolvers.userAuthenticated = ['$q', 'AuthService', function($q, AuthService) {
		var deferred = $q.defer();

		if (AuthService.isAuthenticated()) {
			deferred.resolve();
		} else {
			deferred.reject('login_required');
		}

		return deferred.promise;
	}];

	var routes = {
		// Errors
		'error403': {
			templateUrl: 'views/errors/403.html'
		},
		'error404': {
			templateUrl: 'views/errors/404.html'
		},
		'error500': {
			templateUrl: 'views/errors/500.html'
		},
		'error503': {
			templateUrl: 'views/errors/503.html'
		},

		// Login / Signup / Logout
		'signup': {
			url: '/signup',
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
		'login': {
			url: '/login',
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
		'logout': {
			url: '/logout',
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
		'dashboard' : {
			url: '/',
			templateUrl: 'views/dashboard/dashboard.html',
			controller: 'DashboardController'
		},
		'account': {
			url: '/account',
			templateUrl: 'views/account.html',
			controller: 'AccountController'
		},

		// Administration -> Modules
		'modules.list': {
			url: '/modules',
			templateUrl: 'views/modules/list.html',
			controller: 'ModuleListController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'modules.new': {
			url: '/modules/new',
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'modules.show': {
			url: '/modules/:module',
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'modules.edit': {
			url: '/modules/:module/edit',
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'modules.delete': {
			url: '/modules/:module/delete',
			templateUrl: 'views/modules/delete.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},

		// Administration -> Users
		'users.list': {
			url: '/users',
			templateUrl: 'views/users/list.html',
			controller: 'UserListController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'users.new': {
			url: '/users/new',
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'users.show': {
			url: '/users/:username',
			templateUrl: 'views/users/show.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'users.edit': {
			url: '/users/:username/edit',
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},
		'users.delete': {
			url: '/users/:username/delete',
			templateUrl: 'views/users/delete.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator]
		},

		// Subjects
		'subjects.list': {
			url: '/subjects',
			templateUrl: 'views/subjects/list.html',
			controller: 'SubjectListController'
		},
		'subjects.new': {
			url: '/subjects/new',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},
		'subjects.show': {
			url: '/subjects/:subject',
			templateUrl: 'views/subjects/show.html',
			controller: 'SubjectDetailController'
		},
		'subjects.edit': {
			url: '/subjects/:subject/edit',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},
		'subjects.delete': {
			url: '/subjects/:subject/delete',
			templateUrl: 'views/subjects/delete.html',
			controller: 'SubjectDetailController'
		},

		// Modules direct "special short" URLs
		'module.show': {
			url: '/:module',
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController'
		},
		'module.subject.show': {
			url: '/:module/:subject',
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController'
		},
		'module.subject.edit': {
			url: '/:module/:subject/edit',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController'
		},
		'module.subject.join': {
			url: '/:module/:subject/join',
			templateUrl: 'views/subjects/join.html',
			controller: 'SubjectJoinController'
		},

		// Subject -> Members
		'members.list': {
			url: '/:module/:subject/members',
			templateUrl: 'views/members/list.html',
			controller: 'MemberListController'
		},
		'members.new': {
			url: '/:module/:subject/members/new',
			templateUrl: 'views/members/edit.html',
			controller: 'MemberListController'
		},
		'members.show': {
			url: '/:module/:subject/members/:member',
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController'
		},
		'members.show.evaluation': {
			url: '/:module/:subject/members/:member/:task',
			templateUrl: 'views/evaluations/show.html',
			controller: 'EvaluationDetailController'
		},

		// Subject -> Tasks
		'tasks.list': {
			url: '/:module/:subject/tasks',
			templateUrl: 'views/tasks/list.html',
			controller: 'TaskListController'
		},
		'tasks.new': {
			url: '/:module/:subject/tasks/new',
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'tasks.show': {
			url: '/:module/:subject/tasks/:task',
			templateUrl: 'views/tasks/show.html',
			controller: 'TaskDetailController'
		},
		'tasks.edit': {
			url: '/:module/:subject/tasks/:task/edit',
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'tasks.delete': {
			url: '/:module/:subject/tasks/:task/delete',
			templateUrl: 'views/tasks/delete.html',
			controller: 'TaskDetailController'
		},
		'tasks.import': {
			url: '/:module/:subject/tasks/import',
			templateUrl: 'views/tasks/import.html',
			controller: 'TaskImportController'
		},

		// Subject-> Tasks -> Level
		'level.list': {
			url: '/:module/:subject/tasks/:task/levels',
			templateUrl: 'views/levels/list.html',
			controller: 'LevelListController'
		},
		'level.new': {
			url: '/:module/:subject/tasks/:task/levels/new',
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
		'level.show': {
			url: '/:module/:subject/tasks/:task/levels/:level',
			templateUrl: 'views/levels/show.html',
			controller: 'LevelDetailController'
		},
		'level.edit': {
			url: '/:module/:subject/tasks/:task/levels/:level/edit',
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
		'level.delete': {
			url: '/:module/:subject/tasks/:task/levels/:level/delete',
			templateUrl: 'views/levels/delete.html',
			controller: 'LevelDetailController'
		}
	};

	angular.forEach(routes, function(params, location) {
		params.location = location;
		params.caseInsensitiveMatch = true;
		params.reloadOnSearch = false;

		var resolve = angular.extend({}, defaultResolvers, params.resolve || {});

		if (params.public) {
			delete resolve.userAuthenticated;
		}

		// Add role based resolver
		if (params.authorizedRoles) {
			resolve.authorizedRoles = ['$q', 'AuthService', function($q, AuthService) {
				var deferred = $q.defer();

				if (AuthService.isAuthorized(params.authorizedRoles)) {
					deferred.resolve();
				} else {
					deferred.reject('missing_role');
				}

				return deferred.promise;
			}];
		}

		params.resolve = resolve;

		$stateProvider.state(location, params);
	});

	// TODO Fallback
//	$urlRouterProvider.otherwise('views/errors/404.html');

	$locationProvider.html5Mode(true);
}]);

app.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
	// It's very handy to add references to $state and $stateParams to the $rootScope
	// so that you can access them from any scope within your applications.For example,
	// <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
	// to active whenever 'contacts.list' or one of its decendents is active.
	$rootScope.$state = $state;
	$rootScope.$stateParams = $stateParams;
}]);
