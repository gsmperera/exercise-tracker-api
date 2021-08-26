# Exercise Tracker Backend API

freecodecamp APIs and Microservices 4th challange

## Live website

[https://exercise-tracker-sm.herokuapp.com/](https://exercise-tracker-sm.herokuapp.com/)

## Requirements

- You can POST to /api/users with form data username to create a new user. The returned response will be an object with username and _id properties.
- You can make a GET request to /api/users to get an array of all users. Each element in the array is an object containing a user's username and _id.
- You can make a GET request to /api/users/:_id/logs to retrieve a full exercise log of any user. The returned response will be the user object with a log array of all the exercises added. Each log item has the description, duration, and date properties.
- A request to a user's log (/api/users/:_id/logs) returns an object with a count property representing the number of exercises returned.
- You can add from, to and limit parameters to a /api/users:_id/logs request to retrive part of the log of any user from and to are dates in yyyy-mm-dd format. limit is an integer of how many logs to send back.
