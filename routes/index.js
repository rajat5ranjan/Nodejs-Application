var express = require('express');
var passport = require('passport');
var User = require('../models/Users');
var UsersArr = [];
var date=new Date();
var router = express.Router();

/*router.get('/', function(req, res) {
  res.render('index',{title: 'Welcome to express','date':date,user: req.session.user.name});
  
});*/

router.get('/login', function(req, res) {
  res.render('login',{user:req.session.user});
  
});

router.post('/login', function(req, res){
   console.log("Hi");
   if(!req.body.username || !req.body.password){
      res.render('login', {message: "Please enter both id and password"});
   } else {
      User.findOne({
    name: req.body.username, password:req.body.password
    })
    .exec(function(err, user) {
      if(err || user==null) {
        console.log("error occured in login")
        res.render('login', {message: "Invalid credentials!"});
      } else {
        console.log(user);
        req.session.user = user;
        res.redirect('/');
      }
    });

/*      res.render('login', {message: "Invalid credentials!"});*/
   }
});


router.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
    
   });
   req.session = null; 
   res.redirect('/login');
});


router.post('/signup', function(req, res){
   if(!req.body.name || !req.body.password || !req.body.email){
      res.status("400");
      res.send("Invalid details!");
   } else {
      UsersArr.filter(function(user){
         if(user.name === req.body.name){
            res.render('login', {
               message: "User Already Exists! Login or choose another user id"});
         }
      });
    var newUser = new User();

  newUser.name = req.body.name;
  newUser.password = req.body.password;
  newUser.email = req.body.email;

  newUser.save(function(err, user) {
    if(err) {
      res.send('error saving user');
    } else {
      console.log(user);
      //res.send(user);
      req.session.user = newUser;
      UsersArr.push(newUser);
      res.redirect('/');
    }
  });
      
   }
});



function checkSignIn(req, res,next){
  console.log("incheckin");
  console.log(req.url);
   if(req.session.user){
      next();     //If session exists, proceed to page
   } else {
      var err = new Error("Not logged in!");
      console.log(req.session.user);
      next(err);  //Error, trying to access unauthorized page!
   }
}

router.get('/', checkSignIn,function(req, res,next) {
  res.render('index', {title: 'Welcome to express','date':date,user: req.session.user.name});
  console.log('Cookies: ', req.cookies)
  //res.sendFile(__dirname+'/index.html');
});



router.use('/', function(err, req, res, next){
console.log(err);
   //User should be authenticated! Redirect him to log in.
   res.redirect('/login');
});
module.exports = router;














//using passport
/*router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/signup', (req, res, next) {
    User.register(new User({ name : req.body.name }), req.body.password,req.body.email, (err, account) => {
        if (err) {
          return res.render('login', { message : err.message });
        }

        passport.authenticate('local')(req, res, () {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/home');
            });
        });
    });
});*/