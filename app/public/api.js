
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
 * Provides a Module model.
 */
angular.module('levelPad').service('Module', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/modules/:slug', { slug: '@slug' });
}]);

/**
 * Provides a Subject model.
 */
angular.module('levelPad').service('Subject', ['RestfulResource', function(RestfulResource) {
	return RestfulResource('/api/subjects/:slug', { slug: '@slug' });
}]);

/**
 * Provides an API which contains all models as dictionary.
 */
angular.module('levelPad').service('API', ['Module', 'Subject', function(Module, Subject) {
	return {
		Module: Module,
		Subject: Subject
	};
}]);
