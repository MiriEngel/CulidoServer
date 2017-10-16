// Load the module dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a new 'ArticleSchema'
const ArticleSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true,
        required: 'Title cannot be blank'
    },
    content: {
        type: String,
        default: '',
        trim: true
    },
    location: {						//GPS
		type: [Number],
		index: '2dsphere',		
		default: []
	},	
    address: {				//location as address
		type: String,				
		default: ''
	},	
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    imgUrl:{
        type: [String],
        default: '',
        trim: true
    },
       tags:{
        type: [String],
        default: 'POP UP',
        trim: true
    },
    assetType:{
        type: String,
         default: 'Shop',
        trim: true
    },
     amenities:{
        type: [String],
        default: '',
        trim: true
    },
    city:{
        type: String,
        trim: true
    },
      street:{
        type: String,
        trim: true
    },
         streetNumber:{
        type: Number,
        default:0
    },
          country:{
        type: String,
        trim: true
    },
   price: {
    day: {
      type: Number,
      default: 0
    },
    week: {
      type: Number,
      default: 0
    },
    month: {
      type: Number,
      default: 0
    }
   },
    currencyType:{
        type: String,
      default: false
    },
    size:{
        type:Number,
        default: 1
    },
      startDate: {
        type: Date,
        default: Date.now
    },
     endDate: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String,
    },
    amenitiesDetails:{
        type: String
    },
    orders:[{
        type:Schema.ObjectId,
        ref:'Order'
    }],
    orderDates: [{
        startDate: Date,
        endDate: Date,
    }]
});

ArticleSchema.index({location:1});

// Create the 'Article' model out of the 'ArticleSchema'
mongoose.model('Article', ArticleSchema);