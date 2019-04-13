// import mysql module
var mysql      = require('mysql');
var config = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'cc_logistics',
	socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
// port: '3306'
});

// export as a module
module.exports = config;