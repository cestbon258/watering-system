const express = require('express')
const app = express()
const port = 3000 // current port
const path = require('path');
let ejs = require('ejs')
 
app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');


// import db config settings
var connection = require('./db-config.js');

// db connection
try {
	connection.connect();
} catch {
	console.log ("Please start your apache server!");
}
// index
app.get('/', function (req, res) {
  	res.render('pages/indexx');
});

// monitoring center
app.get('/user-center', function (req, res, next) {
	connection.query('SELECT * FROM users LIMIT 1', function (error, results, fields) {
		// if (error) throw error;
		// console.log('The solution is: ', results[0].password);
		res.render('pages/index', {results: results});
	});
})

// introduction to the system
app.get('/product', function (req, res, next){
	res.render('pages/product');
})

app.get('/help', function (req, res, next) {
	res.render('pages/help');
})
// connection.end();
app.listen(port, () => console.log(`App listening on port: ${port}!`));
