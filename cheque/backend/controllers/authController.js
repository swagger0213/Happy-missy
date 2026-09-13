const { sql, poolPromise } = require('../config/db');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = await poolPromise;

    const admin = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM AdminLogin WHERE username = @username AND password = @password');

    if (admin.recordset.length > 0) return res.json({ success: true, role: 'admin' });

    const user = await pool.request()
      .input('username', sql.NVarChar, username)
      .input('password', sql.NVarChar, password)
      .query('SELECT * FROM Users WHERE username = @username AND password = @password');

    if (user.recordset.length > 0) return res.json({ success: true, role: 'user' });

    res.json({ success: false });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
