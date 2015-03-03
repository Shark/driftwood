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
		],
		"databaseTime": [
			{
				"route": "BlaController.bla",
				"hits": 2,
				"sum": 2,
				"mean": 2.3,
				"min": 0,
				"max": 4
			}
		],
		"viewRenderingTime": [
			{
				"route": "BlaController.bla",
				"hits": 2,
				"sum": 2,
				"mean": 2.3,
				"min": 0,
				"max": 4
			}
		],
		"partialsRenderingTime": [
			{
				"route": "BlaController.bla",
				"hits": 2,
				"sum": 2,
				"mean": 2.3,
				"min": 0,
				"max": 4
			}
		],
		"httpMethods": [
			{
				"method": "GET",
				"count": 3
			}
		]
	};

$.getJSON("/dashboard/statistics.js")
	 .done(function(stats) {
	 	console.log("success");
	 	displayStatistics(stats)
	 }).fail(function(jqXHR, textStatus) {
	 	console.log("fail ("+textStatus+")");
	 	$('.container-fluid').hide();
	 	$('#error-message').removeClass('hidden');
	 });
});

function displayStatistics(stats) {
	var colors = [
		"#4D4D4D",
		"#5DA5DA",
		"#FAA43A",
		"#60BD68",
		"#F17CB0",
		"#CC0000",
		"#B2912F",
		"#999999",
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
		var tableData = stats.statusCodes.map(function(current, index) {
			return {
				statusCode: current.statusCode,
				count: current.count,
				percent: Math.round((current.count / sum)*100),
				color: colors[index % colors.length]
			};
		});

		$('#statusCodeCountCanvas').siblings('div.chart-loading').hide();
		var statusCodeCountCanvas = $('#statusCodeCountCanvas').show().get(0).getContext("2d");
		var statusCodeCountChart = new Chart(statusCodeCountCanvas).Pie(statusCodes, options);
		$("#statusCodeTable").html(HandlebarsTemplates['dashboard/status-codes'](tableData));
	}

	if("httpMethods" in stats) {
		var httpMethods = stats.httpMethods.map(function(current, index, array) {
			return {
				label: current.method,
				value: current.count,
				color: colors[index % colors.length]
			};
		});

		var sum = 0;
		stats.httpMethods.forEach(function(method) {
			sum += method.count;
		});
		var tableData = stats.httpMethods.map(function(current, index) {
			return {
				method: current.method,
				count: current.count,
				percent: Math.round((current.count / sum)*100),
				color: colors[index % colors.length]
			};
		});

		$('#requestMethodsCanvas').siblings('div.chart-loading').hide();
		var requestMethodsCanvas = $('#requestMethodsCanvas').show().get(0).getContext("2d");
		var requestMethodsChart = new Chart(requestMethodsCanvas).Pie(httpMethods, options);
		$("#requestMethodsTable").html(HandlebarsTemplates['dashboard/request-methods'](tableData));
	}

	if ("fileName" in stats) {
		$('span#fileName').html(stats.fileName);
	}

	if("parsedRequests" in stats) {
		$('span#parsedRequests').html(stats.parsedRequests);
	}

	if("requestTimespan" in stats) {
		var date_begin = new Date(stats.requestTimespan.begin);
		var date_end = new Date(stats.requestTimespan.end);

		$('span#requestTimespan').html(
			date_begin.toLocaleDateString() + ' ' + date_begin.toLocaleTimeString() + ' &ndash; ' +
			date_end.toLocaleDateString() + ' ' + date_end.toLocaleTimeString()
		);
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
		var tableData = stats.requestDetails.map(function(current, index) {
			return {
				route: current.route,
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100),
				sum: current.sum.toFixed(2),
				mean: current.mean.toFixed(2),
				min: current.min.toFixed(2),
				max: current.max.toFixed(2),
				color: colors[index % colors.length]
			};
		});

		$('#routeHits').siblings('div.chart-loading').hide();
		var routeHitsCanvas = $('#routeHits').show().get(0).getContext("2d");
		var routeHitsChart = new Chart(routeHitsCanvas).Pie(routeHits, options);
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
		$('#processBlockersTable').html(HandlebarsTemplates['dashboard/process-blockers'](tableData));
	}

	if("databaseTime" in stats) {
		var databaseTime = stats.databaseTime.map(function(current, index, array) {
			return {
				label: current.route,
				value: current.hits,
				color: colors[index % colors.length]
			}
		});

		var sum = 0;
		stats.databaseTime.forEach(function(route) {
			sum += route.hits;
		});
		var tableData = stats.databaseTime.map(function(current, index) {
			return {
				route: current.route,
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100),
				sum: current.sum.toFixed(2),
				mean: current.mean.toFixed(2),
				min: current.min.toFixed(2),
				max: current.max.toFixed(2),
				color: colors[index % colors.length]
			};
		});

		$('#databaseTimeCanvas').siblings('div.chart-loading').hide();
		var databaseTimeCanvas = $('#databaseTimeCanvas').show().get(0).getContext("2d");
		var databaseTimeChart = new Chart(databaseTimeCanvas).Pie(databaseTime, options);
		$('#databaseTimeTable').html(HandlebarsTemplates['dashboard/database-time'](tableData));
	}

	if("viewRenderingTime" in stats) {
		var viewRenderingTime = stats.viewRenderingTime.map(function(current, index, array) {
			return {
				label: current.route,
				value: current.hits,
				color: colors[index % colors.length]
			}
		});

		var sum = 0;
		stats.viewRenderingTime.forEach(function(route) {
			sum += route.hits;
		});
		var tableData = stats.viewRenderingTime.map(function(current, index) {
			return {
				route: current.route,
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100),
				sum: current.sum.toFixed(2),
				mean: current.mean.toFixed(2),
				min: current.min.toFixed(2),
				max: current.max.toFixed(2),
				color: colors[index % colors.length]
			};
		});

		$('#viewRenderingTimeCanvas').siblings('div.chart-loading').hide();
		var viewRenderingTimeCanvas = $('#viewRenderingTimeCanvas').show().get(0).getContext("2d");
		var viewRenderingTimeChart = new Chart(viewRenderingTimeCanvas).Pie(viewRenderingTime, options);
		$('#viewRenderingTimeTable').html(HandlebarsTemplates['dashboard/view-rendering-time'](tableData));
	}

	if("partialsRenderingTime" in stats) {
		var partialsRenderingTime = stats.partialsRenderingTime.map(function(current, index, array) {
			return {
				label: current.route,
				value: current.hits,
				color: colors[index % colors.length]
			}
		});

		var sum = 0;
		stats.partialsRenderingTime.forEach(function(route) {
			sum += route.hits;
		});
		var tableData = stats.partialsRenderingTime.map(function(current, index) {
			return {
				route: current.route,
				hits: current.hits,
				percent: Math.round((current.hits / sum)*100),
				sum: current.sum.toFixed(2),
				mean: current.mean.toFixed(2),
				min: current.min.toFixed(2),
				max: current.max.toFixed(2),
				color: colors[index % colors.length]
			};
		});

		$('#partialsRenderingTimeCanvas').siblings('div.chart-loading').hide();
		var partialsRenderingTimeCanvas = $('#partialsRenderingTimeCanvas').show().get(0).getContext("2d");
		var partialsRenderingTimeChart = new Chart(partialsRenderingTimeCanvas).Pie(partialsRenderingTime, options);
		$('#partialsRenderingTimeTable').html(HandlebarsTemplates['dashboard/view-rendering-time'](tableData));
	}

	$('.datatable').DataTable({
		searching: false,
    	paging: false,
    	info: false,
    	order: [[1,'desc'],[2,'desc']],
    	autoWidth: false
	});
}