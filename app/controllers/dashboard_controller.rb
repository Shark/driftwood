class DashboardController < ApplicationController
	before_action :load_report

	def index
		@trackers = @r.aggregators.first.trackers
	end

	def statistics
		trackers = @r.aggregators.first.trackers

		@tracker_http_status = trackers.find { |x| x.title == "HTTP statuses returned" }
		@tracker_http_methods = trackers.find{ |x| x.title == "HTTP methods"}
	end

	private 

	def load_report
		@r = RequestLogAnalyzer::Controller.build(
      :output       => 'FixedWidth',
      :format				=> :rails3,
      :silent				=> true,
      :source_files => '/home/gerrit/dev/development_small.log'
    )
    @r.run!
	end
end