module.exports = function(passport){

	var mongoose = require('mongoose'); //this will use the connection.
	var LocalStrategy = require('passport-local').Strategy;

	var userSchema = mongoose.Schema({
	  username:String, 
	  password:String, 
	  email:String
	});


	var User = mongoose.model('users', userSchema);

	//when this method is called -> data is stored in the session
	passport.serializeUser((user, done)=>{
		done(null, user.id);
	});

	//when data for the user is required, passport will use this method to find the data from the database
	passport.deserializeUser((id, done)=>{
		User.findById(id, (err, user)=>{
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({passReqToCallback:true},
	 (req, username, password, done)=>{
	 	process.nextTick(()=>{
	 		User.findOne({username:username}, (err, user)=>{
	 			if (err) {return done(err)}
	 			if (user) {
	 				return done(null, false);
	 			}
	 			else{
	 				var user = new User();
	 				user.username = username;
	 				user.password = password;

	 				user.save((err)=>{
	 					if (err) {
	 						throw err;
	 					}
	 					return done(null, user);
	 				});
	 			}
	 		});
	 	});
	 }));
}