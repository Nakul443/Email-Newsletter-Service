// setup express
const express = require('express'); // 'require' loads the express module
// which is then stored in the express variable
// express is a web framework for Node.js that simplifies the process of building web applications

const app = express();
// express() initializes a new Express app (app).
// This app object will handle routes, middleware, and server setup.

// app.listen(port,callback), callback runs when the server starts successfully
app.listen(3000, () => {
    // app.listen is used to bind and listen for connections on the specified host and port
    console.log('Server is running on port 3000');
});

require('dotenv').config(); // loads environment variables from a .env file into process.env

// setup database
const mysql = require('mysql2'); // imports mysql2 module
require('dotenv').config();

// Process.env used to access variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    }
    else {
        console.log('Database connected successfully');
    }
});


// writing APIs

// POST API to send an email
app.post('/sendMail', (req,res) => {
    // req is the request object, which contains information about the HTTP request that the user sends
    // res is the response object, which is used to send a response back to the client
    const body = req.body;
    const receiverList = body.receiverList; // Extracts the receiver list from the request body
    // automatically receives in the form of an array

    const employeeId = body.employeeId; // Extracts the employee ID from the request body
    const content = body.content; // Extracts the content of the email from the request body

    const status = 'PENDING';
    // status can be 'PENDING', 'SENT', or 'FAILED'

    // store the data in the database
    db.query('INSERT INTO email(content, employee_id, sent_to, status) VALUES (?,?,?,?)', [content, employeeId, receiverList, status], (err, result) => {
        if (err) {
            console.error('Error inserting data into database:', err);
        }
        else {
            console.log('Data inserted successfully:', result);
            res.status(200).send('Email sent successfully');
        }
    });

/*
For example, if the request sends JSON like { "content": "Hello, world!" },
then req.body.content would be "Hello, world!".
*/
});

// GET API to get the email history
app.get('/emailHistory', (req, res) => {
    // get the history of emails from the database

    // pagination
    const page = parseInt(req.query.page) || 1; // retrieves the page number from the query parameters ('?page=2'), defaults to 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // retrieves the limit of messages per page from the query parameters, defaults to 10 if not provided
    const offset = (page - 1) * limit; // calculates how many messages to skip based on the page number and limit
    // if page = 1 and limit = 10, offset will be 0 (no messages skipped)
    // if page = 2 and limit = 10, offset will be 10 (skip the first 10 messages)
    // if page = 3 and limit = 10, offset will be 20 (skip the first 20 messages)

    const sql = 'SELECT * FROM email ORDER BY id DESC LIMIT ? OFFSET ?'; // SQL query to select emails, ordered by ID in descending order, with pagination

    db.query(sql, [limit,offset], (err, results) => {
        if (err) {
            console.error('Error fetching email history:', err);
            res.status(500).send('Error fetching email history');
        }
        console.log('Email history fetched successfully:', results);
        res.status(200).json(results); // sends the results as a JSON response
    })
});


// get a particular email by ID