var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VehicleSchema = new Schema(
    {
      license_plate: {type: String, required: true, maxlength: 100},
      color: { type: String, required: true, enum: ['BGE', 'BLK', 'BLU', 'DBL', 'LBL', 'BRZ', 'BRO', 'GLD', 'GRY', 'GRN', 'MAR', 'ORG', 'PNK', 'PLE', 'RED', 'SIL', 'TAN', 'TRQ', 'WHI', 'YEL', 'TEA', 'UNK'], default: 'UNK' },
      year: { type: Date },
      makes: { type: String, required: true},
      model: {type: String, required: true, maxlength: 100},
      body_type: { type: String, required: true, enum: ['2D', '4D', 'PK', 'VN', 'PC'], default: '2D' },
      vin: {type: String, required: true, maxlength: 17},
      person: { type: Schema.Types.ObjectId, ref: 'Person', required: false },
      additional_details: {type: String, required: false},
    }
  );

    // Virtual for this author instance URL.
VehicleSchema.virtual('url').get(function () {
    return '/data/vehicle/' + this._id;
  });
  
  // Export model.
  module.exports = mongoose.model('vehicle', VehicleSchema);