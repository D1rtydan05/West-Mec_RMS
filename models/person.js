var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonSchema = new Schema(
    {
      last_name: {type: String, required: true, maxlength: 100},
      first_name: {type: String, required: true, maxlength: 100},
      middle_name: {type: String, required: true, maxlength: 100},
      aliases: {type: String, required: true, maxlength: 100},
      code: { type: String, required: true, enum: ['RP1', 'W', 'V', 'IL4', 'S2'], default: 'W' },
      social_security_number: {type: Number, required: true, minlength: 9, maxlength: 9},
      date_of_birth: { type: Date },
      race: { type: String, required: true, enum: ['W', 'B', 'H', 'I', 'A', 'U'], default: 'U' },
      sex: { type: String, required: true, enum: ['M', 'F', 'U'], default: 'U' },
      height: {type: String, required: true, maxlength: 100},
      weight: {type: String, required: true, maxlength: 100},
      eyes: { type: String, required: true, enum: ['BLK', 'BLU', 'BRO', 'GRY', 'GRN', 'WHI', 'HAZ', 'RED'], default: 'BRO' },
      hair: { type: String, required: true, enum: ['BLK', 'BLU', 'BRO', 'GRY', 'GRN', 'WHI', 'BLD', 'BLN', 'HAZ', 'RED'], default: 'BLD' },
      scars_marks_tattoos: {type: String, required: true, maxlength: 100},
      address: {type: String, required: true, maxlength: 100},
      phone_number: {type: String, required: true, maxlength: 100},
      gang_affiliation: {type: String, required: false, maxlength: 100},
      hazard: {type: Boolean, default: false}
    }
  );

    // Virtual for person "full" name.
    PersonSchema.virtual('name').get(function () {
      return this.last_name + ', ' + this.first_name + ' ' + this.middle_name;
    });

    // Virtual for this person instance URL.
PersonSchema.virtual('url').get(function () {
    return '/data/person/' + this._id;
  });
  
  // Export model.
  module.exports = mongoose.model('Person', PersonSchema);