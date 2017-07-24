'use strict';

let express = require('express');
let app = express();
let cors = require('cors');
let router = express.Router();
let path = require("path");
let bodyParser = require("body-parser");
let exphbs = require('express3-handlebars');

/*
 * Config for Production and Development
 */
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.engine('.hbs', exphbs({
    // Default Layout and locate layouts and partials
    extname: '.hbs',
    defaultLayout: 'index',
    layoutsDir: 'assets/views/layouts/',
    partialsDir: 'assets/views/partials/'
}));

// Locate the views
app.set('views', __dirname + '/assets/views/');

// Locate the assets
app.use(express.static(__dirname + '/'));

// Set Handlebars
app.set('view engine', '.hbs');
app.use(express.static(path.join(__dirname, '/bundle.js')));

app.use("/", router);

//Set API port
app.set('port', 5900);

// Index Page
app.get('/', function(request, response) {
    response.render('main', {});
});

//Listen on the port
app.listen(app.get('port'), function() {
    console.log('Node App Started');
});
