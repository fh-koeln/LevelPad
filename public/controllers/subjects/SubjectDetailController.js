/* global alert */

angular.module('levelPad').controller('SubjectDetailController', [
	'$scope', '$routeParams', '$location', '$http', '$log', 'DialogService', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject', 'ChartOption', 'AlertService',
	function ($scope, $routeParams, $location, $http, $log, DialogService, Module, Subject, CurrentModule, CurrentSubject, ChartOption, AlertService) {

		'use strict';

		$scope.$location = $location;

		$http.get('/api/years').success(function(years) {
			$scope.years = years;
		});

		$http.get('/api/semesters').success(function(semesters) {
			$scope.semesters = semesters;
		});

		$http.get('/api/modules').success(function(modules) {
			$scope.modules = modules;
		});

		function zeroize(x) {
			return (x < 10) ? '0' + x : x;
		}

		function getExpireDates() {
			var dates = [],
				today, actualDate, todayInTwoWeeks;

			actualDate = new Date(),
			today = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 23, 59, 59);
			todayInTwoWeeks = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);

			dates.push({
				name: 'Unbeschränkt',
				timestamp: 0
			});

			while (today <= todayInTwoWeeks) {
				dates.push({
					name: zeroize(today.getDate()) + '.' +  zeroize(today.getMonth() + 1) + '.' + today.getFullYear(),
					timestamp: today.getTime()
				});
				today.setDate(today.getDate() + 1);
			}

			return dates;
		}
		$scope.expireDates = getExpireDates();

		function prepareSubject() {
			if ($scope.subject.registrationPassword === undefined) {
				$scope.subject.registrationPassword = generatePassword();
				$scope.subject._registrationPasswordCheck = 'inactive';
			} else if ( $scope.subject.registrationPassword === '') {
				$scope.subject._registrationPasswordCheck = 'inactive';
			} else {
				$scope.subject._registrationPasswordCheck = 'active';
			}

			if ($scope.subject.registrationActive === true) {
				var oldDate = new Date($scope.subject.registrationExpiresAt), dateObject, existingDateObject;

				existingDateObject = objectFindByKey($scope.expireDates, 'timestamp', oldDate.getTime());

				if (!existingDateObject) {
					dateObject = {
						name: zeroize(oldDate.getDate()) + '.' +  zeroize(oldDate.getMonth() + 1) + '.' + oldDate.getFullYear(),
						timestamp: oldDate.getTime()
					};
					$scope.expireDates.push(dateObject);
					$scope.subject.registrationExpiresAt = dateObject;
				} else {
					$scope.subject.registrationExpiresAt = existingDateObject;
				}

				$scope.expireDates.sort(function(a, b) {
					return a.timestamp - b.timestamp;
				});
				$scope.subject.registrationActive = 'active';
			} else if ( $scope.subject.registrationActive === false ) {
				$scope.subject.registrationExpiresAt = $scope.expireDates[0];
				$scope.subject.registrationActive = 'inactive';
			} else if ( $scope.subject.registrationActive === undefined ) {
				$scope.subject.registrationExpiresAt = $scope.expireDates[0];
				$scope.subject.registrationActive = 'active';
			}
		}

		$scope.update = function() {
			if ($routeParams.module && $routeParams.subject) {
				$scope.subject = Subject.get({
					module: $routeParams.module,
					subject: $routeParams.subject
				}, function() {
					prepareSubject();
				});
			} else {
				$scope.subject = new Subject();
				prepareSubject();
			}
		};

		$scope.update();

		function generatePassword() {
			var password = '',
				temp;

			for(var i = 0; i < 10; i++) {
				temp = 0;
				while(!((temp > 48 && temp < 57) || (temp > 65 && temp < 90) || (temp > 97 && temp < 122))) {
					temp = Math.floor(Math.random() * 74) + 48;
				}
				password += String.fromCharCode(temp);
			}

			return password;
		}

		// Source: http://stackoverflow.com/a/11477986
		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}

		$scope.generatePassword = function() {
			$scope.subject.registrationPassword = generatePassword();
		};

		$scope._save = function() {
			var module = $scope.subject.module;
			delete $scope.subject.module;

			if ($scope.subject.registrationExpiresAt) {
				$scope.subject.registrationExpiresAt = $scope.subject.registrationExpiresAt.timestamp;
			}

			if ($scope.subject.registrationActive === 'inactive') {
				$scope.subject.registrationActive = 0;
				$scope.subject.registrationExpiresAt = null;
			} else {
				$scope.subject.registrationActive = 1;
			}

			if ($scope.subject._registrationPasswordCheck === 'inactive') {
				$scope.subject.registrationPassword = '';
			}

			delete $scope.subject._registrationPasswordCheck;

			return $scope.subject.$save({module: module.slug});
		};

		$scope._delete = function() {
			return $scope.subject.$delete({module: $scope.subject.module.slug});
		};

		$scope.showDeleteDialog = function() {
			var dialog = new DialogService('/subjects/:subject/delete');
			dialog.scope.delete = function () {
				this._delete().then(function() {
					dialog.submit();
					$location.path('/');
				}, function () {
					alert('Fehler!');
				});
			};
			dialog.open();
		};

		$scope.showEditDialog = function() {
			var dialog = new DialogService('/subjects/:subject/edit');
			dialog.scope.submit = function() {
				this._save().then(function() {
					prepareSubject();
					dialog.submit();
				}, function() {
					AlertService.showError('Fehler!',-1);
				});
			};
			dialog.scope.showConfirmDeleteDialog = function() {
				dialog.cancel();
				this.showDeleteDialog();
			};
			dialog.open();
		};

		//Pie Chart Magic
		$scope.options = ChartOption;
		// Chart.js Data
		$scope.data = [
		  {
			title:'Learning Outcome',
			value: 20,
			color: '#77cc00',
			highlight: '#88dd11'
		  },
		  {
			title:'Rest',
			value: 100-20,
			color:'lightgray',
			highlight: 'lightgray'
		  }
		];

}]);
