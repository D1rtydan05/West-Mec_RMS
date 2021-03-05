var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IncidentSchema = new Schema(
    {
      ir: {type: String, required: true, maxlength: 12},
      location: {type: String, required: true, maxlength: 100},
      location_name: {type: String, required: true, maxlength: 100},
      radio_code: {type: String, required: true, maxlength: 100},
      officer: {type: String, required: true, maxlength: 100},
      officer_badge: {type: String, required: true, maxlength: 100},
      report_date: { type: Date },
      report_time: {type: String, required: true, maxlength: 20},
      narrative: {type: String, required: true},
      person: { type: Schema.Types.ObjectId, ref: 'Person', required: false },
      report_date: { type: Date },
      report_time: {type: String, required: true, maxlength: 100},
    }
  );


  
  // Virtual for this author instance URL.
IncidentSchema.virtual('url').get(function () {
  return '/data/incident/' + this._id;
});

// Export model.
module.exports = mongoose.model('Incident', IncidentSchema);