const mongoose = require('mongoose');
const { User } = require("../models/userModel");
const bcrypt = require('bcryptjs');
const localstratgy = require('passport-local').Strategy
module.exports = function (passport) {
  passport.use(
    new localstratgy
      ({ usernameField: "email",passwordField:"password"}, (email, password, done) => {
        //match user
        console.log(email);
        console.log(password);
        
        User.findOne({ email: email })
          .then((theUser) => {
            console.log(theUser);
            
            if (!theUser) {
          console.log("the email not found");
              
              return done(null, false, { message: "the email not found" })
          
          }
            //match password
           if(password.toString() ==theUser.password.toString()) {
              console.log("pass match");
                           
            return done(null, theUser)}
              else {
                console.log(password.toString());
                console.log(theUser.password.toString());

                
                return done(null, false, { message: "the pssword is  not correct" })}

          //   bcrypt.compare(password, theUser.password, (err, match) => {
          //    if (err) throw err;
          //    if (match) { return done(null, theUser) }
          //     else return done(null, false, { message: "the pssword is  not correct" })
          //  })
          }
          )
          .catch(err => console.log(err));
      })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}