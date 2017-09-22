// Set up
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var cors = require('cors');

// Configuration
// mongoose.connect('mongodb://localhost/property');

var url = 'mongodb://amy:property2017@ds147274.mlab.com:47274/property';
// Use connect method to connect to the Server
mongoose.connect(url, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
  });
 
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cors());
 
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});
 
// Models
var Review = mongoose.model('Property', {
    nickname: String,
    address: String,
    rent: Number
});
 
// Routes
 
    // Get reviews
    app.get('/api/properties', function(req, res) {
 
        console.log("fetching properties");
 
        // use mongoose to get all reviews in the database
        Review.find(function(err, properties) {
 
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)
 
            res.json(properties); // return all reviews in JSON format
        });
    });
 
    // create review and send back all reviews after creation
    app.post('/api/properties', function(req, res) {
 
        console.log("creating property");
 
        // create a review, information comes from request from Ionic
        Review.create({
            nickname : req.body.nickname,
            address : req.body.address,
            rent: req.body.rent,
            done : false
        }, function(err, review) {
            if (err)
                res.send(err);
 
            // get and return all the reviews after you create another
            Review.find(function(err, properties) {
                if (err)
                    res.send(err)
                res.json(properties);
            });
        });
 
    });
 
    // delete a review
    app.delete('/api/properties/:property_id', function(req, res) {
        Review.remove({
            _id : req.params.property_id
        }, function(err, property) {
 
        });
    });
 
 
// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");