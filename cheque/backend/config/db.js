const sql = require('mssql');

const dbConfig = {
  server: 'SAGAR\\SQLEXPRESS',
  database: 'Cheque',
  user: 'sa',
  password: '123456789',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('Database connection failed:', err);
    throw err;
  });

module.exports = {
  sql,
  poolPromise
};
