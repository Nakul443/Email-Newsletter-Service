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
