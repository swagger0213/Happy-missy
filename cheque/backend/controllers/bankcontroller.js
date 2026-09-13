const { sql, poolPromise } = require('../config/db');

exports.getBanks = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Banks');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addBank = async (req, res) => {
  const { bankName } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('bankName', sql.NVarChar, bankName)
      .query('INSERT INTO Banks (BankName) VALUES (@bankName)');
    res.json({ message: 'Bank added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteBank = async (req, res) => {
  const bankId = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request().input('bankId', sql.Int, bankId)
      .query('DELETE FROM Banks WHERE BankID = @bankId');
    res.json({ message: 'Bank deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

