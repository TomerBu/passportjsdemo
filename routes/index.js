module.exports = function(passport){

	var express = require('express');
	var router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res, next) {
	  res.render('index', { title: 'Express' });
	});

	router.get('/login', (req, res)=>{
		res.render('login', {message:'login'});
	});

	router.get('/signup', (req, res)=>{
		res.render('signup', {message:'signup'});
	});

	// process the signup form
    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

	// process the signup form
    router.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



	// route middleware to make sure a user is logged in
	function isLoggedIn(req, res, next) {
	    // if user is authenticated in the session, carry on 
	    if (req.isAuthenticated())
	        return next();
	    // if they aren't redirect them to the home page
	    req.session.error = 'Not Logged In!, can\'t see profile'
	    res.redirect('/');
	}
	//protected route using the isLoggedIn middleware
    router.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
            user : req.user // get the user out of session and pass to template
        });
    });

    router.get('/logout', function(req, res) {
    	req.session.notice = 'Logged you out';
        req.logout();
        res.redirect('/');
    });


	return router;
}