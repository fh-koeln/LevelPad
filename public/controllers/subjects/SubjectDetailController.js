/* global alert */

angular.module('levelPad').controller('SubjectDetailController', [
	'$scope', '$routeParams', '$location', '$http', '$log', 'DialogService', 'Module', 'Subject', 'CurrentModule', 'CurrentSubject', 'ChartOption',
	function ($scope, $routeParams, $location, $http, $log, DialogService, Module, Subject, CurrentModule, CurrentSubject, ChartOption) {

		'use strict';

		$http.get('/api/years').success(function(years) {
			$scope.years = years;
		});

		$http.get('/api/semesters').success(function(semesters) {
			$scope.semesters = semesters;
		});

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

		// Source: http://stackoverflow.com/a/11477986
		function objectFindByKey(array, key, value) {
			for (var i = 0; i < array.length; i++) {
				if (array[i][key] === value) {
					return array[i];
				}
			}
			return null;
		}

		$scope.subject = $scope.subject || CurrentSubject || new Subject();

		if (!$scope.subject.registrationPassword) {
			$scope.subject.registrationPassword = generatePassword();
			$scope.subject._registrationPasswordCheck = '0';
		} else {
			$scope.subject._registrationPasswordCheck = '1';
		}

		$scope.expireDates = getExpireDates();
		if ($scope.subject.registrationExpiresAt) {
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
		}

		$scope.update = function() {
			$scope.modules = Module.query(function() {

			}, function() {
				alert('Could not load modules.');
			});
		};
		$scope.update();


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
