import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { User, TempUser } from './models';

passport.use(new LocalStrategy(
	function(username, password, done) {
		username = username.toLowerCase();
		User.findOne({
			username: username
		}, function(err, user) {
			if (err) {
				return done(err);
			}
			if (!user) {
				return TempUser.findOne({
					username: username
				}, function(err, tempuser) {
					if (err) { return done(err); }
					if (tempuser) {
						return done(null, false, {
							message: 'Please activate your account.'
						});
					} else {
						return done(null, false, {
							message: 'Incorrect username.'
						});
					}
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}
			return done(null, user);
		});
	}
));
