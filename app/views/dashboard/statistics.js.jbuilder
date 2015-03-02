json.statusCodeFrequency @tracker_http_status.categories do |key, value|
	json.statusCode key
	json.frequency value
end