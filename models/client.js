const mongoose = require('mongoose');
const joi = require ('joi')

clientSchema = new mongoose.Schema({
    name :{
        type: String, required:true, lowercase:true
    },
    adress :{
        type: String, required:true, lowercase:true
    },
    phone :{
        type: String, required:true, lowercase:true
    },
    email:{
        type: String, required :true
    },
    password:{
        type:String, required:true,minlength:8
    },
    orders:[
        {
            type:mongoose.Schema.Types.ObjectId,
        ref:'order'
        }
    ]
})
//client model
const Client = mongoose.model('client',clientSchema);
function validateClient (client){

    const schema = {
        name:joi.string().required(),
        phone:joi.string().required().min(7),
        adress:joi.string().required(),
        email:joi.required().string().min(8)
    };
    return joi.validate(client,schema); 
}
exports.Client =Client;
exports.validateClient=validateClient;