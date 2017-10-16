// Create a new 'render' controller method
exports.render = function(req, res) {
	// Set the safe user object 
	const user = (!req.user) ? null : {
		_id: req.user.id,
		firstName: req.user.firstName,
		lastName: req.user.lastName,
		profileImageURL: req.user.profileImageURL,
		email:req.user.email,
		username:req.user.username
	};

	// Use the 'response' object to render the 'index' view with a 'title' and 'user' properties
	res.render('index', {
		title: 'PopApp',
		user: JSON.stringify(user),
		userFirstName : user?user.firstName:null
	});
};