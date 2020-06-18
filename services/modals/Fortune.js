const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Fortune = new Schema({
    fullName:{
        type:String
    },
    job:{
        type:String
    },
    fortuneType:{
        type:Number,
        default:0,
    },
    fortuneType:{
        type:Number,
        default:0,
    },
    gender:{
        type:String
    },
    birthday:{
        type:String
    },
    fortunePhoto:{
        type:String,
    },
    fortuneAnswerTitle:{
        type:String,
    },
    fortuneAnswer:{
        type:String,
    },
    fortuneComment:{
        type:String,
    },
    commentCreated:{
        type:Date,
    },
    fortuneRating:{
        type:Number,
        default:0,
    },
    fortuneUser:{
        type: mongoose.Types.ObjectId
    },
    userFullName:{
        type:String,
    },
    userTelephone:{
        type:String,
    },
    fortuneCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('Fortune', Fortune);
