json.parsedRequests @parsed_requests

json.statusCodeFrequency @tracker_http_status.categories do |key, value|
	json.statusCode key
	json.frequency value
end

json.requestTimespan do
	json.begin @tracker_timespan.first
	json.end @tracker_timespan.last
end