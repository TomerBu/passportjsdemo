module.exports = function(passport){

	var mongoose = require('mongoose'); //this will use the connection, no need to connect again.
	var LocalStrategy = require('passport-local').Strategy;
	var bcrypt = require('bcrypt'); //encryption

	var userSchema = mongoose.Schema({
	  username:String, 
	  password:String, 
	  email:String
	});

	//generate an encrypted password (using the bcrypt hash function)
	userSchema.methods.hash = function(password) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(password, salt);
	    return hash
	};

	// Test if a password is valid:
	userSchema.methods.isValidPassword = function(password) {
	    return bcrypt.compareSync(password, this.password);
	};


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
	 	process.nextTick(()=>{ //without this, it will not work
	 		User.findOne({username:username}, (err, user)=>{
	 			if (err) {return done(err)}
	 			if (user) {
	 				return done(null, false, req.flash('info', 'This username is already taken'));
	 			}
	 			else{
	 				var user = new User();
	 				user.username = username;
	 				user.password = user.hash(password);

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

	passport.use('local-login', new LocalStrategy({passReqToCallback:true}, 
		(req, username, password, done)=>{
			User.findOne({username:username}, (err, user)=>{
				if (err) {return done(err);}
				if (!user) {return done(null, false, req.flash('info', 'No Such User!'));}
				if (!(user.isValidPassword(password))) {return done(null, false ,req.flash('info','Wrong Password... Try Again? :)'));}
				return done(null, user);
			});
		}
	));
}