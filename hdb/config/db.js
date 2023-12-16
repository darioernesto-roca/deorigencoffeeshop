// Database
const mysql = require('mysql');

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: '', // No password for the local MySQL root user by default
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;