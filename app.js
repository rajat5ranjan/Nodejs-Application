var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var engines = require('consolidate');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var port = 8080;
var db = 'mongodb://localhost/users';
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

mongoose.connect(db);

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: "Your secret key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false ,}
}))

app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


var routes = require('./routes/index');
var users = require('./routes/users');

app.use('/', routes);

var User = require('./models/Users');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());










/*app.post('/', function(req, res) {
    if(req.body.username=="admin" && req.body.password=="admin123"){
        res.render('index', {user: 'Admin'});
    }else{
        res.render('login', {message: 'Sorry wrong username or password'});
    }
  //res.sendFile(__dirname+'/index.html');
});*/



















/*app.get('/search', function(req, res) {
    var query = req.query.id;
    res.send('id: ' + query);
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
