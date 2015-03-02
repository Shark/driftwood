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
		]
	};

	$.getJSON("/dashboard/statistics")
	 .done(function(stats) {
	 	console.log("success");
	 	displayStatistics(stats)
	 }).fail(function() {
	 	console.log("fail");
	 	displayStatistics(sampleData);
	 });
});

function displayStatistics(stats) {
	var colors = [
		"#048192",
		"#4012A3",
		"#EECD02",
		"#EE7302",
		"#014F5A",
		"#250765",
		"#947F00",
		"#944700"
	];

	if("statusCodes" in stats) {
		var statusCodes = stats.statusCodes.map(function(current, index, array) {
			return {
				label: current.statusCode,
				value: current.count,
				color: colors[index % colors.length]
			};
		});

		var statusCodesCanvas = $('#statusCodes').get(0).getContext("2d");
		var statusCodesChart = new Chart(statusCodesCanvas).Pie(statusCodes, {});
	}
}