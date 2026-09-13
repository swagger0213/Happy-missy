import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

const Reports = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('week');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [cheques, setCheques] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [report, setreport] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCheques = async () => {
    const res = await axios.get('http://localhost:5000/api/Cheques');
    setCheques(res.data);
  };
  useEffect(() => {
    fetchCheques(); 
  }, []);

  const handleDelete = async (chequeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/Cheques/${chequeId}`);
      alert('Cheque deleted successfully');
      setCheques(prev => prev.filter(cheque => cheque.ChequeID !== chequeId));
    } catch (err) {
      console.error('Error deleting cheque:', err);
      alert('Failed to delete cheque');
    }
  };

  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const isInSelectedRange = (dateStr) => {
    const date = new Date(dateStr);
    if (filter === 'week') return date >= startOfWeek;
    if (filter === 'month') return date >= startOfMonth;
    if (filter === 'year') return date >= startOfYear;
    return true;
  };

  const filteredCheques = cheques
    .filter(cheque => isInSelectedRange(cheque.DateIssued))
    .filter(cheque =>
      cheque.PaidTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.BankName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cheque.ChequeNo?.toString().includes(searchTerm) ||
      cheque.BillNo?.toString().includes(searchTerm)
    )
    .sort((a, b) => new Date(b.DateIssued) - new Date(a.DateIssued));

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className='side' onClick={() => navigate('/dashboard')}>Dashboard</button>
        <hr className="sidebar-line" /> <br />

        <button className="sidebar-button" onClick={() => navigate('/addparty')}>Supplier</button>
        <button className="sidebar-button" onClick={() => navigate('/bank')}>Bank</button>
        <button className='sidebar-button' onClick={() => navigate('/demo')}> Purchase</button>
        <button className="sidebar-button" onClick={() => navigate('/issuecheque')}>Issue Cheque</button>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setreport(!report)}>Reports</button>
          {report && (
            <div className="users">
              <button onClick={() => navigate('/demoreport')}>• Purchase reports</button> <br/>
              <button onClick={() => navigate('/reports')}>• Cheque reports</button> <br />
            </div>
          )}
        </div>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>Users</button>
          {userMenuOpen && (
            <div className="user-submenu">
              <button onClick={() => navigate('/adduser')}>• Add User</button> <br />
              <button onClick={() => navigate('/edituser')}>• Edit User</button> <br />
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-button">Settings</button>
          <button className="sidebar-button" onClick={() => navigate('/login')}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
          <label>Filter: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search"
          />
        </div>

        <div className="stat-row">
          <label>Number of Cheques Issued</label>
          <input className="stat-input" readOnly value={filteredCheques.length} />
        </div>

        <div className="stat-row">
          <label>Total Cheque Amount</label>
          <input 
            className="stat-input"
            readOnly
            value={filteredCheques.reduce((sum, cheque) => sum + Number(cheque.ChequeAmount || 0), 0)}
          />
        </div>
        <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />

        <div className="table-container">
          <table className="cheque-table">
            <thead>
              <tr>
                <th>Paid To</th>
                <th>Bank Name</th>
                <th>Account Type</th>
                <th>Account Number</th>
                <th>Cheque No</th>
                <th>Amount</th>
                <th>Bill No</th>
                <th>Issue Date</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCheques.map(cheque => (
                <tr key={cheque.ChequeID}>
                  <td>{cheque.PaidTo}</td>
                  <td>{cheque.BankName}</td>
                  <td>{cheque.AccountType}</td>
                  <td>{cheque.AccountNumber}</td>
                  <td>{cheque.ChequeNo}</td>
                  <td>{cheque.ChequeAmount}</td>
                  <td>{cheque.BillNo}</td>
                  <td>{cheque.DateIssued}</td>
                  <td>{cheque.Description}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(cheque.ChequeID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
