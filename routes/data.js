var express = require('express');
var router = express.Router();

// Require controller modules.
var incident_controller = require('../controllers/incidentController');
var person_controller = require('../controllers/personController');
var vehicle_controller = require('../controllers/vehicleController');

/// INCIDENT ROUTES ///

// GET catalog home page.
router.get('/', incident_controller.index);

// GET request for creating a Incident. NOTE This must come before routes that display Incident (uses id).
router.get('/incident/create', incident_controller.incident_create_get);

// POST request for creating Incident.
router.post('/incident/create', incident_controller.incident_create_post);

// GET request to delete Incident.
router.get('/incident/:id/delete', incident_controller.incident_delete_get);

// POST request to delete Incident.
router.post('/incident/:id/delete', incident_controller.incident_delete_post);

// GET request to update Incident.
router.get('/incident/:id/update', incident_controller.incident_update_get);

// POST request to update Incident.
router.post('/incident/:id/update', incident_controller.incident_update_post);

// GET request for one Incident.
router.get('/incident/:id', incident_controller.incident_detail);

// GET request for list of all Incident items.
router.get('/incidents', incident_controller.incident_list);

/// PERSON ROUTES ///

// GET request for creating Person. NOTE This must come before route for id (i.e. display person).
router.get('/person/create', person_controller.person_create_get);

// POST request for creating Person.
router.post('/person/create', person_controller.person_create_post);

// GET request to delete Person.
router.get('/person/:id/delete', person_controller.person_delete_get);

// POST request to delete Person.
router.post('/person/:id/delete', person_controller.person_delete_post);

// GET request to update Person.
router.get('/person/:id/update', person_controller.person_update_get);

// POST request to update Person.
router.post('/person/:id/update', person_controller.person_update_post);

// GET request for one Person.
router.get('/person/:id', person_controller.person_detail);

// GET request for list of all Persons.
router.get('/persons', person_controller.person_list);

/// VEHICLE ROUTES ///

// GET request for creating a Vehicle. NOTE This must come before route that displays Vehicle (uses id).
router.get('/vehicle/create', vehicle_controller.vehicle_create_get);

//POST request for creating Vehicle.
router.post('/vehicle/create', vehicle_controller.vehicle_create_post);

// GET request to delete Vehicle.
router.get('/vehicle/:id/delete', vehicle_controller.vehicle_delete_get);

// POST request to delete Vehicle.
router.post('/vehicle/:id/delete', vehicle_controller.vehicle_delete_post);

// GET request to update Vehicle.
router.get('/vehicle/:id/update', vehicle_controller.vehicle_update_get);

// POST request to update Vehicle.
router.post('/vehicle/:id/update', vehicle_controller.vehicle_update_post);

// GET request for one Vehicle.
router.get('/vehicle/:id', vehicle_controller.vehicle_detail);

// GET request for list of all Vehicle.
router.get('/vehicles', vehicle_controller.vehicle_list);



module.exports = router;