
// From http://kirkbushell.me/angular-js-using-ng-resource-in-a-more-restful-manner/
angular.module('levelPad').factory('RestfulResource', ['$resource', function($resource) {
	return function(url, params, methods) {
		var defaults = {
			create: { method: 'post' },
			update: { method: 'put' }
		};

		methods = angular.extend(defaults, methods);

		var resource = $resource(url, params, methods);
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
	return RestfulResource('/api/users/:username', {
		username: '@username'
	}, {
		save: { method: 'PUT' }
	});
}]);

/**
 * Provides a Module REST API.
 */
angular.module('levelPad').service('Module', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/modules/:module', {
		module: '@slug'
	});
}]);

/**
 * Provides a Module -> Subject REST API.
 */
angular.module('levelPad').service('Subject', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/modules/:module/subjects/:subject', {
		module: '@module.slug',
		subject: '@slug'
	});
}]);

/**
 * Provides a Module -> Subject -> Task REST API.
 */
angular.module('levelPad').service('Task', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/modules/:module/subjects/:subject/tasks/:task', {
		module: '@subject.module.slug',
		subject: '@subject.slug',
		task: '@slug'
	});
}]);

/**
 * Provides a Module -> Subject -> Task -> Team REST API.
 */
angular.module('levelPad').service('Team', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/modules/:module/subjects/:subject/tasks/:task/teams/:team', {
		module: '@task.subject.module.slug',
		subject: '@task.subject.slug',
		task: '@task.slug',
		team: '@slug',
	});
}]);

/**
 * Provides an API which contains all models as dictionary.
 */
angular.module('levelPad').service('API', ['User', 'Module', 'Subject', 'Task', 'Team', function(User, Module, Subject, Task, Team) {
	return {
		User: User,
		Module: Module,
		Subject: Subject,
		Task: Task,
		Team: Team
	};
}]);
