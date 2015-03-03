require 'request_log_analyzer'

class DashboardController < ApplicationController
	before_action :load_report, only: [:statistics]
	caches_page :statistics

	LOGFILE_NAME = '/home/gerrit/dev/development.log'

	def index
		# Get the last change date from cache and the changed date of the actual file.
		logfile_date_cached = Rails.cache.fetch('logfile_date')
		logfile_date_current = File.mtime(LOGFILE_NAME)

		# Delete the analyzed data from cache if the dates don't match.
		if (logfile_date_cached != logfile_date_current)
			Rails.cache.write('logfile_date', logfile_date_current)
			expire_page :controller => 'dashboard', :action => 'statistics', :format => 'js'
		end
	end

	def statistics
		trackers = @r.aggregators.first.trackers

		@logfile_name = LOGFILE_NAME
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

	def logfile_name
	end
	
	def load_report
		@r = RequestLogAnalyzer::Controller.build(
   		:output       => 'FixedWidth',
      :format				=> :rails3,
    	:silent				=> true,
    	:source_files => LOGFILE_NAME
  	)

		# replace @r.run!
  	@r.aggregators.each { |agg| agg.prepare }
    
    @r.source.each_request do |request|
      @r.aggregate_request(@r.filter_request(request))
    
    end
    @r.aggregators.each { |agg| agg.finalize }
	end
end