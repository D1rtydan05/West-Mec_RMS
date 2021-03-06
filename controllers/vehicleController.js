const { body,validationResult } = require('express-validator');
var Vehicle = require('../models/vehicle');
var async = require('async');
var Person = require('../models/person');
var Incident = require('../models/incident');

// Display list of all vehicles.
exports.vehicle_list = function(req, res, next) {

    Vehicle.find()
      .exec(function (err, list_vehicles) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('vehicle_list', { title: 'Vehicle List', vehicle_list: list_vehicles });
      });
  
  };

// Display detail page for a specific Vehicle.
exports.vehicle_detail = function(req, res, next) {

    async.parallel({
        vehicle: function(callback) {
            Vehicle.findById(req.params.id)
              .exec(callback);
        },

        person: function(callback) {
          Person.findById(req.params.id)
            .exec(callback);
        },

        vehicle_incidents: function(callback) {
            Incident.find({ 'vehicle': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.vehicle==null) { // No results.
            var err = new Error('Vehicle not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('vehicle_detail', { title: 'Vehicle Detail', vehicle: results.vehicle, vehicle_incidents: results.vehicle_incidents } );
    });

};

// Display vehicle create form on GET.
exports.vehicle_create_get = function(req, res, next) {

  // Get all persons and incidents, which we can use for adding to our incident.
  async.parallel({
      persons: function(callback) {
          Person.find(callback);
      },
      incidents: function(callback) {
          Incident.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('vehicle_form', { title: 'Create Vehicle', persons: results.persons, incidents: results.incidents });
  });

};

// Handle Vehicle create on POST.
exports.vehicle_create_post =  [

  (req, res, next) => {
  if (!(req.body.person instanceof Array)) {
    if (typeof req.body.person === 'undefined')
        req.body.person = [];
    else
        req.body.person = new Array(req.body.person);
}
next();
},
    // Validate and santize the year field.
    //body('VIN', 'VIN required').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a vehicle object with escaped and trimmed data.
      var vehicle = new Vehicle(
        { license_plate: req.body.license_plate,
          color: req.body.color,
          year: req.body.year,
          makes: req.body.makes,
          model: req.body.model,
          body_type: req.body.body_type,
          vin: req.body.vin,
          person: req.body.person,
          additional_details: req.body.additional_details, 
        }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('vehicle_form', { title: 'Create Vehicle', vehicle: vehicle, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Vehicle with same name already exists.
        
             
  
               vehicle.save(function (err) {
                 if (err) { return next(err); }
                 // Vehicle saved. Redirect to vehicle detail page.
                 res.redirect(vehicle.url);
               });
  
             }
  
           
      }
    
  ];

// Display vehicle delete form on GET.
exports.vehicle_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle delete GET');
};

// Handle vehicle delete on POST.
exports.vehicle_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle delete POST');
};

// Display Vehicle update form on GET.
exports.vehicle_update_get = function (req, res, next) {

  Vehicle.findById(req.params.id, function (err, vehicle) {
      if (err) { return next(err); }
      if (vehicle == null) { // No results.
          var err = new Error('Vehicle not found');
          err.status = 404;
          return next(err);
      }
      // Success.
      res.render('vehicle_form', { title: 'Update Vehicle', vehicle: vehicle });
  });

};

// Handle Vehicle update on POST.
exports.vehicle_update_post = [

  // Validate and sanitze the name field.
  //body('vin', 'VIN required').trim().isLength({ min: 1 }).escape(),


  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request .
      const errors = validationResult(req);

      // Create a vehicle object with escaped and trimmed data (and the old id!)
      var vehicle = new Vehicle(
        { license_plate: req.body.license_plate,
          color: req.body.color,
          year: req.body.year,
          makes: req.body.makes,
          model: req.body.model,
          body_type: req.body.body_type,
          vin: req.body.vin,
          person: req.body.person,
          additional_details: req.body.additional_details, 
          _id: req.params.id
          }
      );


      if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values and error messages.
          res.render('vehicle_form', { title: 'Update Vehicle', vehicle: vehicle, errors: errors.array() });
          return;
      }
      else {
          // Data from form is valid. Update the record.
          Vehicle.findByIdAndUpdate(req.params.id, vehicle, {}, function (err, thevehicle) {
              if (err) { return next(err); }
              // Successful - redirect to vehicle detail page.
              res.redirect(thevehicle.url);
          });
      }
  }
];