
var request = require('request');
statusEnum = {
    ready: "ready, not yet started",
    inProgress : "job in progress",
    finished : "job finished"
};

//queue definition
var queue = [];
queue.jobByID = {};

queue.addJob = function (job) {
    job.addListener(function(status){
        if (status == statusEnum.finished) {
            queue.Next();
        }
    });
    var id = Math.random().toString( 36 ).substr( 2 );
    queue.jobByID[id] = job;
    queue.push(job);
    return id;
}
queue.checkStatus = function (id) {
    return queue.jobByID[id].status;
}

//initial kick of when queue !empty and nothing running, then called when current job is finished
queue.next = function () {
    //if there are more jobs in queue
    if (queue.length != 0) {
        var currentJob = queue.shift();
        currentJob.run();
    }
}



//job definition
// TODO: store results in database
function Job(url) {
    this.url = url;
    this.status = statusEnum.ready;
    this.result = null;
    this.listeners = []; //is called when the status changes

    this.addListener = function(listener){
        this.listeners.push(listener);
    }

    this.removeListener = function(listener){
        this.listeners.remove(listener);
    }

    //fetch data from a url
    this.run = function(){
        this.status = statusEnum.inProgress;
        listeners.forEach(function(listener){
            listener(status);
        });
        request(this.url, function(err, res, body) {
            if (err) {
                console.log(err);
            }
            console.log(body.url);
            console.log(body.explanation);
            this.result = body;
            this.status = statusEnum.finished;
            listeners.forEach(function(listener){
                listener(status);
            });
        });
    };

}

queue.Job = Job;
//variable called status that can be queried and is updated
//url variable

module.exports = queue;