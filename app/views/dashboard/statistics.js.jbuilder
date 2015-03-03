json.fileName @logfile_name

json.parsedRequests @parsed_requests

json.statusCodes @tracker_http_status do |status, count|
	json.statusCode status
	json.count count
end

json.httpMethods @tracker_http_status do |method, count|
	json.method method
	json.count count
end

json.requestTimespan do
	json.begin @tracker_timespan.first_timestamp
	json.end @tracker_timespan.last_timestamp
end

json.requestDetails @tracker_request_details

json.databaseTime @database_request_details

json.viewRenderingTime @view_rendering_details

json.partialsRenderingTime @partials_rendering_details

json.processBlockers @tracker_process_blockers do |route, count|
	json.route route
	json.hits count
end