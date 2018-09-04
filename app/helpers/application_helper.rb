module ApplicationHelper

  def get_data(data_type='BusStops')
    data = []
    data_file = "public/#{data_type}_all.json"

    if File.exist? data_file
      data = JSON.parse(File.read(data_file))
    else
      offset = 0

      loop do
        result = get_data_from_api(data_type, offset)
        data += result
        break if result.length < 500
        offset += 500
      end

      File.open(data_file,"w") do |f|
        f.write(data.to_json)
        p "#{data_file} downloaded"
      end
    end

    data
  end

  def get_data_from_api(data_type='BusStops', offset=0)
    url = URI("http://datamall2.mytransport.sg/ltaodataservice/#{data_type}?$skip=#{offset}")

    http = Net::HTTP.new(url.host, url.port)

    request = Net::HTTP::Get.new(url)
    request["AccountKey"] = ENV['DATAMALL_KEY']
    request["accept"] = 'application/json'
    # request["Authorization"] = 'Bearer AAAAAAAAAAAAAAAAAAAAAEMALAAAAAAApCSCNq6dqEuCeSVr9l9mh7yGeAQ%3DV8xOltRxERzzvv14h7qkR4muDZ6qFJICAfvcYHAQRUwd8INBoS'
    request["Cache-Control"] = 'no-cache'
    # request["Postman-Token"] = 'dec6dd3e-32a7-404a-8ec7-17b6998627bb'

    response = http.request(request)
    result = JSON.parse response.read_body
    result['value']
  end

  def write_stops_geojson
    stops = get_data('BusStops')
    routes = get_data('BusRoutes')
    stop_services = routes.group_by {|r| r['BusStopCode'] }

    entity_factory = RGeo::GeoJSON::EntityFactory.instance
    factory = RGeo::Geographic.simple_mercator_factory

    result = stops.map.with_index do |s, i|
      stop_code = s['BusStopCode']
      s['BusServices'] = stop_services[stop_code].map {|c| c['ServiceNo']}.uniq.sort_by(&:to_i)
      entity_factory.feature(factory.point(s['Longitude'], s['Latitude']), s['BusStopCode'], s)
    end

    geojson_file = "public/busstops_all.geojson"
    File.open(geojson_file,"w") do |f|
      json = RGeo::GeoJSON.encode(entity_factory.feature_collection(result)).to_json
      f.write(json)
    end

    result
  end

  def onemap_publicapi_token
    Rails.cache.fetch('onemap_public_token') do
      response = JSON.parse open("https://developers.onemap.sg/publicapi/publicsessionid").read
      token = response["access_token"]
      expiry_time = response["expiry_timestamp"].to_i - Time.now.to_i
      Rails.cache.write('onemap_public_token', token, expires_in: expiry_time)
      token
    end
  end
end
