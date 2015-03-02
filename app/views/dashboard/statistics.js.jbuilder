json.parsedRequests @parsed_requests

json.statusCodes @tracker_http_status do |status, count|
	json.statusCode status
	json.count count
end

json.requestTimespan do
	json.begin @tracker_timespan.first
	json.end @tracker_timespan.last
end

json.requestDetails @tracker_request_details

json.processBlockers @tracker_process_blockers do |route, count|
	json.route route
	json.hits count
end