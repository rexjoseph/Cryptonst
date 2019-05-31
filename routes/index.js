var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// root route
router.get('/', (req, res) => {
    res.redirect('/blogs');
});

// Auth routes
// show register form
router.get('/register', (req, res) => {
    res.render('register');
});

// handle sign up logic
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then(user => {
        if (user) {
            return res.status(400).json({email: 'Email already in use'})
        } else {
            var newUser = new User({username: req.body.username, name: req.body.name, email: req.body.email});

            User.register(newUser, req.body.password, (err, user) => {
                if (err) {
                    req.flash('error', err.message);
                    return res.render('register');
                }
                passport.authenticate('local')(req, res, () => {
                    req.flash('success', 'Registration successful');
                    res.redirect('/blogs');
                })
            })
        }
    })
});

// show login form 
router.get('/login', (req, res) => {
    res.render('login');
})

// handling login logic
router.post('/login', passport.authenticate('local', {successRedirect: '/blogs', failureRedirect: '/login'}), (req, res) => {
});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/blogs');
});

module.exports = router;