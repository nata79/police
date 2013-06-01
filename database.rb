require 'sinatra'
require 'sinatra/activerecord'

set :database, 'sqlite:///police.db'

class Police < ActiveRecord::Base
  self.table_name = "polices"
end
