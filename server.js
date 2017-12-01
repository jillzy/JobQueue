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
var db;
const JobsCollection = "JobCollection";
MongoClient.connect("mongodb://localhost:27017/JobDatabase", function(err, database) {
    if(!err) {
        db = database;
        console.log("We are connected");

    }
})

app.get('/', function(req, res){
    res.send('README for usage');
});

app.get('/addJob', function(req, res){
    var url = req.query.url;
    var newJob = new JobQueue.Job(url);
    function callback(job) {
        if (job.status == statusEnum.finished) {
            db.collection(JobsCollection).updateOne(
                {"_id": job.id},
                {$set: {"result": job.result, "status": job.status}}
            )
            .then(function (result) {
                console.log();
            })


        }
    }
    newJob.addListener(callback)
    var id = JobQueue.addJob(newJob);
    newJob.id = id;

    db.collection(JobsCollection).insertOne({
        "_id": newJob.id,
        "url": url,
        "status": newJob.status,
        "result": newJob.result
    })
    .then(function(result) {
        console.log();
    })

    //respond with id
    res.send(id);
});

app.get('/checkStatus', function(req, res){
    var id = req.query.id;
    var status = JobQueue.checkStatus(id);
    res.send(status);
});

//TODO: check results
app.get('/checkResult', function(req,res){
    var id = req.query.id;

    db.collection(JobsCollection).findOne(
        {
            "_id": id
        }
    ).then(function(row) {
        res.send(row.result)
        console.log(row.result)
    })

});

console.log("ready to rumble on port " + port);
app.listen(port);


