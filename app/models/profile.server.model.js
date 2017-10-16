// Load the module dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'ProfileSchema'
const ProfileSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    name:{
        type:String
    },
    myAssets:{
        type:[Schema.ObjectId],
        ref:'Article'
    },
      myOrders:{
        type:[Schema.ObjectId],
        ref:'Order'
    },
    test:{
        type:[String]
    }
    // myOrderDates: [{
    //     startDate: Date,
    //     endDate: Date,
    //     status:String,
    //     userId:{
    //         type: Schema.ObjectId,
    //         ref: 'User'
    // }
    // }]
});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Profile', ProfileSchema);