'use strict';

var app = angular.module('levelPad', [
	'ngCookies',
	'ngResource',
	'ngSanitize',
	'ui.bootstrap',
	'ui',
	'ui.router',
	'tc.chartjs',
	'ncy-angular-breadcrumb',
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
			controller: 'DashboardController',
			ncyBreadcrumb: {
				label: 'Dashboard'
			}
		},
		'account': {
			url: '/account',
			templateUrl: 'views/account.html',
			controller: 'AccountController',
			ncyBreadcrumb: {
				label: 'u:{{ user.firstname }}'
			}
		},

		// Administration -> Modules
		'modules': {
			url: '/modules',
			templateUrl: 'views/modules/list.html',
			controller: 'ModuleListController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Veranstaltungsmodule'
			}
		},
		'modules.new': {
			url: '/new',
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Anlegen'
			}
		},
		'modules.detail': {
			url: '/:module',
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController',
			resolve: {
				module: ['Module', '$stateParams', function(Module, $stateParams) {
					console.log('load module!');
					return Module.get({ module: $stateParams.module });
				}]
			},
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: '{{ module.shortName }}'
			}
		},
		'modules.detail.edit': {
			url: '/edit',
			templateUrl: 'views/modules/edit.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Bearbeiten'
			}
		},
		'modules.detail.delete': {
			url: '/delete',
			templateUrl: 'views/modules/delete.html',
			controller: 'ModuleDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Löschen'
			}
		},

		// Administration -> Users
		'users': {
			url: '/users',
			templateUrl: 'views/users/list.html',
			controller: 'UserListController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Benutzer'
			}
		},
		'users.new': {
			url: '/new',
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Anlegen'
			}
		},
		'users.detail': {
			url: '/:username',
			templateUrl: 'views/users/show.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: '{{ user.firstname }}'
			}
		},
		'users.detail.edit': {
			url: '/edit',
			templateUrl: 'views/users/edit.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Bearbeiten'
			}
		},
		'users.detail.delete': {
			url: '/delete',
			templateUrl: 'views/users/delete.html',
			controller: 'UserDetailController',
			authorizedRoles: [USER_ROLES.administrator],
			ncyBreadcrumb: {
				label: 'Löschen'
			}
		},

		// Subjects
		'subjects': {
			url: '/subjects',
			templateUrl: 'views/subjects/list.html',
			controller: 'SubjectListController',
			ncyBreadcrumb: {
				label: 'Alle Veranstaltungen'
			}
		},
		'subjects.new': {
			url: '/new',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController',
			ncyBreadcrumb: {
				label: 'Anlegen'
			}
		},
		'subjects.detail': {
			url: '/:subject',
			templateUrl: 'views/subjects/show.html',
			controller: 'SubjectDetailController',
			ncyBreadcrumb: {
				label: '{{ subject.semester }} {{subject.year }}'
			}
		},
		'subjects.detail.edit': {
			url: '/:subject/edit',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController',
			ncyBreadcrumb: {
				label: 'Bearbeiten'
			}
		},
		'subjects.detail.delete': {
			url: '/:subject/delete',
			templateUrl: 'views/subjects/delete.html',
			controller: 'SubjectDetailController',
			ncyBreadcrumb: {
				label: 'Löschen'
			}
		},

		// Modules direct "special short" URLs
		'module': {
			url: '/:module',
			templateUrl: 'views/modules/show.html',
			controller: 'ModuleDetailController',
			resolve: {
				module: ['Module', '$stateParams', function(Module, $stateParams) {
					console.log('load module!');
					return Module.get({ module: $stateParams.module });
				}]
			},
			ncyBreadcrumb: {
				label: '{{ module.shortName }}'
			}
		},
		'module.subject': {
			url: '/:subject',
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController',
			resolve: {
				subject: ['Subject', '$stateParams', function(Subject, $stateParams) {
					console.log('load module!');
					return Subject.get({ module: $stateParams.module, subject: $stateParams.subject });
				}]
			},
			ncyBreadcrumb: {
				label: '{{ subject.semester }} {{ subject.year }}'
			}
		},
		'module.subject.edit': {
			url: '/edit',
			templateUrl: 'views/subjects/edit.html',
			controller: 'SubjectDetailController',
			ncyBreadcrumb: {
				label: 'Bearbeiten'
			}
		},
		'module.subject.join': {
			url: '/join',
			templateUrl: 'views/subjects/join.html',
			controller: 'SubjectJoinController',
			ncyBreadcrumb: {
				label: 'Beitreten'
			}
		},

		// Subject -> Members
		'module.subject.members': {
			url: '/members',
			templateUrl: 'views/members/list.html',
			controller: 'MemberListController',
			ncyBreadcrumb: {
				label: 'u:{{ user.firstname }}'
			}
		},
		'module.subject.members.new': {
			url: '/new',
			templateUrl: 'views/members/edit.html',
			controller: 'MemberListController'
		},
		'module.subject.members.show': {
			url: '/:member',
			templateUrl: 'views/members/show.html',
			controller: 'MemberDetailController'
		},
		'module.subject.members.show.evaluation': {
			url: '/:task',
			templateUrl: 'views/evaluations/show.html',
			controller: 'EvaluationDetailController'
		},

		// Subject -> Tasks
		'module.subject.tasks': {
			url: '/tasks',
			templateUrl: 'views/tasks/list.html',
			controller: 'TaskListController'
		},
		'module.subject.tasks.new': {
			url: '/new',
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'module.subject.tasks.show': {
			url: '/:task',
			templateUrl: 'views/tasks/show.html',
			controller: 'TaskDetailController'
		},
		'module.subject.tasks.edit': {
			url: '/:task/edit',
			templateUrl: 'views/tasks/edit.html',
			controller: 'TaskDetailController'
		},
		'module.subject.tasks.delete': {
			url: '/:task/delete',
			templateUrl: 'views/tasks/delete.html',
			controller: 'TaskDetailController'
		},
		'module.subject.tasks.import': {
			url: '/import',
			templateUrl: 'views/tasks/import.html',
			controller: 'TaskImportController'
		},

		// Subject-> Tasks -> Level
		'module.subject.tasks.show.levels': {
			url: '/levels',
			templateUrl: 'views/levels/list.html',
			controller: 'LevelListController'
		},
		'module.subject.tasks.show.levels.new': {
			url: '/new',
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
		'module.subject.tasks.show.levels.show': {
			url: '/:level',
			templateUrl: 'views/levels/show.html',
			controller: 'LevelDetailController'
		},
		'module.subject.tasks.show.levels.edit': {
			url: '/:level/edit',
			templateUrl: 'views/levels/edit.html',
			controller: 'LevelDetailController'
		},
		'module.subject.tasks.show.levels.delete': {
			url: '/:level/delete',
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
//	$urlRouterProvider.otherwise('error404');

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
