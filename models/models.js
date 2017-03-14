var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: { type: String },
    lastname: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: { type:String, required: true },
    state: { type:String, required: true }
});

var bcrypt = require('bcryptjs');

UserSchema.methods.validatePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isValid) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, isValid);
    });
};

var UserGameSchema = new mongoose.Schema({
    user: { type: String, required: true },
    game: { type: String, required: true },
    own: { type: Boolean, required: true }
});

var User = mongoose.model('User', UserSchema);
var UserGame = mongoose.model('UserGame', UserGameSchema);

module.exports.User = User;
module.exports.UserGame = UserGame;
