// Load the module dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const NotificationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    userIdRequest: {
        type : Schema.ObjectId,
        ref: 'User'
    },
       userIdOwn: {
        type : Schema.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    msg: {
        type: String,
        trim: true,
        default: ''
    },
    isNewNotification:{
        type:Boolean,
        default:true
    },
    articleId:{
         type : Schema.ObjectId,
        ref: 'Article'
    },
    orderId:{
         type : Schema.ObjectId,
        ref: 'Order'
    },
    typeNotification:{
        type:Number //1 = new request and 2 = approve or reject request
    }
});

mongoose.model('Notification', NotificationSchema);