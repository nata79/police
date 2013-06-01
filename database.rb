require 'sinatra'
require 'sinatra/activerecord'
require 'delayed_job_active_record'
require 'geocoder'

set :database, 'sqlite:///police.db'

class Police < ActiveRecord::Base  
  self.table_name = "polices"
  self.inheritance_column = :_type_disabled
  self.include_root_in_json = false
  
  extend Geocoder::Model::ActiveRecord
  reverse_geocoded_by :latitude, :longitude

  attr_accessible :type, :longitude, :latitude

  after_create :remove_check

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

  def refresh
    self.updated_at = Time.now
    save
    remove_check
  end

  def report
    self.updated_at = self.updated_at - 15.minutes
    save
    remove_check
  end
private
  def remove_check
    if updated_at + 2.hours <= Time.now
      destroy
    end
  end
  handle_asynchronously :remove_check, :run_at => Proc.new { |p| p.updated_at + 2.hours }
end
