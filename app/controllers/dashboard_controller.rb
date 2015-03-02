require 'request_log_analyzer'

class DashboardController < ApplicationController
	before_action :load_report, except: [:index]

	def index
		
	end

	def statistics
		trackers = @r.aggregators.first.trackers

		@parsed_requests = @r.source.parsed_requests
		@tracker_http_status = trackers.find { |x| x.title == "HTTP statuses returned" }
		@tracker_timespan = trackers.find { |x| x.title == "Request timespan"}
	end

	private 

	def load_report
		@r = RequestLogAnalyzer::Controller.build(
      :output       => 'FixedWidth',
      :format				=> :rails3,
      :silent				=> true,
      :source_files => '/home/felix/Arbeitsfläche/development.log'
    )
    @r.run!
	end
end