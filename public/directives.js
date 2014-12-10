'use strict';

angular.module('levelPad')
.directive('accessRoles', ['AuthService', function(AuthService) {
	return {
		restrict: 'A',
		link: function($scope, element, attrs) {
			var prevDisp = element.css('display'),
				accessRoles;

			$scope.user = AuthService.user;
			$scope.$watch('user', function() {
				updateCSS();
			}, true);

			attrs.$observe('accessRoles', function(al) {
				if(al) {
					accessRoles = $scope.$eval(al);
				}
				updateCSS();
			});

			function updateCSS() {
				if (!AuthService.isAuthorized(accessRoles)) {
					element.css('display', 'none');
				} else {
					element.css('display', prevDisp);
				}
			}
		}
	};
}]);
