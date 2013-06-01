require './database'
require 'json'

get "/police/?" do
  content_type :json
  Police.all.to_json
end

post '/police/?' do
  'hello world!'
end
