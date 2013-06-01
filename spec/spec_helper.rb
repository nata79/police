require File.join(File.dirname(__FILE__), '..', 'police.rb')

require 'sinatra'
require 'rspec'
require 'rack/test'

# setup test environment
set :environment, :test
set :run, false
set :raise_errors, true
set :logging, false

def app
  Sinatra::Application
end

RSpec.configure do |config|
  config.include Rack::Test::Methods

  config.before(:each) do
    Police.create! type: 'stop', latitude: 41.549196, longitude: -8.412406
    Police.create! type: 'stop', latitude: 41.550248, longitude: -8.415958    
    Police.create! type: 'radar', latitude: 41.551982, longitude: -8.411795
    Police.create! type: 'stop', latitude: 41.595822, longitude: -8.408737
  end

  config.after(:each) do
    Police.destroy_all
  end
end