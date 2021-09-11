const jwt = require('jsonwebtoken');

// Following function will generate access token that will be valid for 2 minutes
var generateAccessToken = function(payload){
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m'});
}

module.exports = {generateAccessToken};