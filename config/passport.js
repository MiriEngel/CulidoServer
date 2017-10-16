
/**
 * Module dependencies.
 */
var passport = require('passport'),
  path = require('path'),
  config = require(path.resolve('./config/config'));
  const mongoose = require('mongoose');

/**
 * Module init function.
 */
module.exports = function (app, db) {
		const User = mongoose.model('User');
  // Serialize sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function (id, done) {
    User.findOne({
      _id: id
    }, '-salt -password', function (err, user) {
      done(err, user);
    });
  });

//   // Initialize strategies
//   config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function (strategy) {
//     require(path.resolve(strategy))(config);
//   });

  	// Load Passport's strategies configuration files
	require('./strategies/local.js')(config);
	require('./strategies/facebook.js')(config);
	require('./strategies/google.js')(config);

//   // Add passport's middleware
//   app.use(passport.initialize());
//   app.use(passport.session());
};
