"use strict"

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var jsonParser = bodyParser.json();
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var config = require('./config');

var app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(jsonParser);

var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            }

            if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);


var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        console.log(err);
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
}

var User = require('./models/models').User;
var UserGame = require('./models/models').UserGame;

//endpoints


var bcrypt = require('bcryptjs');

//signin endpoint
//(create new user) POST (name, email, password, city)
app.post('/users', jsonParser, function(req, res) {
    console.log(req.body);
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        console.log(req.body);
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    var username = req.body.username;

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    username = username.trim();

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: 'Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }

            var user = new User({
                name: req.body.first_name,
                lastname: req.body.last_name,
                username: username,
                password: hash,
                city: req.body.city,
                state: req.body.state,
                email: req.body.username
            });

            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                }

                return res.status(201).json({});
            });
        });
    });
});

app.get('/users/:id', function(req, res) {
    User.findOne({
        "_id": req.params.id
    }).exec(function(err, userObject) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        UserGame.find({
            user: req.params.id
        }).exec(function(err, userGames) {
            userObject.games = userGames;
            console.log(userGames);
            res.json({
                user: userObject,
                games: userGames
            });
        })
    });
});

app.get('/games', jsonParser, passport.authenticate('basic', {
    session: false
}), function(req, res) {
    //Find other users that own the games that I want
    UserGame.find({
        "user": req.user._id,
        "own": false
    }).exec(function(err, gamesIWant) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        //[{id, game...} , { id, game}] => [game,game]
        var gamesIWantSearch = gamesIWant.map(function(val, index) {
            return val.game;
        });
        //Finding other users that have the game I want
        UserGame.find({
                "game": {
                    "$in": gamesIWantSearch
                },
                "own": true,
                "user": {
                    "$ne": req.user._id
                }
            })
            .exec(function(err, usersThatHaveGameIWant) {
                if (err) {
                    return res.status(500).json({
                        message: 'Internal Server Error'
                    });
                }
                var usersThatHaveGameIWantSearch = usersThatHaveGameIWant.map(function(val, index) {
                    return val.user;
                });
                //Does the user that has the game I want also want the game that I own
                User.find({
                    "_id": {
                        "$in": usersThatHaveGameIWantSearch
                    }
                }).exec(function(err, users) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Internal Server Error'
                        });
                    }
                    res.json(users);
                });
            }); //usersThatHaveGameIWant
    }); //gamesIWant
}); //get

//my games endpoint
//(own (true), own (false))
app.get('/mygames', jsonParser, passport.authenticate('basic', {
    session: false
}), function(req, res) {
    UserGame.find({
        "user": req.user._id
    }).sort("game").exec(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(items);
    });
});

//add games
app.post('/mygames', passport.authenticate('basic', {
    session: false
}), function(req, res) {
    console.log(req.body);
    UserGame.create({
        "user": req.user._id,
        "game": req.body.game,
        "own": req.body.own
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(item);
    });
});

//remove games
//(_id)
app.delete('/mygames/:id', jsonParser, function(req, res) {
    var id = req.params.id;
    UserGame.remove({
        '_id': id
    }, function(err, item) {
        console.log(item);
        if (err) {
            console.log(err);
            return res.sendStatus(404);
        }

        return res.sendStatus(200);
    });
});

app.use(passport.initialize());


app.get('/hidden', jsonParser, passport.authenticate('basic', {
    session: false
}), function(req, res) {
    res.json({
        message: 'This is a test'
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

exports.app = app;
exports.runServer = runServer;
