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
end