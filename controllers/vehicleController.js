var vehicle = require('../models/vehicle');

// Display list of all vehicles.
exports.vehicle_list = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle list');
};

// Display detail page for a specific vehicle.
exports.vehicle_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle detail: ' + req.params.id);
};

// Display vehicle create form on GET.
exports.vehicle_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle create GET');
};

// Handle vehicle create on POST.
exports.vehicle_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle create POST');
};

// Display vehicle delete form on GET.
exports.vehicle_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle delete GET');
};

// Handle vehicle delete on POST.
exports.vehicle_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle delete POST');
};

// Display vehicle update form on GET.
exports.vehicle_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle update GET');
};

// Handle vehicle update on POST.
exports.vehicle_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: vehicle update POST');
};