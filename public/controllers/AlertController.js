
angular.module('levelPad').controller('AlertController', ['$scope', 'AlertService', function ($scope, alertService) {

	$scope.alerts = [];

	var addAlert = function(type, message, timeout) {
		var alert = {
			type: type,
			class: 'alert alert-' + type + ' alert-dismissable',
			message: message
		};

		//$scope.$emit('alert', alert);

		$scope.alerts.push(alert);
		//$scope.$apply();

		// Automatically close the alert message again...
		// If the timeout is not null, zero or lower than zero.
		if (timeout === undefined) {
			timeout = 5000;
		}
		if (timeout > 0) {
			setTimeout(function() {
				for (var index = 0; index < $scope.alerts.length; index++) {
					if (angular.equals($scope.alerts[index], alert)) {
						$scope.alerts.splice(index, 1);
					}
				}
				$scope.$apply();
			}, timeout);
		}
	};

	$scope.showInfo = function(message, timeout) {
		addAlert('info', message, timeout);
	};

	$scope.showSuccess = function(message, timeout) {
		addAlert('success', message, timeout);
	};

	$scope.showWarning = function(message, timeout) {
		addAlert('warning', message, timeout);
	};

	$scope.showError = function(message, timeout) {
		addAlert('danger', message, timeout);
	};

	$scope.hide = function(index) {
		$scope.alerts.splice(index, 1);
		//$scope.$apply();
	};

	$scope.clear = function() {
		$scope.alerts.length = 0;
		//$scope.$apply();
	};

	alertService.bind($scope, 'login');
	$scope.$on('$destroy', function () {
		alertService.unbind($scope, 'login');

	});

}]);
