const { body,validationResult } = require('express-validator');
var async = require('async');

var Person = require('../models/person');
var Incident = require('../models/incident');

// Display list of all persons.
exports.person_list = function(req, res, next) {

    Person.find()
      .exec(function (err, list_persons) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('person_list', { title: 'Person List', person_list: list_persons });
      });
  
  };

// Display detail page for a specific Person.
exports.person_detail = function(req, res, next) {

    async.parallel({
        person: function(callback) {
            Person.findById(req.params.id)
              .exec(callback)
        },
        persons_incidents: function(callback) {
          Incident.find({ 'person': req.params.id },'title summary')
          .exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.person==null) { // No results.
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('person_detail', { title: 'Person Detail', person: results.person, person_incidents: results.persons_incidents } );
    });

};

// Display Person create form on GET.
exports.person_create_get = function(req, res, next) {
    res.render('person_form', { title: 'Create Person'});
};

// Handle Person create on POST.
exports.person_create_post = [

    // Validate and sanitize fields.
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.'),
        //.isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
        //.isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_name').trim().isLength({ min: 1 }).escape().withMessage('Middle name/initial must be specified.'),
    //.isAlphanumeric().withMessage('Middle name/initial has non-alphanumeric characters.'),
    body('hazard').toBoolean(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('person_form', { title: 'Create Person', person: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an Person object with escaped and trimmed data.
            var person = new Person(
                {
                    last_name: req.body.last_name,
                    first_name: req.body.first_name,
                    middle_name: req.body.middle_name,
                    aliases: req.body.aliases,
                    code: req.body.code,
                    social_security_number: req.body.social_security_number,
                    date_of_birth: req.body.date_of_birth,
                    race: req.body.race,
                    sex: req.body.sex,
                    height: req.body.height,
                    weight: req.body.weight,
                    eyes: req.body.eyes,
                    hair: req.body.hair,
                    scars_marks_tattoos: req.body.scars_marks_tattoos,
                    address: req.body.address,
                    phone_number: req.body.phone_number,
                    gang_affiliation: req.body.gang_affiliation,
                    hazard: req.body.hazard,
                });
            person.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new person record.
                res.redirect(person.url);
            });
        }
    }
];

// Display person delete form on GET.
exports.person_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Person delete GET');
};

// Handle person delete on POST.
exports.person_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Person delete POST');
};

// Display Person update form on GET.
exports.person_update_get = function (req, res, next) {

    Person.findById(req.params.id, function (err, person) {
        if (err) { return next(err); }
        if (person == null) { // No results.
            var err = new Error('Person not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('person_form', { title: 'Update Person', person: person });

    });
};

// Handle Person update on POST.
exports.person_update_post = [

    // Validate and sanitize fields.
    body('last_name').trim().isLength({ min: 1 }).escape().withMessage('Last name must be specified.'),
        //.isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.'),
        //.isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('middle_name').trim().isLength({ min: 1 }).escape().withMessage('Middle name/initial must be specified.'),
    //.isAlphanumeric().withMessage('Middle name/initial has non-alphanumeric characters.'),
    body('hazard').toBoolean(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Person object with escaped and trimmed data (and the old id!)
        var person = new Person(
            {
                last_name: req.body.last_name,
                first_name: req.body.first_name,
                middle_name: req.body.middle_name,
                aliases: req.body.aliases,
                code: req.body.code,
                social_security_number: req.body.social_security_number,
                date_of_birth: req.body.date_of_birth,
                race: req.body.race,
                sex: req.body.sex,
                height: req.body.height,
                weight: req.body.weight,
                eyes: req.body.eyes,
                hair: req.body.hair,
                scars_marks_tattoos: req.body.scars_marks_tattoos,
                address: req.body.address,
                phone_number: req.body.phone_number,
                gang_affiliation: req.body.gang_affiliation,
                hazard: req.body.hazard,
                _id: req.params.id
            });

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('person_form', { title: 'Update Person', person: person, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Person.findByIdAndUpdate(req.params.id, person, {}, function (err, theperson) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theperson.url);
            });
        }
    }
];
