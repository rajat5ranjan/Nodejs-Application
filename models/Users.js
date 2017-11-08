var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Users = new Schema({
  name: String,
  password: String,
  email:String
});
Users.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', Users);