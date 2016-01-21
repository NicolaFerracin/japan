var Wonder = require('./models/wonder');  // load the wonder mongoose model
var User = require('./models/user');  // load the User mongoose model for passport.js authentication

module.exports = function(app, passport) {
	// api ---------------------------------------------------------------------
	// create thing
	app.post('/api/wonder', function(req, res) {
		var wonder = new Wonder(req.body);
		wonder.save(function (err) {
			if (err) {
				res.send(err);
			} else {
				res.sendStatus(200);
			}
		})
	});

	// get all wonders
	app.get('/api/wonders', function(req, res) {
		// use mongoose to get all wonders from the db
		Wonder.find(function(err, wonders) {
			// if err, send it
			if (err) {
				res.send(err);
			}
			res.json(wonders);
		});
	});

	// get thing by user
	app.get('/api/wonders/:user', function(req, res) {
		// use mongoose to get all the wonders by username
		Wonder.find({ user : req.params.user}, function(err, wonders) {
			// if err, send it
			if (err) {
				res.send(err);
			} else if (!wonders) {
				res.send("No wonders found");
			} else {
				res.json(wonders);
			}
		});
	});
	/*
	// get thing by id
	app.get('/api/thing/:id', function(req, res) {
	// use mongoose to find the thing by id requested
	Thing.findById(req.params.id, function(err, thing) {
	if(err) {
	res.send(err);
}
res.json(thing);
});
});

*/

// update a wonder by id
app.put('/api/wonder', function(req, res) {
	Wonder.findById(req.body._id, function(err, wonder) {
		if(err) {
			res.send(err);
		}
		// get the username and check if it already liked this wonder
		var user = isLoggedIn(req);
		if (user) {
			if (wonder.likers.indexOf(user) > -1) {
				res.status(404).send("Uh oh, it looks like you already liked this Wonder.");
				return;
			}
		}
		wonder.likes++;
		wonder.likers.push(user);
		wonder.save(function (err) {
			if (err) {
				res.send(err);
			} else {
				res.sendStatus(200);
			}
		});
	});
});

// delete a wonder by id
app.delete('/api/wonder/:id', function(req, res) {
	Wonder.remove({
		_id : req.params.id
	},
	function(err, wonder) {
		if (err) {
			res.send(err);
		}
		res.sendStatus(200);
	});
});

// process the login form
// Express Route with passport authentication and custom callback
app.post('/api/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (user === false) {
			res.status(401).send(req.flash('loginMessage'));
		} else {
			req.login(user, function(err) {
				if (err) {
					res.status(500).send("There has been an error");
				} else {
					res.status(200).send("success!");
				}
			});
		}
	})(req, res, next);
});

// process the signup form
// Express Route with passport authentication and custom callback
app.post('/api/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (user === false) {
			res.status(401).send(req.flash('signupMessage'));
		} else {
			req.login(user, function(err) {
				if (err) {
					res.status(500).send("There has been an error");
				} else {
					res.status(200).send("success!");
				}
			});
		}
	})(req, res, next);
});

// =====================================
// TWITTER ROUTES ======================
// =====================================
// route for twitter authentication and login
app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
app.get('/auth/twitter/callback',
passport.authenticate('twitter', {
	successRedirect : '/',
	failureRedirect : '/'
}));


// check if the user is logged in an retrieve a different user obj based on the status
app.get('/loggedin', function(req, res) {
	res.json(isLoggedIn(req));
});

// log the user out and redirect to /
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

isLoggedIn = function(req) {
	if (req.isAuthenticated()) {
		var user = JSON.parse(JSON.stringify(req.user)).username;
		return user;
	}
	return null;
}
};
