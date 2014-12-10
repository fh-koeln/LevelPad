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

angular.module('levelPad')
.directive('activeNav', ['$location', function($location) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
			var anchor = element[0];
			if (element[0].nodeName !== 'A') {
				anchor = element.find('a')[0];
			}
			var path = anchor.href;

			scope.location = $location;
			scope.$watch('location.absUrl()', function(newPath) {
				path = normalizeUrl(path);
				newPath = normalizeUrl(newPath);

				if (path === newPath || (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)) {
					element.addClass('active');
				} else {
					element.removeClass('active');
				}
			});
		}
	};

	function normalizeUrl(url) {
		if (url[url.length - 1] !== '/') {
			url = url + '/';
		}
		return url;
	}
}]);
