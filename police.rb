require './database'
require 'json'
require 'geocoder'
require 'pry'

get "/" do
  erb :index
end

get "/police/?" do
  content_type :json
  if params[:latitude] and params[:longitude] and params[:radius]
    Police.arround(params[:latitude], params[:longitude], params[:radius]).to_json
  else
    [].to_json
  end
end

post '/police/?' do
  content_type :json
  if params[:latitude] and params[:longitude] and params[:type]
    Police.create_if_uniq(latitude: params[:latitude], longitude: params[:longitude], type: params[:type]).to_json
  else
    {}.to_json
  end
end

post '/report/?' do
  content_type :json
  if params[:id] and Police.exists? id: params[:id]
    police = Police.find(params[:id])
    police.report
    police.to_json
  else
    {}.to_json
  end
end

post '/refresh/?' do
  content_type :json
  if params[:id] and Police.exists? id: params[:id]
    police = Police.find(params[:id])
    police.refresh
    police.to_json
  else
    {}.to_json
  end
end
