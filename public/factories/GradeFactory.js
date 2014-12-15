angular.module('levelPad').factory('Grade', [function() {
	// Chart.js Options
		
	
	function objectFindByKey(array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	};
	
	function absoluteGrade($scope){
		var absGrade = 0;
		var weightSum = 0;
		angular.forEach($scope.subject.tasks, function(task) {
			var countMin = 0;
			var evaluation = objectFindByKey($scope.member.evaluations, 'task', task._id);

			if (evaluation){
				weightSum += task.weight;
				var level = objectFindByKey(task.levels, '_id', evaluation.level);
				angular.forEach(task.levels, function(level) {
					if(level.isMinimum == true){
						countMin +=1;
					}
				});
				if(level){
					task.level = level;
				}
				if(task.level.isMinimum == true){
					absGrade+= (3/(countMin-1) * (task.level.rank -1) +1) * task.weight;
				}
				else{
					absGrade+= 5 * task.weight;
				}
			}
			if(!evaluation){
				weightSum += task.weight;
				absGrade+= 5 * task.weight;
			}
		});
		absGrade = absGrade / weightSum;
		return absGrade
	};

	function relativeGrade($scope){
		var relGrade = 0;
		var weightSum = 0;
		angular.forEach($scope.subject.tasks, function(task) {
			var countMin = 0;
			var evaluation = objectFindByKey($scope.member.evaluations, 'task', task._id);

			if (evaluation){
				weightSum += task.weight;
				var level = objectFindByKey(task.levels, '_id', evaluation.level);
				angular.forEach(task.levels, function(level) {
					if(level.isMinimum == true){
						countMin +=1;
					}
				});
				if(level){
					task.level = level;
				}
				if(task.level.isMinimum == true){
					relGrade+= (3/(countMin-1) * (task.level.rank -1) +1) * task.weight;
				}
				else{
					relGrade+= 5 * task.weight;
				}
			}
		});

		if (weightSum!=0){
			relGrade = relGrade / weightSum;
		}else{
			relGrade=5;	
		}
		return relGrade
	};
	 return  {
		 prepareMember: function prepareMember($scope) {
			$scope.relGrade = Math.round( relativeGrade($scope) * 100) / 100;
			$scope.absGrade = Math.round( absoluteGrade($scope) * 10) / 10;

			$scope.member._artefacts = [
				{
					title:'Artefakte',
					value: $scope.member.evaluations.length,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.subject.tasks.length - $scope.member.evaluations.length,
					color:'lightgray',
					highlight: 'lightgray'
				}
			];
			$scope.member._absGrade = [
				{
					title:'Note',
					value: 4-($scope.absGrade-1),
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.absGrade-1,
					color: 'lightgray',
					highlight: 'lightgray'
				}
			];
			$scope.member._relGrade = [
				{
					title:'Note',
					value: 4-($scope.relGrade-1),
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.relGrade-1,
					color: 'lightgray',
					highlight: 'lightgray'
				}
			];
			$scope.member._noneAbsGrade = [
				{
					title:'Note',
					value: 0,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.absGrade-1,
					color: '#E886B7',
					highlight: '#E886B7'
				}
			];
			$scope.member._noneRelGrade = [
				{
					title:'Note',
					value: 0,
					color: '#77cc00',
					highlight: '#88dd11'
				},
				{
					title:'Rest',
					value: $scope.relGrade-1,
					color: '#E886B7',
					highlight: '#E886B7'
				}
			];
			angular.forEach($scope.subject.tasks, function(task) {
				task._taskWeight = [
					{
						title:'Task',
						value: task.weight,
						color: '#77cc00',
						highlight: '#88dd11'
					},
					{
						title:'Rest',
						value: 100- task.weight,
						color:'lightgray',
						highlight: 'lightgray'
					}
				];

				var evaluation = objectFindByKey($scope.member.evaluations, 'task', task._id);
				if (evaluation){
					var level = objectFindByKey(task.levels, '_id', evaluation.level);
					if(level){
						task.level = level;
					}
				}

			});
		}
	 }
}]);