const mongoose = require('mongoose');
const joi = require ('joi')
joi.ObjectId= require('joi-objectid').ObjectId

EventsSchema = new mongoose.Schema({
    name :{
        type: String, required:true, lowercase:true
    },
    adress :{
        type: String, required:true, lowercase:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    users:[
      { type:mongoose.Schema.Types.ObjectId , ref:'User'}
    ],
    RSVP:[{Userid:String, status:Boolean}]
    
})
//Events model
const Events = mongoose.model('Events',EventsSchema);
function validateEvents (Events){

    const schema = {
        name:joi.string().required(),
        adress:joi.string().required(),
        date : joi.date()

    };
    return joi.validate(Events,schema); 
}
exports.Events =Events;
exports.validateEvents=validateEvents;