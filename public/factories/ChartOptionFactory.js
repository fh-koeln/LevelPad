
angular.module('levelPad').factory('ChartOption', [function() {
	// Chart.js Options
				 return  {
					// Boolean - Determines whether to draw tooltips on the canvas or not
    				showTooltips: false,

					// Sets the chart to be responsive
					responsive: false,

					//Boolean - Whether we should show a stroke on each segment
					segmentShowStroke : false,

					//String - The colour of each segment stroke
					segmentStrokeColor : '#fff',

					//Number - The width of each segment stroke
					segmentStrokeWidth : 2,

					//Number - The percentage of the chart that we cut out of the middle
					percentageInnerCutout : 0, // This is 0 for Pie charts

					//Number - Amount of animation steps
					animationSteps : 1,

					//String - Animation easing effect
					animationEasing : 'easeOutBounce',

					//Boolean - Whether we animate the rotation of the Doughnut
					animateRotate : false,

					//Boolean - Whether we animate scaling the Doughnut from the centre
					animateScale : false,

					//String - A legend template
					legendTemplate : '<ul class="tc-chart-js-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'

				};
}]);