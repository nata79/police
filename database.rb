require 'sinatra'
require 'sinatra/activerecord'
require 'geocoder'

set :database, 'sqlite:///police.db'

class Police < ActiveRecord::Base  
  self.table_name = "polices"
  self.inheritance_column = :_type_disabled
  
  extend Geocoder::Model::ActiveRecord
  reverse_geocoded_by :latitude, :longitude

  attr_accessible :type, :longitude, :latitude

  def self.create_if_uniq params
    if near([params[:latitude], params[:longitude]], 300, units: :m).empty?
      create params
    else      
      true
    end
  end
end
