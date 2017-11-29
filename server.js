// server.js
var JobQueue = require('./jobqueue');

// modules =================================================
var express        = require('express');
var app            = express();

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
// (uncomment after you enter in your own credentials in config/db.js)
// mongoose.connect(db.url);

app.get('/', function(req, res){
    res.send('hello world');
});

app.get('/addJob', function(req, res){
    var url = req.query.url;
    console.log(url);
    var id = JobQueue.addJob(new JobQueue.Job(url));
    //respond with id
    res.send(id);
});

app.get('/checkStatus', function(req, res){
    res.send('hello world');
});


console.log("redi")
app.listen(port);


