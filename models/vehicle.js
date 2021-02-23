var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var VehicleSchema = new Schema(
    {
      license_plate: {type: String, required: true, maxlength: 100},
      color: { type: String, required: true, enum: ['BGE', 'BLK', 'BLU', 'DBL', 'LBL', 'BRZ', 'BRO', 'GLD', 'GRY', 'GRN', 'MAR', 'ORG', 'PNK', 'PLE', 'RED', 'SIL', 'TAN', 'TRQ', 'WHI', 'YEL', 'TEA', 'UNK'], default: 'UNK' },
      year: { type: Date },
      makes: { type: String, required: true, enum: [  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti", "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Daewoo", "Daihatsu", "Dodge", "Donkervoort", "DS", "Ferrari", "Fiat", "Fisker", "Ford", "Honda", "Hummer", "Hyundai", "Infiniti", "Iveco", "Jaguar", "Jeep", "Kia", "KTM", "Lada", "Lamborghini", "Lancia", "Land Rover", "Landwind", "Lexus", "Lotus", "Maserati", "Maybach", "Mazda", "McLaren", "Mercedes-Benz", "MG", "Mini", "Mitsubishi", "Morgan", "Nissan", "Opel", "Peugeot", "Porsche", "Renault", "Rolls-Royce", "Rover", "Saab", "Seat", "Skoda", "Smart", "SsangYong", "Subaru", "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo"], default: 'UNK' },
      model: {type: String, required: true, maxlength: 100},
      body_type: { type: String, required: true, enum: ['2D', '4D', 'PK', 'VN', 'PC'], default: '2D' },
      vin: {type: String, required: true, maxlength: 17},
      registered_owner: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
      additional_details: {type: String, required: false},
    }
  );

    // Virtual for this author instance URL.
PersonSchema.virtual('url').get(function () {
    return '/data/vehicle/' + this._id;
  });
  
  // Export model.
  module.exports = mongoose.model('vehicle', VehicleSchema);