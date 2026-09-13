const { sql, poolPromise } = require('../config/db');

exports.getParties = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Parties');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addParty = async (req, res) => {
  const { partyName } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request().input('partyName', sql.NVarChar, partyName)
      .query('INSERT INTO Parties (PartyName) VALUES (@partyName)');
    res.json({ message: 'Party added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteParty = async (req, res) => {
  const partyId = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request().input('partyId', sql.Int, partyId)
      .query('DELETE FROM Parties WHERE PartyID = @partyId');
    res.json({ message: 'Party deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
