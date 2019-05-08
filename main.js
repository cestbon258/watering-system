const express = require('express')
const app = express()
const port = 3000 // current port
const path = require('path');
let ejs = require('ejs')

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

// let public directory accessable 
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
	// connection.query('SELECT * FROM data;', function (error, results, fields) {
		// if (error) throw error;
		// console.log('The solution is: ', results);
		// res.render('pages/index', {results: results});
		res.render('pages/index');
	// });
})

app.get('/poll-moisture-data', function (req, res, next) {
	try {
		connection.query('SELECT mois, created_at FROM data WHERE mois IS NOT NULL ORDER BY created_at DESC LIMIT 1 ', function (error, results, fields) {
			// if (error) throw error;
			// console.log('The solution is: ', results);
			res.send({ success: true,  results: results});
		});
	} catch(err) {
		console.log(err);
	}
	
})

app.get('/poll-humidity-data', function (req, res, next) {
	try {
		connection.query('SELECT humi, created_at FROM data WHERE humi IS NOT NULL ORDER BY created_at DESC LIMIT 1 ', function (error, results, fields) {
			// if (error) throw error;
			// console.log('The solution is: ', results);
			res.send({ success: true,  results: results});
		});
	} catch(err) {
		console.log(err);
	}
	
})

app.get('/poll-temperature-data', function (req, res, next) {
	try {
		connection.query('SELECT temp, created_at FROM data WHERE temp IS NOT NULL ORDER BY created_at DESC LIMIT 1 ', function (error, results, fields) {
			// if (error) throw error;
			// console.log('The solution is: ', results);
			res.send({ success: true,  results: results});
		});
	} catch(err) {
		console.log(err);
	}
	
})

// introduction to the system
app.get('/product', function (req, res, next){
	res.render('pages/product');
})

app.get('/help', function (req, res, next) {
	res.render('pages/help');
})

app.get('/settings', function (req, res, next) {
	// var tb_email=req.query;
	// console.log(req.query.test);
	try {
		connection.query('SELECT status FROM switch LIMIT 1 ', function (error, results, fields) {
			// if (error) throw error;
			console.log('The solution is: ', results);
			res.render('pages/settings', {results: results});
			
		});
	} catch(err) {
		console.log(err);
	}
})

app.post('/control', function (req, res, next) {
	var test = req.body.water == "on" ? 1 : 0;
	try {
		connection.query('UPDATE switch SET status = ? WHERE id=1', [test], function (error, results, fields) {
			// if (error) throw error;
			console.log('The solution is: ', results);
			res.redirect('settings');
			
		});
	} catch(err) {
		console.log(err);
	}
})

// connection.end();
app.listen(port, () => console.log(`App listening on port: ${port}!`));
