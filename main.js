const express = require('express')
const app = express()
const port = 3000
const path = require('path');
let ejs = require('ejs')

app.use(express.static(__dirname + '/public'));

// set the view engine to ejs
app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  res.render('pages/indexx');
});

app.listen(port, () => console.log(`App listening on port: ${port}!`));
