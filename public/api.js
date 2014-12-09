
// From http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
// http://bites.goodeggs.com/open_source/angular-cached-resource/
angular.module('levelPad').factory('RestfulResource', ['$cachedResource', function($cachedResource) {
	return function(key, url, params, methods) {
		var defaults = {
			create: { method: 'post' },
			update: { method: 'put' }
		};

		methods = angular.extend(defaults, methods);

		var resource = $cachedResource(key, url, params, methods);
		resource.prototype.$save = function(successCallback, errorCallback) {
			if (!this._id) {
				return this.$create(successCallback, errorCallback);
			} else {
				return this.$update(successCallback, errorCallback);
			}
		};
		return resource;
	};
}]);

/**
 * Provides a User REST API.
 */
angular.module('levelPad').service('User', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('users', '/api/users/:username', {
		username: '@username'
	});
}]);


angular.module('levelPad').service('UserMe', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('users', '/api/users/me', {
		username: 'me'
	});
}]);

/**
 * Provides a Module REST API.
 */
angular.module('levelPad').service('Module', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('modules','/api/modules/:module', {
		module: '@slug'
	});
}]);

/**
 * Provides a Module -> Subject REST API.
 */
angular.module('levelPad').service('Subject', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('subjects','/api/modules/:module/subjects/:subject', {
		module: '@module.slug',
		subject: '@slug'
	});
}]);

/**
 * Provides User Subject REST API.
 */
angular.module('levelPad').service('UserSubject', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('userSubjects', '/api/users/:user/subjects', {
		user: '@_id',
	});
}]);

/**
 * Provides a Module -> Subject -> Task REST API.
 */
angular.module('levelPad').service('Task', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('tasks', '/api/modules/:module/subjects/:subject/tasks/:task', {
		module: '@subject.module.slug',
		subject: '@subject.slug',
		task: '@slug'
	});
}]);

/**
 * Provides a Module -> Subject -> Task -> Level REST API.
 */
angular.module('levelPad').service('Level', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('levels','/api/modules/:module/subjects/:subject/tasks/:task/levels/:level', {
		module: '@subject.module.slug',
		subject: '@subject.slug',
		task: '@slug',
		level: '@_id',
	});
}]);

/**
 * Provides a Module -> Subject -> Member REST API.
 */
angular.module('levelPad').service('Member', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('members', '/api/modules/:module/subjects/:subject/members/:member', {
		module: '@subject.module.slug',
		subject: '@subject.slug',
		member: '@_id'
	});
}]);

/**
 * Provides an API which contains all models as dictionary.
 */
angular.module('levelPad').service('API', ['User', 'Module', 'Subject', 'Task', function(User, Module, Subject, Task) {
	return {
		User: User,
		Module: Module,
		Subject: Subject,
		Task: Task,
	};
}]);
