require 'sprockets'
require './police'

map '/assets' do
  environment = Sprockets::Environment.new
  environment.append_path 'assets/templates'
  environment.append_path 'assets/javascripts'
  environment.append_path 'assets/stylesheets'
  environment.append_path 'assets/images'
  run environment
end

map '/' do
  run Sinatra::Application
end
