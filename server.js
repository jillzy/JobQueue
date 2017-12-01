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
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
var db;
const JobsCollection = "JobCollection";
MongoClient.connect("mongodb://localhost:27017/JobDatabase", function(err, database) {
    if(!err) {
        db = database;
        console.log("We are connected");

    }
})

app.get('/', function(req, res){
    res.send('hello world');
});

app.get('/addJob', function(req, res){
    var url = req.query.url;
    var job = new JobQueue.Job(url);
    function callback(status){
        if (status == statusEnum.finished) {
            db.runCommand(
                {
                    insert: JobsCollection,
                    documents: [ { id: job.id, url: url, result: job.result } ]
                }
            )
            //store job.id
            //store url
            //UPDATE result

        }
    }
    job.addListener(callback)
        //if no error
        //store job.id
        //store url
        //store result
    var id = JobQueue.addJob(job);
    //respond with id
    res.send(id);
});

app.get('/checkStatus', function(req, res){
    var id = req.query.id;
    var status = JobQueue.checkStatus(id);
    res.send(status);
});

//TODO: check results

console.log("redi to rumble!!!! on port " + port);
app.listen(port);


