// db/dbConnection.js
const mysql = require('mysql');

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',         // Change if needed
    user: 'root',     // Replace with your MySQL username
    password: 'root', // Replace with your MySQL password
    database: 'epaper'  // Replace with your MySQL database name
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Function to execute SQL queries
const queryDB = (query, params, callback) => {
    db.query(query, params, (err, results) => {
        callback(err, results); // Ensure callback is called
    });
};

module.exports = { queryDB };
