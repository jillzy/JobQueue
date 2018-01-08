POST CODE REVIEW / LESSONS FROM PROJECT:

I do not strictly follow the principle of uniform interface in my code.
Jobs are not implemented as resources with URIs on which the HTTP protocols can operate.
A solution would be to revise the job as a resource to include the current attributes as well as a complete URL that defines the resource:

{
    “ID” : “some string”,
    “Status”: “some status”,
    “RequestedURL”: “some url”,
    “links”: [{
        “rel”: “self”,
        “href”: “http://localhost:8080/job/jobURI”
    }]
}

The code should then accommodate the retrieval/passing of these resource representations using an interface consistent with HTTP architecture as follows:

    Accessing a specific job resource
app.get(/job/:jobURI’, function (req, res) {
// return JSON representation of the resource
});

Adding a job resource with a POST request
app.post(/job, function (req, res) {
    // construct JSON rep of the resource to be handled using payload 
// (id, URI, requested URL, initial status)
    // create job represented by JSON 
    // add new job to queue
});.

Querying the server for status of job through a GET request
app.get(‘/job/status/:jobURI’, function (req, res) {
    // return status of resource after parsing the JSON representation
});

Querying the server for result of job through a GET request
app.get(‘/job/result/:jobURI’, function (req, res) {
    // return result of resource after parsing the JSON representation
});

Additionally, in my code I currently use a GET request with query parameters to add a job.
A POST request better aligns with the nature of the function and uniform interface, but is not allowed if the user can only use browser URL bar for commands.
My revisions here assume a client that can make all the different types of HTTP requests.

===========================================================================================================================================

NOTES:
!- Program will not run without MongoDB database
- Server.js handles database connection, exposes API
- JobQueue.js defines the Queue and Task classes
- Example.png shows API at work

USAGE:
- /addJob?url=[url]
Adds job to queue, return unique job ID
Store ID, status, url, result (the fetched data -- null at this stage) to database
* Status will be updated as jobs are finished

-/checkStatus?id=[id]
Returns status of the current job
"in queue",
"job in progress",
"job finished",
"job does not exist"

-/checkResults?id=[id]
Looks up result (fetched data) of specified job in database
Returns body of page

GOING FORWARD:
Bash scripts for testing
Further clean and comment 

