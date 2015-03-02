require 'request_log_analyzer'

class DashboardController < ApplicationController
	before_action :load_report, except: [:index]

	def index
		
	end

	def statistics
		trackers = @r.aggregators.first.trackers

		@parsed_requests = @r.source.parsed_requests
		@tracker_http_status = trackers.find { |x| x.title == 'HTTP statuses returned' }
		@tracker_http_status = @tracker_http_status.categories

		@tracker_timespan = trackers.find { |x| x.title == 'Request timespan'}

		# Loop through the request details and place them in a new array without the bucket
		# data and the name of the route inside the hash for JSON output.
		@tracker_request_details_temp = trackers.find { |x| x.title == 'Request duration'}
		@tracker_request_details = []

		@tracker_request_details_temp.categories.each do |route, details|
			@tracker_request_details << {
				:route => route,
				:hits	=> details[:hits],
				:sum => details[:sum],
				:mean => details[:mean],
				:min => details[:min],
				:max => details[:max]
			}
		end

		@tracker_request_details.sort_by! { |k| k[:hits] }

		@tracker_process_blockers = trackers.find { |x| x.title == 'Process blockers (> 1 sec duration)'}
		@tracker_process_blockers = @tracker_process_blockers.categories.sort_by { |k, v| v}

	end

	private 

	def load_report
		@r = RequestLogAnalyzer::Controller.build(
      :output       => 'FixedWidth',
      :format				=> :rails3,
      :silent				=> true,
      :source_files => '/home/gerrit/dev/development.log'
    )
    @r.run!
	end
end