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
////= require handlebars.runtime
//= require_tree ./templates
//= require twitter/bootstrap
//= require turbolinks
//= require Chart
//= require dataTables/jquery.dataTables
//= require dataTables/bootstrap/2/jquery.dataTables.bootstrap
//= require_tree .
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

		var sum = 0;
		stats.statusCodes.forEach(function(statusCode) {
			sum += statusCode.count;
		});
		var tableData = stats.statusCodes.map(function(current) {
			return {
				statusCode: current.statusCode,
				count: current.count,
				percent: Math.round((current.count / sum)*100)
			};
		});

		$('#statusCodeCountCanvas').siblings('div.chart-loading').hide();
		var statusCodeCountCanvas = $('#statusCodeCountCanvas').show().get(0).getContext("2d");
		var statusCodeCountChart = new Chart(statusCodeCountCanvas).Pie(statusCodes, options);
		$('#statusCodeCountLegend').html(statusCodeCountChart.generateLegend());
		$("#statusCodeTable").html(HandlebarsTemplates['dashboard/status-codes'](tableData));
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

		var sum = 0;
		stats.requestDetails.forEach(function(route) {
			sum += route.hits;
		});
		var tableData = stats.requestDetails.map(function(current) {
			return {
				route: current.route.replace("#","\n#"),
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100),
				sum: current.sum.toFixed(2),
				mean: current.mean.toFixed(2),
				min: current.min.toFixed(2),
				max: current.max.toFixed(2)
			};
		});

		$('#routeHits').siblings('div.chart-loading').hide();
		var routeHitsCanvas = $('#routeHits').show().get(0).getContext("2d");
		var routeHitsChart = new Chart(routeHitsCanvas).Pie(routeHits, options);
		//$('#routeHits').removeAttr('width').removeAttr("height").removeAttr("style");
		$('#routeHitsTable').html(HandlebarsTemplates['dashboard/route-hits'](tableData));
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

		var sum = 0;
		stats.processBlockers.forEach(function(route) {
			sum += route.hits;
		});
		var tableData = stats.processBlockers.map(function(current) {
			return {
				route: current.route,
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100)
			};
		});

		$('#processBlockers').siblings('div.chart-loading').hide();
		var processBlockersCanvas = $('#processBlockers').show().get(0).getContext("2d");
		var processBlockersChart = new Chart(processBlockersCanvas).Bar(processBlockers, {});
		//$('#processBlockers').removeAttr('width').removeAttr("height").removeAttr("style");
		$('#processBlockersTable').html(HandlebarsTemplates['dashboard/process-blockers'](tableData));
	}

	$('.datatable').DataTable({
		searching: false,
    	paging: false,
    	info: false,
    	order: [[1,'desc'],[2,'desc']],
    	autoWidth: false
	});	
}