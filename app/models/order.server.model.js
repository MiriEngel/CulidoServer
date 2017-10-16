// Load the module dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
const OrderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    startDate: {
        type:  Date
    },
    endDate:{
        type: Date
    },
    status:{
        type:String
    },
    userIdRequest:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    userIdOwnAsset:{
        type: Schema.ObjectId,
        ref: 'User'
    },
    content:{
        type:String
    },
    phone:{
        type:String
    },
    articleId:{
          type: Schema.ObjectId,
        ref: 'Article'
    }

});

mongoose.model('Order', OrderSchema);