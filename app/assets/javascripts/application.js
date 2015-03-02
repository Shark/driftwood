// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require turbolinks
//= require_tree .
//= require Chart

/*
	API
	Route: /dashboard/statistics
	{
		"statusCodeFrequency": [
			{}
				statusCode: 200,
				frequency: 0.4
			},
			{
				statusCode: 404,
				frequency: 0.6
			}
		]
	}
 */

 $(function() {
	var sampleData = {
		"statusCodes": [
			{
				statusCode: 200,
				count: 400
			},
			{
				statusCode: 404,
				count: 600
			}
		],
		"parsedRequests": 5000,
		"requestTimespan": {
			"begin": "000000",
			"end": "000000"
		},
		"requestDetails": [
			{
				"route": "BlaController.bla",
				"hits": 2,
				"sum": 2,
				"mean": 2.3,
				"min": 0,
				"max": 4
			}
		],
		"processBlockers": [
			{
				"route": "BlaController.bla",
				"hits": 10
			}
		]
	};

	$.getJSON("/dashboard/statistics")
	 .done(function(stats) {
	 	console.log("success");
	 	displayStatistics(stats)
	 }).fail(function(jqXHR, textStatus) {
	 	console.log("fail ("+textStatus+")");
	 	displayStatistics(sampleData);
	 });
});

function displayStatistics(stats) {
	var colors = [
		"#4D4D4D",
		"#5DA5DA",
		"#FAA43A",
		"#60BD68",
		"#F17CB0",
		"#B2912F",
		"#B276B2",
		"#DECF3F",
		"#F15854"
	];

	var options = {
		legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li class="legend-item" style=\"background-color:<%=segments[i].fillColor%>\"><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
	}

	if("statusCodes" in stats) {
		var statusCodes = stats.statusCodes.map(function(current, index, array) {
			return {
				label: current.statusCode,
				value: current.count,
				color: colors[index % colors.length]
			};
		});

		var statusCodeCountCanvas = $('#statusCodeCountCanvas').get(0).getContext("2d");
		var statusCodeCountChart = new Chart(statusCodeCountCanvas).Pie(statusCodes, options);
		$('#statusCodeCountLegend').html(statusCodeCountChart.generateLegend());
		$('#statusCodeCountCanvas').removeAttr('width').removeAttr("height").removeAttr("style");
	}

	if("parsedRequests" in stats) {
		$('span#parsedRequests').html(stats.parsedRequests);
	}

	if("requestTimespan" in stats) {
		$('span#requestTimespan').html(stats.requestTimespan.begin+'-'+stats.requestTimespan.end);
	}

	if("requestDetails" in stats) {
		var routeHits = stats.requestDetails.map(function(current, index, array) {
			return {
				label: current.route,
				value: current.hits,
				color: colors[index % colors.length]
			}
		});

		var routeHitsCanvas = $('#routeHits').get(0).getContext("2d");
		var routeHitsChart = new Chart(routeHitsCanvas).Pie(routeHits, options);
		$('#routeHitsLegend').html(routeHitsChart.generateLegend());
		$('#routeHits').removeAttr('width').removeAttr("height").removeAttr("style");
	}

	if("processBlockers" in stats) {
		var processBlockers = {
			labels: stats.processBlockers.map(function(current, index, array) {
				return current.route;
			}),
			datasets: [
				{
					label: 'blocked requests (>1 sec)',
					fillColor: "rgba(151,187,205,0.5)",
            		strokeColor: "rgba(151,187,205,0.8)",
            		highlightFill: "rgba(151,187,205,0.75)",
            		highlightStroke: "rgba(151,187,205,1)",
	            	data: stats.processBlockers.map(function(current, index, array) {
	            		return current.hits;
	            	})
            	}
			]
		};

		var processBlockersCanvas = $('#processBlockers').get(0).getContext("2d");
		var processBlockersChart = new Chart(processBlockersCanvas).Bar(processBlockers, {});
		$('#processBlockersLegend').html(processBlockersChart.generateLegend());
		$('#processBlockers').removeAttr('width').removeAttr("height").removeAttr("style");
	}
}