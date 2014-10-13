
angular.module('levelPad').factory('DialogService', ['$route', '$rootScope', '$modal', function($route, $rootScope, $modal) {
	return function(url, scope) {
		// Check if a route is existing for the given url
		if (!$route.routes[url]) {
			throw new Error('DialogService: $route contains no route for url ' + url);
		}

		// Create a new empty scope if no scope was provided
		if (!scope) {
			scope = $rootScope.$new();
		}

		// Private variables which holds $modal dialog and options later
		var self = this, modal, options = $route.routes[url];
		options.scope = scope;

		// Public variables and functions
		this.url = url;
		this.scope = scope;

		// Open a new dialog
		this.open = function() {
			modal = $modal.open(options);
			self.then = modal.result.then;
			return self;
		};

		// Submit will close the modal dialog and response to the promise with the scope as success-argument.
		this.submit = function() {
			modal.close(self.scope);
		};

		// If our scope has no submit method (default scope will not have any variables) we set the submit method.
		if (!scope.submit) {
			scope.submit = this.submit;
		}

		// Cancel will close the modal dialog and response to the promise with 'cancel' as failure-argument.
		this.cancel = function() {
			modal.dismiss('cancel');
		};

		// If our scope has no cancel method (default scope will not have any variables) we set the cancel method.
		if (!scope.cancel) {
			scope.cancel = this.cancel;
		}
	};
}]);
