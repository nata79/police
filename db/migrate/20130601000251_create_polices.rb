class CreatePolices < ActiveRecord::Migration
  def up
    create_table :polices do |t|
      t.float :latitude
      t.float :longitude
      t.string :type
      t.timestamps
    end
  end

  def down
    drop_table :polices
  end
end
