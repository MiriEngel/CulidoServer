// Load the module dependencies
const mongoose = require('mongoose');
const Order = mongoose.model('Order');
const Profile = mongoose.model('Profile');

var  ObjectId = mongoose.Schema.Types.ObjectId;

// Create a new controller method that creates new Profiles
exports.create = function(req, res) {
    // // Create a new Profile object
    let newOrder = new Order();
   


    newOrder.creator = req.user;
    newOrder.userIdRequest = req.user;
    newOrder.userIdOwnAsset = req.body.creator._id;
    newOrder.status = 'new';
    newOrder.articleId = req.body._id;
    newOrder.startDate = req.body.orderDates.startDate;
    newOrder.endDate = req.body.orderDates.endDate;
    newOrder.phone = req.body.orderPhone;
    newOrder.content = req.body.orderContent;


   
    // Try saving the Profile
    newOrder.save((err,order) => {
        if (err) {
            // If an error occurs send the error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
              
               updateProfileOrder(newOrder._id,req.user);// user that invite the assets
              updateArticleOrder(newOrder._id,newOrder.articleId)
          
             res.json(order);
        }
    });
};


function updateProfileOrder(orderId,userId){

let queryField = { $push: {'myOrders': orderId}};

Profile.update({"user": userId},queryField, function (err, Profile) { 
        if (err) {
            // return res.status(400).send({
            //     message: getErrorMessage(err)
            // });
        }
        else {
            // res.json(Profile);
        }
    });
};

function updateArticleOrder(orderId,articleId){

let queryField = { $push: {'orders': orderId}};

mongoose.model('Article').update({"_id": articleId},queryField, function (err, Profile) { 
        if (err) {
            // return res.status(400).send({
            //     message: getErrorMessage(err)
            // });
        }
        else {
            // res.json(Profile);
        }
    });
};




exports.updateOrderStatus = function(req,res){
//update the user who own the asset
Order.update({"_id": req.query.orderId}, {'$set': {
   'status': req.query.status
}}, function (err, ord) { 
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
        saveDatesOrderInArticle(req.query.articleId,req.query.startDate,req.query.endDate,req.query.status);
               
            res.json(ord);
        }
    });

}

function saveDatesOrderInArticle(articleId,startDate,endDate,status){

let queryField = status=='ok'? { $push: {'orderDates': {"startDate":startDate ,"endDate":endDate}}}:{ $pull: {'orderDates': {"startDate":startDate ,"endDate":endDate}}};

mongoose.model('Article').update({"_id": articleId},queryField, function (err, Profile) { 
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            // res.json(Profile);
        }
    });

}


exports.list = function(req, res) {
   
    // Use the model 'find' method to get a list of articles
    Order.find(req.query).sort('-created').populate('articleId').exec((err, articles) => {
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
// exports.updateOrderDates = function(req,res){
// let queryField = { $push: {
//                         'myOrderDates': {
//                             "articleId":req.body._id,//article
//                             "startDate": req.body.orderDates.startDate,
//                             "endDate":  req.body.orderDates.endDate,
//                             "status":'new',
//                             "userId":req.user.id //user who ask to rent
//                         }
//                     }
//                 };

// //update the user who own the asset
// Profile.update({"user": req.body.user},queryField, function (err, Profile) { 
//         if (err) {
//             return res.status(400).send({
//                 message: getErrorMessage(err)
//             });
//         }
//         else {
//             res.json(Profile);
//         }
//     });
// };