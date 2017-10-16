// Set the 'development' environment configuration object
module.exports = {
	db: 'mongodb://localhost/mean-development',
	sessionSecret: 'developmentSessionSecret',
	facebook: {
		clientID: '1837465166490712',
		clientSecret: 'e33369ff5238a1102d179f41a071acbd',
		callbackURL: 'http://localhost:3000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Twitter Application ID',
		clientSecret: 'Twitter Application Secret',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	},
	google: {
		clientID: '323650394818-tquuipkp99sq6to82q9kk1i2agp1bgc4.apps.googleusercontent.com',
		clientSecret: 'Sfmoje6IISz-vEE-Xe84DHjz',
		callbackURL: 'http://localhost:3000/oauth/google/callback'
	},
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
