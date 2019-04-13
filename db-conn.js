// import db config settings
var connection = require('./db-config.js');

connection.connect();

connection.query('SELECT * FROM users', function (error, results, fields) {
	if (error) throw error;
	console.log('The solution is: ', results);
});

connection.end();
