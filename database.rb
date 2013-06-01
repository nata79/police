require 'sinatra'
require 'sinatra/activerecord'
require 'geocoder'

set :database, 'sqlite:///police.db'

class Police < ActiveRecord::Base  
  self.table_name = "polices"
  self.inheritance_column = :_type_disabled
  self.include_root_in_json = false
  
  extend Geocoder::Model::ActiveRecord
  reverse_geocoded_by :latitude, :longitude

  attr_accessible :type, :longitude, :latitude

  def self.create_if_uniq params
    nearby_police = near([params[:latitude], params[:longitude]], 0.3, units: :km)
    if nearby_police.empty?
      create params
    else      
      nearby_police.first
    end
  end

  def self.arround latitude, longitude, radius
    near [latitude, longitude], radius, units: :km
  end

  def to_json
    JSON.dump latitude: latitude, longitude: longitude, type: type
  end
end
