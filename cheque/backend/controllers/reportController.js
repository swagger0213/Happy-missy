const { sql, poolPromise } = require('../config/db');

exports.getreport = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM DemoReport ORDER BY Id DESC');
    res.json(result.recordset); 
  } catch (err) {
    console.error('Error fetching report:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.postreport = async (req, res) => {
  const { issueDate, paidTo, taxableAmount, vat, total } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('IssueDate', sql.Date, issueDate)
      .input('PaidTo', sql.NVarChar, paidTo)
      .input('TaxableAmount', sql.Decimal(18, 2), taxableAmount)
      .input('VAT', sql.Decimal(18, 2), vat)
      .input('TotalAmount', sql.Decimal(18, 2), total)
      .query(`
        INSERT INTO DemoReport (IssueDate, PaidTo, TaxableAmount, VAT, TotalAmount)
        VALUES (@IssueDate, @PaidTo, @TaxableAmount, @VAT, @TotalAmount)
      `);
    res.status(200).send('Record saved');
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReports = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request().input('Id', sql.Int, id).query('DELETE FROM DemoReport WHERE Id = @Id');
    res.status(200).send('Deleted');
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReport = async (req, res) => {
  const { id } = req.params;
  const { issueDate, paidTo, taxableAmount, vat, total } = req.body;

  try {
    const pool = await poolPromise;
    await pool.request()
      .input('Id', sql.Int, id)
      .input('IssueDate', sql.Date, issueDate)
      .input('PaidTo', sql.NVarChar, paidTo)
      .input('TaxableAmount', sql.Decimal(18, 2), taxableAmount)
      .input('VAT', sql.Decimal(18, 2), vat)
      .input('TotalAmount', sql.Decimal(18, 2), total)
      .query(`
        UPDATE DemoReport
        SET IssueDate = @IssueDate,
            PaidTo = @PaidTo,
            TaxableAmount = @TaxableAmount,
            VAT = @VAT,
            TotalAmount = @TotalAmount
        WHERE Id = @Id
      `);
    res.status(200).send('Record updated');
  } catch (err) {
    console.error('Error updating report:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

