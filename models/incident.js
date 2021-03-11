var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling


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
      occurrence_date: { type: Date },
      occurrence_time: {type: String, required: true, maxlength: 100},
      primary: {type: Boolean, required: false},
      supplementary: {type: Boolean, required: false}
    }
  );


  IncidentSchema.virtual('report_date_display').get(function () {
    var report_string = '';
    if (this.report_date) {
        report_string = DateTime.fromJSDate(this.report_date).toLocaleString(DateTime.DATE_MED);
        return report_string;
    }
    });

  IncidentSchema.virtual('occurrence_date_display').get(function () {
    var occurrence_string = '';
    if (this.occurrence_date) {
        occurrence_string = DateTime.fromJSDate(this.occurrence_date).toLocaleString(DateTime.DATE_MED);
        return occurrence_string;
    }
    });

  // Virtual for this author instance URL.
IncidentSchema.virtual('url').get(function () {
  return '/data/incident/' + this._id;
});

// Export model.
module.exports = mongoose.model('Incident', IncidentSchema);