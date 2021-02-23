var incident = require('../models/incident');


exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all incidents.
exports.incident_list = function(req, res) {
    res.send('NOT IMPLEMENTED: incident list');
};

// Display detail page for a specific incident.
exports.incident_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: incident detail: ' + req.params.id);
};

// Display incident create form on GET.
exports.incident_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: incident create GET');
};

// Handle incident create on POST.
exports.incident_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: incident create POST');
};

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