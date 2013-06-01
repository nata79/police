require 'spec_helper'

describe "Police App" do
  it 'should respond to GET /police' do
    get '/police'
    last_response.should be_ok
  end

  it 'should respond to POST /police' do
    post '/police'
    last_response.should be_ok
  end

  describe 'GET /police' do
    it 'should return an empty list if there are no params' do
      get '/police'
      JSON.parse(last_response.body).size.should eq 0
    end

    it 'should return a list of police if coords and radius provided' do
      get '/police', latitude: 41.549196, longitude: -8.412406, radius: 3
      JSON.parse(last_response.body).size.should eq 3
    end
  end

  describe 'POST /police' do
    it 'should return an empty object if there are no params' do
      post '/police'
      JSON.parse(last_response.body).should eq({})
    end

    it 'should return a police object if coords and type provided' do
      params = {'latitude' => 41.549196, 'longitude' => -8.412406, 'type' => 'stop'}
      post '/police', params
      JSON.parse(last_response.body).should eq params
    end
  end
end