json.fileName @statistics.filename

json.parsedRequests @statistics.parsed_request_count

json.requestTimespan do
	json.begin @statistics.parsed_timespan.first_timestamp
	json.end @statistics.parsed_timespan.last_timestamp
end

json.statusCodes @statistics.http_status_codes.each do |status, count|
	json.statusCode status
	json.count count
end

json.httpMethods @statistics.http_methods.each do |method, count|
	json.method method
	json.count count
end

json.requestDetails @statistics.request_details

json.databaseTime @statistics.database_time

json.viewRenderingTime @statistics.view_time

json.partialsRenderingTime @statistics.partials_time

json.processBlockers @statistics.process_blockers do |route, count|
	json.route route
	json.hits count
end