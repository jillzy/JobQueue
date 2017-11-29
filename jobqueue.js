
var request = require('request');
statusEnum = {
    ready: "in queue",
    inProgress : "job in progress",
    finished : "job finished",
    doesNotExist : "job does not exist"
};

//queue definition
var queue = [];
queue.jobByID = {};

queue.addJob = function (job) {
    function callback(status){
        if (status == statusEnum.finished) {
            queue.next();
        }
    }
    job.addListener(callback);
    var id = Math.random().toString(36).substr(2);
    queue.jobByID[id] = job;
    queue.push(job);
    if (queue.length == 1) {
        queue.next();
    }
    return id;
}
queue.checkStatus = function (id) {
    var job = queue.jobByID[id];
    if (job != null) {
        return queue.jobByID[id].status;
    } else return statusEnum.jobByID.doesNotExist;
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
//TODO: Check results
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
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i](this.status);
        }
        var that = this;
        request(this.url, function(err, res, body) {
            if (err) {
                console.log(err);
            }
            if (body != null) {

                //fetch data from body
                //store body, job id, url in a row if no error
                //store to database

                //if error, store url job id and error

                console.log(body.url);
                console.log(body.explanation);
                that.result = body;
            }
            that.status = statusEnum.finished;
            for (var i = 0; i < that.listeners.length; i++) {
                that.listeners[i](that.status);
            }
        });
    };

}


queue.Job = Job;
//variable called status that can be queried and is updated
//url variable

module.exports = queue;