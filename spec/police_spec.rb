require 'spec_helper'

describe Police do
  it 'returns a list of police with a center and a radius' do
    Police.arround(41.549003, -8.413168, 3).size.should eq 3
  end

  it 'doesnt create other police if there is other in a 300m radius' do
    count = Police.count
    Police.create_if_uniq type: 'stop', latitude: 41.549003, longitude: -8.413168
    Police.count.should eq count
  end


  it 'creates other police if there is not other in a 300m radius' do
    count = Police.count
    Police.create_if_uniq type: 'stop', latitude: 0, longitude: 0
    Police.count.should eq (count + 1)
  end
end