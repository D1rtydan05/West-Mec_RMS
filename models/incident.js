var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var IncidentSchema = new Schema(
    {
      location: {type: String, required: true, maxlength: 100},
      location_name: {type: String, required: true, maxlength: 100},
      code: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
      radio_code: {type: String, required: true, maxlength: 100},
      officer: {type: String, required: true, maxlength: 100},
      officer_badge: {type: String, required: true, maxlength: 100},
      report_date: { type: Date },
      report_time: { type: Date },
      narrative: {type: String, required: true},
    }
  );