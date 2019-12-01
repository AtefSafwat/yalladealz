const mongoose = require('mongoose');
const joi = require ('joi')

UserSchema = new mongoose.Schema({
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
        type: String, 
        required :true,
        unique:true,
        minlength :5,
        maxlength:255
    },
    password:{
        type:String, required:true,minlength:8
    },
   role :{
       type : String,
       required: true ,
       enum : ["admin","user"]
   }
   
    
})
//User model
const User = mongoose.model('User',UserSchema);
function validateUser (User){

    const schema = {
        name:joi.string().required(),
        phone:joi.string().required().min(7),
        adress:joi.string().required(),
        email:joi.required().string().min(8).email(),
        password:joi.string().required().min(8),
        role:joi.string().required().valid("admin","user")
    };
    return joi.validate(User,schema); 
}
exports.User =User;
exports.validateUser=validateUser;