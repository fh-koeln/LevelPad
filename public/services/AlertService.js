
angular.module('levelPad').service('AlertService', ['$rootScope', '$log', function($rootScope, $log) {

	var $scope = $rootScope.$new(true),
		delegates = [];

	$scope.bind = function(delegate) {
		delegates.push(delegate);
	};

	$scope.unbind = function(delegate) {
		for (var i = 0; i < delegates.length; i++) {
			if (delegates[i] === delegate) {
				delegates.splice(i--, 1);
			}
		}
	};

	$scope.showInfo = function(message, timeout) {
		$log.info('Show info message: ' + message);
		if (delegates.length > 0) {
			delegates[delegates.length - 1].showInfo(message, timeout);
		}
	};

	$scope.showSuccess = function(message, timeout) {
		$log.info('Show success message: ' + message);
		if (delegates.length > 0) {
			delegates[delegates.length - 1].showSuccess(message, timeout);
		}
	};

	$scope.showWarning = function(message, timeout) {
		$log.warn('Show warning message: ' + message);
		if (delegates.length > 0) {
			delegates[delegates.length - 1].showWarning(message, timeout);
		}
	};

	$scope.showError = function(message, timeout) {
		$log.error('Show error message: ' + message);
		if (delegates.length > 0) {
			delegates[delegates.length - 1].showError(message, timeout);
		}
	};

	$scope.clear = function() {
		if (delegates.length > 0) {
			delegates[delegates.length - 1].clear();
		}
	};

	$rootScope.$on('$routeChangeSuccess', function() {
		$scope.clear();
	});

	$rootScope.$on('$routeChangeError', function() {
		$scope.clear();
	});

	return $scope;
}]);
