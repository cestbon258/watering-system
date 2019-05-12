const express = require('express')
const app = express()
const port = 3000 // current port
const path = require('path');
let ejs = require('ejs')
const bodyParser = require('body-parser');

const session = require('express-session')


app.use(session({
	secret: 'a8ab97d5-bc71-4102-b33a-3e84c86e1502',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
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
  	res.render('pages/indexx', {is_login: req.session.email});
});

// monitoring center
app.get('/user-center', function (req, res, next) {
	if (req.session.email) {
	// connection.query('SELECT * FROM data;', function (error, results, fields) {
		// if (error) throw error;
		// console.log('The solution is: ', results);
		// res.render('pages/index', {results: results});
		res.render('pages/index', {is_login: req.session.email});
	// });
	} else {
		res.redirect('login');
	}
})

app.get('/poll-moisture-data', function (req, res, next) {
	try {
		connection.query('SELECT mois, created_at FROM data WHERE mois IS NOT NULL ORDER BY created_at DESC LIMIT 10 ', function (error, results, fields) {
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
		connection.query('SELECT humi, created_at FROM data WHERE humi IS NOT NULL ORDER BY created_at DESC LIMIT 10 ', function (error, results, fields) {
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
		connection.query('SELECT temp, created_at FROM data WHERE temp IS NOT NULL ORDER BY created_at DESC LIMIT 10 ', function (error, results, fields) {
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
	res.render('pages/product', {is_login: req.session.email});
})

app.get('/help', function (req, res, next) {
	res.render('pages/help', {is_login: req.session.email});
})

app.get('/store', function (req, res, next) {
	try {
		connection.query('SELECT * FROM product LIMIT 20 ', function (error, results, fields) {
			// if (error) throw error;
			console.log('The solution is: ', results);
			res.render('pages/shop', {is_login: req.session.email, results: results});
		});
	} catch(err) {
		console.log(err);
	}
	
})

app.get('/login', function (req, res, next) {
	res.render('pages/login', {is_login: req.session.email});
})

app.post('/user-login', function (req, res, next) {
	if (req.body.email == ""){
		res.render('pages/login');
	}
	if (req.body.password == ""){
		res.render('pages/login');
	} 

	try {
		connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [req.body.email], function (error, results, fields) {
			if (results[0]){
				connection.query('SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1', [req.body.email, req.body.password], function (error, results, fields) {
					if (results[0]){ 
						req.session.email = results[0]["email"];
						console.log('The solution is: ', results);
						res.redirect('/');
					} else {
						res.render('pages/login');
					}
				})
			} else {
				res.render('pages/login');
			}
		})
	} catch(err) {
		console.log(err);
	}

	// try {
	// 	connection.query('SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1', [req.body.email, req.body.password], function (error, results, fields) {
	// 		req.session.email = results[0]["email"];
	// 		// console.log(req.session.email);
	// 		// console.log(results[0]["email"]);
	// 		console.log('The solution is: ', results);
	// 		res.redirect('/');
	// 	});
	// } catch(err) {
	// 	res.redirect('login');
	// }

})

app.get('/signup', function (req, res, next) {
	res.render('pages/register', {is_login: req.session.email});
})

app.post('/user-register', function (req, res, next) {
	if (req.body.email == ""){
		res.render('pages/register');
	}

	try{
		connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [req.body.email], function (error, results, fields) {
			if (results[0]) {
				console.log("email has been taken");
				res.render('pages/register');
			}
		});
	} catch (err) {
		console.log(err);
	}

	if (req.body.password == ""){
		res.render('pages/register');
	} 
	if (req.body.password2 == ""){
		res.render('pages/register');
	} 
	if (req.body.password != req.body.password2){
		console.log("passwords do not match");
		res.render('pages/register');
	} 

	try {
		connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [req.body.email, req.body.password], function (error, results, fields) {
			if (error) throw error;
			res.redirect('login');
		});
	} catch(err) {
		console.log(err);
	}

	// res.render('pages/register', {is_login: req.session.email});
})

app.get('/signout', function (req, res, next) {
	req.session.destroy(function(err) {
		// cannot access session here
	})
	res.redirect('/');
})

app.get('/settings', function (req, res, next) {
	// var tb_email=req.query;
	// console.log(req.query.test);
	if (req.session.email) {
		try {
			connection.query('SELECT status FROM switch LIMIT 1 ', function (error, results, fields) {
				// if (error) throw error;
				console.log('The solution is: ', results);
				res.render('pages/settings', {is_login: req.session.email,results: results});
				
			});
		} catch(err) {
			console.log(err);
		}
	} else {
		res.redirect('login');
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
