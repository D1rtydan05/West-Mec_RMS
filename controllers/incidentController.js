const { body,validationResult } = require('express-validator');
var Incident = require('../models/incident');
var Person = require('../models/person');
var Vehicle = require('../models/vehicle');

var async = require('async');

exports.index = function(req, res) {

    async.parallel({
        incident_count: function(callback) {
            Incident.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        person_count: function(callback) {
            Person.countDocuments({}, callback);
        },
        vehicle_count: function(callback) {
            Vehicle.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'RMSDatabase', error: err, data: results });
    });
};

// Display list of all Incidents.
exports.incident_list = function(req, res, next) {

    Incident.find({}, 'ir incident')
      .populate('incident')
      .exec(function (err, list_incidents) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('incident_list', { title: 'Incident List', incident_list: list_incidents });
      });
  
  };

// Display detail page for a specific incident.
exports.incident_detail = function (req, res, next) {

    async.parallel({
        incident: function (callback) {

            Incident.findById(req.params.id)
                .populate('person')
                .populate('vehicle')
                .exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('incident_detail', { title: results.incident.title, incident: results.incident});
    });

};

// Display incident create form on GET.
exports.incident_create_get = function(req, res, next) {

    // Get all persons and vehicles, which we can use for adding to our incident.
    async.parallel({
        persons: function(callback) {
            Person.find(callback);
        },
        vehicles: function(callback) {
            Vehicle.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('incident_form', { title: 'Create Incident', persons: results.persons, vehicles: results.vehicles });
    });

};


// Handle incident create on POST.
exports.incident_create_post = [
    // Convert the vehicle to an array.
    (req, res, next) => {
        if(!(req.body.vehicle instanceof Array)){
            if(typeof req.body.vehicle ==='undefined')
            req.body.vehicle = [];
            else
            req.body.vehicle = new Array(req.body.vehicle);
        }
        next();
    },

    // Validate and sanitise fields.
    body('ir', 'Ir must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('person', 'Person must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('narrative', 'Narrative must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Incident object with escaped and trimmed data.
        var incident = new Incident(
          { ir: req.body.ir,
            location: req.body.location,
            location_name: req.body.location_name,
            radio_code: req.body.radio_code,
            officer: req.body.officer,
            officer_badge: req.body.officer_badge,
            report_date: req.body.report_date,
            report_time: req.body.report_time,
            narrative: req.body.narrative,
            person: req.body.person,
            occurrence_date: req.body.occurrence_date,
            occurrence_time: req.body.occurrence_time,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all persons and vehicles for form.
            async.parallel({
                persons: function(callback) {
                    Person.find(callback);
                },
                vehicles: function(callback) {
                    Vehicle.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected vehicles as checked.
                for (let i = 0; i < results.vehicles.length; i++) {
                    if (incident.vehicle.indexOf(results.vehicles[i]._id) > -1) {
                        results.vehicles[i].checked='true';
                    }
                }
                res.render('incident_form', { title: 'Create Incident',persons:results.persons, vehicles:results.vehicles, incident: incident, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save incident.
            incident.save(function (err) {
                if (err) { return next(err); }
                   //successful - redirect to new incident record.
                   res.redirect(incident.url);
                });
        }
    }
];

// Display incident delete form on GET.
exports.incident_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: incident delete GET');
};

// Handle incident delete on POST.
exports.incident_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: incident delete POST');
};

// Display incident update form on GET.
exports.incident_update_get = function (req, res, next) {

    // Get incident, persons and vehicles for form.
    async.parallel({
        incident: function (callback) {
            Incident.findById(req.params.id).populate('person').populate('vehicle').exec(callback);
        },
        persons: function (callback) {
            Person.find(callback);
        },
        vehicles: function (callback) {
            Vehicle.find(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.incident == null) { // No results.
            var err = new Error('Incident not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        // Mark our selected vehicles as checked.
        for (var all_g_iter = 0; all_g_iter < results.vehicles.length; all_g_iter++) {
            for (var incident_g_iter = 0; incident_g_iter < results.incident.vehicle.length; incident_g_iter++) {
                if (results.vehicles[all_g_iter]._id.toString() === results.incident.vehicle[incident_g_iter]._id.toString()) {
                    results.vehicles[all_g_iter].checked = 'true';
                }
            }
        }
        res.render('incident_form', { title: 'Update Incident', persons: results.persons, vehicles: results.vehicles, incident: results.incident });
    });

};


// Handle incident update on POST.
exports.incident_update_post = [

    // Convert the vehicle to an array.
    (req, res, next) => {
        if (!(req.body.vehicle instanceof Array)) {
            if (typeof req.body.vehicle === 'undefined')
                req.body.vehicle = [];
            else
                req.body.vehicle = new Array(req.body.vehicle);
        }
        next();
    },

    // Validate and santitize fields.
    body('ir', 'Ir must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('person', 'Person must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('narrative', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Incident object with escaped/trimmed data and old id.
        var incident = new Incident(
            { ir: req.body.ir,
              location: req.body.location,
              location_name: req.body.location_name,
              radio_code: req.body.radio_code,
              officer: req.body.officer,
              officer_badge: req.body.officer_badge,
              report_date: req.body.report_date,
              report_time: req.body.report_time,
              narrative: req.body.narrative,
              person: req.body.person,
              _id: req.params.id // This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all persons and vehicles for form
            async.parallel({
                persons: function (callback) {
                    Person.find(callback);
                },
                vehicles: function (callback) {
                    Vehicle.find(callback);
                },
            }, function (err, results) {
                if (err) { return next(err); }

                // Mark our selected vehicles as checked.
                for (let i = 0; i < results.vehicles.length; i++) {
                    if (incident.vehicle.indexOf(results.vehicles[i]._id) > -1) {
                        results.vehicles[i].checked = 'true';
                    }
                }
                res.render('incident_form', { title: 'Update Incident', persons: results.persons, vehicles: results.vehicles, incident: incident, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Incident.findByIdAndUpdate(req.params.id, incident, {}, function (err, theincident) {
                if (err) { return next(err); }
                // Successful - redirect to incident detail page.
                res.redirect(theincident.url);
            });
        }
    }
];