// Load the module dependencies
const mongoose = require('mongoose');
const Article = mongoose.model('Article');
const multer = require('multer');
const _ = require('lodash');

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

// Create a new controller method that creates new articles
exports.create = function (req, res) {
    // Create a new article object
    const article = new Article(req.body);

    // Set the article's 'creator' property
    article.creator = req.user;
    article.user = req.user;

    // Try saving the article
    article.save((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {

            sendEmail(article.creator._id,article._id,'new asset','new asset' ),
            // Send a JSON representation of the article 
            res.json(article);
        }
    });
};

exports.listPopOrder = function (req, res) {
    // Use the model 'find' method to get a list of articles
    Article.find(req.query).sort('-created').populate('orders').exec((err, articles) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.json(articles);
        }
    });
};

// Create a new controller method that retrieves a list of articles
exports.list = function (req, res) {

    if (req.query.startDate || req.query.endDate)
        searchByDate(req, res);
    else {
        // Use the model 'find' method to get a list of articles
        Article.find(req.query).sort('-created').populate('creator').exec((err, articles) => {
            if (err) {
                // If an error occurs send the error message
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                // Send a JSON representation of the article 
                res.json(articles);
            }
        });
    }
};

function searchByDate(req, res) {

    var startDate = new Date(req.query.startDate);
    var endDate = new Date(req.query.endDate);

    var query = {};
    if (req.query.city)
        query.city = req.query.city;

    if (req.query.size)
        query.size = req.query.size;

    if (req.query.assetType)
        query.assetType = req.query.assetType;

    Article.find({
        "$and": [query, { "startDate": { "$lte": startDate } }, { "endDate": { "$gte": endDate } },

        ]
    }).populate('orders').exec((err, articles) => {


        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            var result = [];
            articles = articles.filter(function (article) {
                if (article.orders.length) {
                    return !article.orders.some(isInRange);
                }
                else
                    return true;

            });
            res.json(articles);
        }

        function isInRange(element, index, array) {
            return (element.startDate >= startDate && element.endDate <= endDate) && element.status == 'ok' ||
                (element.startDate <= startDate && element.endDate >= startDate) && element.status == 'ok' ||
                (element.startDate <= endDate && element.endDate >= endDate) && element.status == 'ok'

        }
    });


            // {
            //     "orders":
            //     {
            //         "$not":
            //         {
            //             "$elemMatch":
            //             {
            //                 "$or":
            //                 [{ "Order.startDate": { $gte: startDate }, "Order.endDate": { $lt: endDate } },
            //                 { "Order.startDate": { $lte: startDate }, "Order.endDate": { $gte: startDate } },
            //                 { "Order.startDate": { $lte: endDate }, "Order.endDate": { $gte: endDate } }]
            //             }
            //         }
            //     }
            // }
}




// Create a new controller method that returns an existing article
exports.read = function (req, res) {
    res.json(req.article);
};

// Create a new controller method that updates an existing article
exports.update = function (req, res) {
    // Get the article from the 'request' object
    var article = req.article;

    // Article.orderDates.push(req.body.orderDates);
    // Article.save(done);

    article = _.extend(article, req.body);
    // Update the article fields
    // article.title = req.body.title;
    // article.content = req.body.content;

    // Try saving the updated article
    article.save((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.json(article);
        }
    });
};

exports.insertOrderDates = function (req, res) {
    let queryField = {
        $push: {
            'orderDates': {
                "startDate": req.body.orderDates.startDate,
                "endDate": req.body.orderDates.endDate,
                "status": 'new',
                "userId": req.user.id //user who ask to rent
            }
        }
    };

    //update the user who own the asset
    Article.update({ "_id": req.body._id }, queryField, function (err, article) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(article);
        }
    });
};



exports.updateOrderStatus = function (req, res) {
    //update the user who own the asset
    Article.update({ "_id": req.query.articleId, "orderDates._id": req.query.orderId }, {
        '$set': {
            'orderDates.$.status': req.query.status
        }
    }, function (err, article) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            res.json(article);
        }
    });

}
// exports.updateOrderDates = function(req,res){
// let queryField = { $push: {
//                         'orderDates': {
//                             "startDate": req.body.orderDates.startDate,
//                             "endDate":  req.body.orderDates.endDate,
//                         }
//                     }
//                 };


// Article.update({"_id": req.body._id},queryField, function (err, article) {
//         if (err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err)
//             });
//         }
//         else {
//             res.json(article);
//         }
//     });
// };

// Create a new controller method that delete an existing article
exports.delete = function (req, res) {
    // Get the article from the 'request' object
    const article = req.article;

    // Use the model 'remove' method to delete the article
    article.remove((err) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            // Send a JSON representation of the article 
            res.json(article);
        }
    });
};

// Create a new controller middleware that retrieves a single existing article
exports.articleByID = function (req, res, next, id) {
    // Use the model 'findById' method to find a single article 
    Article.findById(id).populate('creator', 'firstName lastName fullName').exec((err, article) => {
        if (err) return next(err);
        if (!article) return next(new Error('Failed to load article ' + id));

        // If an article is found use the 'request' object to pass it to the next middleware
        req.article = article;

        // Call the next middleware
        next();
    });
};

// Create a new controller middleware that is used to authorize an article operation 
exports.hasAuthorization = function (req, res, next) {
    // If the current user is not the creator of the article send the appropriate error message
    if (req.article.creator.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }

    // Call the next middleware
    next();
};

exports.uploadArticlePicture = function (req, res) {

    var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, 'public/uploads');
        },
        filename: function (req, file, callback) {
            console.log(file);
            callback(null, file.originalname)
        }
    });
    var message = null;
    var upload = multer({ storage: storage }).array('file', 5);

    //   var upload = multer(config.uploads.productUpload).single('newProductPicture');
    //   var productUploadFileFilter = require(path.resolve('./config/lib/multer')).productUploadFileFilter;
    var dest = 'public/uploads';


    //   // Filtering to upload only images
    //   upload.fileFilter = productUploadFileFilter;

    //do shit
    upload(req, res, function (uploadError) {

        if (uploadError) {
            return res.status(400).send({
                message: 'Error occurred while uploading product picture :' + uploadError.message
            });
        } else {
            res.json(res.req.files[0].path);

        }

    });
};

function sendEmail(userIdOwn,articleId,msg,title ){
         var mailOptions = {
        to: 'popapp.place@gmail.com',
        from: config.mailer.from,
        subject: title,
        html: msg + ' idown:' + userIdOwn +'            link:   https://popapp.place/articles/'+articleId
      };
      smtpTransport.sendMail(mailOptions, function (err) {
        if (!err) {
      
        } else {
    
        }

      
      });
 
}
