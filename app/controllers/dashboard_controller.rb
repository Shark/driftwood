require 'request_log_analyzer'

class DashboardController < ApplicationController
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
		@statistics = Statistics.new(LOGFILE_NAME)
	end
end