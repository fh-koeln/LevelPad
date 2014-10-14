/* global angular, alert */

angular.module('levelPad').controller('UserListController', ['$scope', '$route', 'DialogService', 'User', function ($scope, $route, DialogService, User) {
	'use strict';

	$scope.update = function() {
		$scope.users = User.query(function() {

		}, function() {
			alert('Could not load users.');
		});
	};
	$scope.update();

	$scope.showCreateDialog = function() {
		var dialog = new DialogService('/users/new');
		dialog.scope.user = new User();
		dialog.scope.submit = function() {
			dialog.scope.module.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};

	$scope.showEditDialog = function(user) {
		var dialog = new DialogService('/users/:user/edit');
		dialog.scope.user = angular.copy(user);
		dialog.scope.submit = function() {
			dialog.scope.user.$save(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.scope.showDeleteDialog = function() {
			dialog.cancel();
			$scope.showDeleteDialog(user);
		};
		dialog.open();
	};

	$scope.showDeleteDialog = function(user) {
		var dialog = new DialogService('/users/:user/delete');
		dialog.scope.user = angular.copy(user);
		dialog.scope.delete = function() {
			dialog.scope.user.$delete(function() {
				dialog.submit();
				$scope.update();
			}, function() {
				alert('Fehler!');
			});
		};
		dialog.open();
	};
}]);
