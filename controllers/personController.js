const { body,validationResult } = require('express-validator');

var Person = require('../models/person');

// Display list of all persons.
exports.person_list = function(req, res, next) {

    Person.find()
      .exec(function (err, list_persons) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('person_list', { title: 'Person List', person_list: list_persons });
      });
  
  };

// Display detail page for a specific person.
exports.person_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Person detail: ' + req.params.id);
};

// // Display person create form on GET.
// exports.person_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: Person create GET');
// };
// Display Person create form on GET.
exports.person_create_get = function(req, res, next) {
    res.render('person_form', { title: 'Create Person'});
};

// // Handle person create on POST.
// exports.person_create_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: Person create POST');
// };
// Handle Person create on POST.
exports.person_create_post = [

    // Validate and sanitise fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('person_form', { title: 'Create person', person: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Create an person object with escaped and trimmed data.
            var person = new person(
                {
                    first_name: req.body.first_name,
                    family_name: req.body.family_name,
                    date_of_birth: req.body.date_of_birth,
                    date_of_death: req.body.date_of_death
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

// Display person update form on GET.
exports.person_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Person update GET');
};

// Handle person update on POST.
exports.person_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Person update POST');
};


// ========================================================================================================================



