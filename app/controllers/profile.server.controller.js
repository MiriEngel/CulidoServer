// Load the module dependencies
const mongoose = require('mongoose');
const Profile = mongoose.model('Profile');
// const  _ = require('lodash');

// Create a new error handling controller method
const getErrorMessage = function(err) {
    if (err.errors) {
        for (const errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};

// Create a new controller method that creates new Profiles
exports.create = function(req, res) {
    // // Create a new Profile object
    const Profile = new Profile(req.body);

    // Set the Profile's 'creator' property
    Profile.creator = req.user;

    // Try saving the Profile
    Profile.save((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the Profile 
            res.json(Profile);
        }
    });
};

// Create a new controller method that retrieves a list of Profiles
exports.list = function(req, res) {
   
    // Use the model 'find' method to get a list of Profiles
    Profile.find(req.query).sort('-created').populate('creator').exec((err, Profiles) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the Profile 
            res.json(Profiles);
        }
    });
};


// Create a new controller method that returns an existing Profile
exports.read = function(req, res) {
    // res.json(req.Profile);
};

exports.getByUserId = function(req,res){

     Profile.findOne(req.query).sort('-created').exec((err, Profile) => {
        if (err) {
            // If an error occurs send the error message
            // return res.status(400).send({
            //     message: getErrorMessage(err)
            // });
        } else {
            // Send a JSON representation of the Profile 
            res.json(Profile);
        }
    });
}

// Create a new controller method that updates an existing Profile
exports.update = function(req, res) {
    // Get the Profile from the 'request' object
    var Profile = req.Profile;

// Profile.orderDates.push(req.body.orderDates);
// Profile.save(done);

 Profile = _.extend(Profile, req.body);
    // Update the Profile fields
    // Profile.title = req.body.title;
    // Profile.content = req.body.content;

    // Try saving the updated Profile
    Profile.save((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the Profile 
            res.json(Profile);
        }
    });
};


exports.updateOrderDates = function(req,res){
let queryField = { $push: {
                        'myOrderDates': {
                            "articleId":req.body._id,//article
                            "startDate": req.body.orderDates.startDate,
                            "endDate":  req.body.orderDates.endDate,
                            "status":'new',
                            "userId":req.user.id //user who ask to rent
                        }
                    }
                };

//update the user who own the asset
Profile.update({"user": req.body.user},queryField, function (err, Profile) { 
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(Profile);
        }
    });
};

// Create a new controller method that delete an existing Profile
exports.delete = function(req, res) {
    // Get the Profile from the 'request' object
    const Profile = req.Profile;

    // Use the model 'remove' method to delete the Profile
    Profile.remove((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the Profile 
            res.json(Profile);
        }
    });
};

// Create a new controller middleware that retrieves a single existing Profile
exports.profileByID = function(req, res, next, id) {
    // Use the model 'findById' method to find a single Profile 
    Profile.findById(id).populate('creator', 'firstName lastName fullName').exec((err, Profile) => {
        if (err) return next(err);
        if (!Profile) return next(new Error('Failed to load Profile ' + id));

        // If an Profile is found use the 'request' object to pass it to the next middleware
        req.Profile = Profile;

        // Call the next middleware
        next();
    });
};

// Create a new controller middleware that is used to authorize an Profile operation 
exports.hasAuthorization = function(req, res, next) {
    // If the current user is not the creator of the Profile send the appropriate error message
    if (req.Profile.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    // Call the next middleware
    next();
};
