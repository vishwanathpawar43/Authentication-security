//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});


const userSchema=new mongoose.Schema({
     email:String,
     password:String
});

// console.log(process.env.SECRET);

userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ['password'] });

const User=mongoose.model("User",userSchema);

//Get requests

app.get("/",function(req,res){
     res.render("home");
});

app.get("/login",function(req,res){
     res.render("login");
});

app.get("/register",function(req,res){
     res.render("register");
});

// Post requests

app.post("/register",function(req,res){
     const email=req.body.username;
     const password=req.body.password;

     const user=new User({
          email:email,
          password:password
     });
     user.save();
     res.render("secrets");
});

app.post("/login",function(req,res){
     const useremail=req.body.username;
     const userpassword=req.body.password;

     User.findOne({email:useremail},function(err,foundUser){
          if(err)
            console.log(err);
          else
          {
               if(foundUser)
               {
                    if(foundUser.password===userpassword)
                      res.render("secrets");
               }
          }
     });
});

app.listen(3000, function() {
     console.log("Server started on port 3000");
   });
   