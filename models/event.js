const mongoose = require('mongoose');
const joi = require ('joi')

EventsSchema = new mongoose.Schema({
    name :{
        type: String, required:true, lowercase:true
    },
    adress :{
        type: String, required:true, lowercase:true
    },
    date:{
        type:Date
    },
    users:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User"
    }

    
})
//Events model
const Events = mongoose.model('Events',EventsSchema);
function validateEvents (Events){

    const schema = {
        name:joi.string().required(),
        phone:joi.string().required().min(7),
        adress:joi.string().required(),
        email:joi.required().string().min(8).email(),
        password:joi.string().required().min(8),
        role:joi.string().required().valid("admin","Events")
    };
    return joi.validate(Events,schema); 
}
exports.Events =Events;
exports.validateEvents=validateEvents;