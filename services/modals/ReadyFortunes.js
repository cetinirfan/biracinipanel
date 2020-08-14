const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReadyFortune = new Schema({
    readyFortuneDescription:{
        type:String
    },
    readyFortune:{
        type:String
    },
    readyFortuneCreated:{
        type:Date,
        default:Date.now()
    }
});

module.exports = mongoose.model('ReadyFortune', ReadyFortune);
