const mongoose = require('mongoose');
const { Client } = require("../models/client");
const bcrypt = require('bcryptjs');
const localstratgy = require('passport-local').Strategy
module.exports = function (passport) {
    passport.use(
        new localstratgy({ usernameField: "email" }, (email, password, done) => {
            //match user
            Client.findOne({ email: email })
                .then((theUser) => {
                    if (!theUser) return done(null,false ,{message:"the email not found"})
                    //match password
                    bcrypt.compare(password,theUser.password,(err,match)=>{
                        if (err) throw err;
                        if(match) {return done(null , theUser)}
                        else return done(null,false ,{message:"the pssword is  not correct"})
                    })
                }
                )
                .catch(err => console.log(err));
        })
    );
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        Client.findById(id, function(err, user) {
          done(err, user);
        });
      });
}