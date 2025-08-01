const mysql = require('mysql2');

// Create a MySQL connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',         // ✅ Your MySQL username
  password: 'root', // ✅ Your MySQL password
  database: 'campuscatalysts' // ✅ Your MySQL DB name
});

// Optional: Test DB connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ Connected to the MySQL database');
    connection.release();
  }
});

module.exports = db;
