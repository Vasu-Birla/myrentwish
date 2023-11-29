import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: '3306',
  database: 'kilvish',
  waitForConnections: true, // Enable queueing
  connectionLimit: 100, // Set an appropriate limit
});

const connection = () => {
  return pool.getConnection();
};

export default connection;




// import mysql from 'mysql2/promise';

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   port: '3306',
//   database: 'db_invoice',
//   waitForConnections: true,
//   connectionLimit: 100,
//   connectTimeout: 30000, // Set a higher timeout value (in milliseconds)
// });

// const connection = async () => {
//   try {
//     const conn = await pool.getConnection();
//     return conn;
//   } catch (error) {
//     console.error('Error getting database connection:', error.message);
//     throw error; // Re-throw the error to indicate connection failure
//   }
// };
