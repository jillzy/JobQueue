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

