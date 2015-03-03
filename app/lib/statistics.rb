class Statistics
	attr_reader :filename, :analyzer, :trackers

	def initialize(filename)
		@filename = filename
	end

	def parsed_request_count
		analyze unless analyzer != nil

		analyzer.source.parsed_requests
	end
	
	def parsed_timespan
		analyze unless analyzer != nil

		trackers.find{|x| x.title == 'Request timespan'}
	end

	def http_status_codes
		analyze unless analyzer != nil
		
		trackers.find{|x| x.title == 'HTTP statuses returned'}.categories
	end
	
	def http_methods
		trackers.find{ |x| x.title == 'HTTP methods'}.categories
	end
	
	def request_details
		analyze unless analyzer != nil

		get_details_from_categories(trackers.find{ |x| x.title == 'Request duration'}.categories)
	end

	def database_time
		analyze unless analyzer != nil

		get_details_from_categories(trackers.find{ |x| x.title == 'Database time'}.categories)
	end

	def view_time
		analyze unless analyzer != nil

		get_details_from_categories(trackers.find{ |x| x.title == 'View rendering time'}.categories)
	end

	def partials_time
		analyze unless analyzer != nil

		get_details_from_categories(trackers.find{|x| x.title == 'Partials rendering time'}.categories)
	end

	def process_blockers
		trackers.find{ |x| x.title == 'Process blockers (> 1 sec duration)'}.categories
	end
	
	private

	def analyze
		raise ArgumentError, 'File not found' unless File.exists?(filename)

		@analyzer = RequestLogAnalyzer::Controller.build(
   		:output       => 'FixedWidth',
      :format				=> :rails3,
    	:silent				=> true,
    	:source_files => filename
  	)

		# replace analyzer.run!
  	analyzer.aggregators.each { |agg| agg.prepare }
    
    analyzer.source.each_request do |request|
      analyzer.aggregate_request(analyzer.filter_request(request))
    
    end
    analyzer.aggregators.each { |agg| agg.finalize }
	
    @trackers = analyzer.aggregators.first.trackers
	end

	def get_details_from_categories(categories)
		tracker_result = []

		categories.each do |route, details|
			tracker_result << {
				route: 	route,
				hits: 	details[:hits],
				sum: 		details[:sum],
				mean: 	details[:mean],
				min: 		details[:min],
				max: 	  details[:max]
			}
		end

		tracker_result
	end
end