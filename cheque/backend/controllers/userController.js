const { sql, poolPromise } = require('../config/db');


exports.getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT username FROM Users');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Fetch users failed:', err);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

exports.addUser = async (req, res) => {
  const { username, firstName, lastName, password } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('username', sql.VarChar, username)
      .input('firstName', sql.VarChar, firstName)
      .input('lastName', sql.VarChar, lastName)
      .input('password', sql.VarChar, password)
      .query(`
        INSERT INTO Users (username, firstName, lastName, password)
        VALUES (@username, @firstName, @lastName, @password)
      `);
    res.status(200).json({ message: 'User added successfully' });
  } catch (err) {
    console.error("Add user failed:", err);
    res.status(500).json({ message: 'Server error while adding user' });
  }
};

exports.deleteUser = async (req, res) => {
  const { username } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('username', sql.VarChar, username)
      .query('DELETE FROM Users WHERE username = @username');
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user failed:', err);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};

