const { sql, poolPromise } = require('../config/db');

exports.getCheques = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Cheques');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cheques' });
  }
};

exports.addCheques = async (req, res) => {
  const {
    paidTo,
    bankName,
    accountType,
    accountNumber,
    chequeNo,
    chequeAmount,
    billNo,
    issueDate,
    description
  } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('paidTo', sql.NVarChar, paidTo)
      .input('bankName', sql.NVarChar, bankName)
      .input('accountType', sql.NVarChar, accountType)
      .input('accountNumber', sql.NVarChar, accountNumber)
      .input('chequeNo', sql.NVarChar, chequeNo)
      .input('chequeAmount', sql.Decimal(18, 2), chequeAmount)
      .input('billNo', sql.NVarChar, billNo)
      .input('dateIssued', sql.Date, issueDate)
      .input('description', sql.NVarChar, description)
      .query(`
        INSERT INTO Cheques (
        PaidTo, BankName, AccountType, AccountNumber,
        ChequeNo, ChequeAmount, BillNo, DateIssued, Description
        ) VALUES (
         @paidTo, @bankName, @accountType, @accountNumber,
         @chequeNo, @chequeAmount, @billNo, @dateIssued, @description
        )
      `);
      res.status(200).json({ message: 'Cheque issued successfully' });
  } catch (err) {
    console.error('Error issuing cheque:', err);
    res.status(500).json({ message: 'Failed to issue cheque' });
  }
};

exports.deleteCheques = async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('ChequeID', sql.Int, id)
      .query('DELETE FROM Cheques WHERE ChequeID = @ChequeID');
    res.status(200).json({ message: 'Cheque deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete cheque' });
  }
};
