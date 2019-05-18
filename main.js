const express = require('express')
const app = express()
const port = 3000 // current port
const path = require('path');
let ejs = require('ejs')
const bodyParser = require('body-parser');

const session = require('express-session')

// upload files using formidable
var formidable = require('formidable');
var fs = require('fs');

// upload files using multer
var multer  = require('multer')

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  	cb(null, './public/shop_img/')
	},
	filename: function (req, file, cb) {
	  	cb(null, file.originalname)
	}
})
const upload = multer({storage: storage})

// var upload = multer({ dest: './public/shop_img/' })

app.use(session({
	secret: 'a8ab97d5-bc71-4102-b33a-3e84c86e1502',
	resave: true,
	saveUninitialized: true,
	cookie: { maxAge: 600000 }
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
						req.session.user_id = results[0]["id"];
						req.session.user_role = results[0]["role"];
						console.log('the session: ', req.session.user_role);
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

app.get('/cart', function (req, res, next) {
	if (req.session.email) {
		connection.query('SELECT cart.*, product.name, product.price FROM cart INNER JOIN product ON product.id = cart.product_id WHERE cart.user_id = ? AND cart.status = 0', [req.session.user_id], function (error, results, fields) {
			if (error) throw error;
			console.log('The solution is: ', results);
			res.render('pages/cart', {is_login: req.session.email, results: results});
		});
	} else {
		res.redirect('login');
	}
})

app.post('/add-to-cart', function (req, res, next) {

	if (req.session.email) {
		try {
			connection.query('SELECT id FROM users WHERE email = ?', [req.session.email], function (error, results, fields) {
				if (error) throw error;
				cur_user = results[0]['id'];
				p_id = req.body.p_id;

				connection.query('INSERT INTO cart (user_id, product_id) VALUES (?, ?)', [cur_user, p_id], function (error, results, fields) {
					if (error) throw error;
					console.log('added to cart');
				});
				
			});
		} catch(err) {
			console.log(err);
		}
	} else {
		console.log("nothing add");
		res.send({"result" : "404"});
	}
})

app.post('/check-out', function (req, res, next) {
	qty_array = req.body.p_qty;
	id_array = req.body.cart_id;
	if (req.session.email) {
		try {
			for (i = 0; i < qty_array.length; i++) { 
				connection.query('UPDATE cart SET qty = ?, status = 1 WHERE id =? AND status = 0', [qty_array[i], id_array[i]], function (error, results, fields) {
					if (error) throw error;
					res.redirect('back');
					// res.render('pages/login', {is_login: req.session.email});
				});
			}
			

			// connection.query('UPDATE cart SET status = 1 WHERE user_id =? AND status = 0', [req.session.user_id], function (error, results, fields) {
			// 	if (error) throw error;
			// });
		} catch(err) {
			console.log(err);
		}
	} else {
		res.redirect('login');
	}
})

app.get('/remove-item', function (req, res, next) {
	cart_id = req.query.i;
	if (req.session.email) {
		connection.query('DELETE FROM cart WHERE user_id = ? AND id = ?', [req.session.user_id, cart_id], function (error, results, fields) {
			if (error) throw error;
			res.redirect('back');
		});
	} else {
		res.redirect('login');
	}
})

app.get('/dashboard', function (req, res, next) {
	if (req.session.email) {
		res.render('pages/dashboard', {is_login: req.session.email});
	} else {
		res.redirect('login');
	}
})

app.get('/orders', function (req, res, next) {
	if (req.session.email) {
		connection.query('SELECT cart.*, product.name, product.price FROM cart INNER JOIN product ON product.id = cart.product_id WHERE cart.user_id = ? AND cart.status = ?', [req.session.user_id, 1], function (error, results, fields) {
			if (error) throw error;
			console.log(results);
			res.render('pages/order', {is_login: req.session.email, results: results});
		});
	} else {
		res.redirect('login');
	}
})

app.get('/view-detail', function (req, res, next) {
	if (req.session.user_role == 1){
		p_id = req.query.p_id;
		connection.query('SELECT * FROM product WHERE id = ? LIMIT 1', [p_id], function (error, results, fields) {
			if (error) throw error;
			console.log(results);
			res.render('pages/detail', {is_login: req.session.email, results: results});
		});
	} else {
		res.redirect('login');
	}
})

app.post('/save', function (req, res, next) {
	// upload.array('filetoupload', 1);
	upload.array('filetoupload', 1)(req,res,function(err) {
		console.log(req.body);
		console.log(req.files);
		if(err) {
			return res.end("Error uploading file.");
		}

		if (req.files != '') {
			img = req.files[0].filename;
		}else{
			img = req.body.image;
		}

		p_id = req.body.p_id;
		p_name = req.body.name;
		qty = req.body.qty;
		price = req.body.price;
		description = req.body.description;
		status = req.body.status == "on" ? 1 : 0;

		try {
			connection.query('UPDATE product SET name = ? , qty = ?, price = ?, description = ?, img = ?, status = ? WHERE id = ?', [p_name, qty, price, description, img, status, p_id], function (error, results, fields) {
				if (error) throw error;
				res.redirect('back');
			});
		} catch(err) {
			console.log(err);
		}
	});
})

app.get('/product-detail', function (req, res, next) {
	if (req.session.user_role == 1){
		console.log(req.query.p_id);
		try {
			connection.query('SELECT * FROM product WHERE id = ? LIMIT 1', [req.query.p_id], function (error, results, fields) {
				if (error) throw error;
				console.log(results);
				res.render('pages/product-detail', {is_login: req.session.email, results: results});
			});
		} catch(err) {
			console.log(err);
		}
	}
})

app.get('/create-product', function (req, res, next) {
	if (req.session.user_role == 1){
		res.render('pages/create-product');
	} else {
		res.redirect('login');
	}
})

// upload files using formidable
// app.post('/fileupload', function (req, res, next) {
// 	var form = new formidable.IncomingForm();

//     form.parse(req, function (err, fields, files) {
// 		var oldpath = files.filetoupload.path;

// 		var newpath = './public/shop_img/' + files.filetoupload.name;
		
//       	fs.rename(oldpath, newpath, function (err) {
// 			if (err) throw err;
// 			res.write('File uploaded and moved!');
// 			res.end();
// 		});
//     });
// })

// upload files using multer
app.post('/fileupload', function (req, res, next) {
	upload.array('filetoupload', 1)(req,res,function(err) {
		console.log(req.body);
		console.log('==========');
		if(err) {
			return res.end("Error uploading file.");
		}
		if (req.files != '') {
			img = req.files[0].filename;
		}else{
			img = null;
		}

		p_name = req.body.name;
		qty = req.body.qty;
		price = req.body.price;
		description = req.body.description;
		status = req.body.status == "on" ? 1 : 0;

		try {
			connection.query('INSERT INTO product (name, qty, price, description, img, status) VALUES (?, ?, ?, ?, ?, ?)', [p_name, qty, price, description, img, status], function (error, results, fields) {
				if (error) throw error;
				res.redirect('all-products');
			});
		} catch(err) {
			console.log(err);
		}
	});


})

app.get('/all-products', function (req, res, next) {
	if (req.session.user_role == 1){
		try {
			connection.query('SELECT * FROM product', function (error, results, fields) {
				if (error) throw error;
				// console.log(results);
				res.render('pages/all-products', {is_login: req.session.email, results: results});
			});
		} catch(err) {
			console.log(err);
		}
	} else {
		res.redirect('login');
	}
})


// connection.end();
app.listen(port, () => console.log(`App listening on port: ${port}!`));
