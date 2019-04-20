// import mysql module
var mysql      = require('mysql');
var config = mysql.createConnection({
	host     : '202.81.242.92',
	user     : 'user',
	password : 'username1990-',
	database : 'smart_watering_system',
	// socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
	port: '3303'
});

// export as a module
module.exports = config;