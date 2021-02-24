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

    Incident.find({}, 'title incident')
      .populate('incident')
      .exec(function (err, list_incidents) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('incident_list', { title: 'Incident List', incident_list: list_incidents });
      });
  
  };

// Display detail page for a specific incident.
exports.incident_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: incident detail: ' + req.params.id);
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
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('person', 'Person must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('narrative', 'Narrative must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('vehicle.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Incident object with escaped and trimmed data.
        var incident = new Incident(
          { title: req.body.title,
            person: req.body.person,
            narrative: req.body.narrative,
            vehicle: req.body.vehicle
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
exports.incident_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: incident update GET');
};

// Handle incident update on POST.
exports.incident_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: incident update POST');
};