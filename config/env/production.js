// Set the 'production' environment configuration object
module.exports = {
	db: 'mongodb://localhost/mean-production',
	sessionSecret: 'productionSessionSecret',
	facebook: {
		clientID: 'Facebook Application ID',
		clientSecret: 'Facebook Application Secret',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Twitter Application ID',
		clientSecret: 'Twitter Application Secret',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	},
	google: {
		clientID: 'Google Application ID',
		clientSecret: 'Google Application Secret',
		callbackURL: 'http://localhost:3000/oauth/google/callback'
	},
	//     mailer: {
  //   from: process.env.MAILER_FROM || 'info@sieek.com',
  //   options: {
  //     service: process.env.MAILER_SERVICE_PROVIDER || 'outlook',
  //     auth: {
  //       user: process.env.MAILER_EMAIL_ID || 'info@sieek.com',
  //       pass: process.env.MAILER_PASSWORD || 'sieekos2017!'
  //     },

	//      host: 'smtp.office365.com',
  //   port: 587
  //   }
  // }
	  mailer: {
    from: process.env.MAILER_FROM || 'sieek.globalservice@gmail.com',
    options: {
      service: process.env.MAILER_SERVICE_PROVIDER || 'gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || 'sieek.globalservice@gmail.com',
        pass: process.env.MAILER_PASSWORD || '203882071'
      },
	 secure: true,
	     host: 'smtp.gmail.com',
    port: 465
    }
  },
};