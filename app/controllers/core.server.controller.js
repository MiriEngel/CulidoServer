// Load the module dependencies
const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
 var nodemailer = require('nodemailer');
  const path = require('path');
   config = require(path.resolve('./config/config'));


 var smtpTransport = nodemailer.createTransport(config.mailer.options);



// Create a new error handling controller method
const getErrorMessage = function (err) {
    if (err.errors) {
        for (const errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};


exports.getTopNotificationByUserId = function (req, res) {

   let listCnt =  Number(req.params && req.params.cnt?req.params.cnt:10);

        Notification.find(req.query).sort('-created').limit(listCnt).exec((err, notifications) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.json(notifications);
        }
    });

}

// Create a new controller middleware that retrieves a single existing article
exports.getNotificationById = function (req, res) {

    Notification.findById({_id:req.params.notificationId}).exec((err, notification) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.json(notification);
        }
    });
};

// update notification status if the user read it
exports.updateIsNewNotification = function (req, res) {


 Notification.update({ _id:  req.body._id },
    { $set: { isNewNotification: false } }, function(err,data){
        return  res.json(data);
    });
};

exports.sendMail = function (req, res, next) {

      var mailOptions = {
        to: req.query.email,
        from: config.mailer.from,
        subject: 'info Msg',
        html: req.query.emailHTML
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
          res.send({
            message: 'SentMailSuccess'
          });
        } else {
          return res.status(400).send({
            message: 'SentMailFailed'
          });
        }

      
      });
 

};