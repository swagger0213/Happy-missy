import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import './Issuecheque.css';

const Issuecheque = () => {
  const navigate = useNavigate();
  const [report, setreport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filter, setFilter] = useState('week');
  const [cheques, setCheques] = useState([]);
  const [banks, setBanks] = useState([]);
  const [parties, setParties] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  const [formData, setFormData] = useState({
    paidTo: '',
    bankName: '',
    accountType: '',
    accountNumber: '',
    chequeNo: '',
    chequeAmount: '',
    billNo: '',
    issueDate: null,
    description: ''
  });

  const fetchCheques = async () => {
    const res = await axios.get('http://localhost:5000/api/Cheques');
    setCheques(res.data);
  };
  useEffect(() => {
    fetchCheques();
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      const res = await axios.get('http://localhost:5000/api/banks');
      setBanks(res.data);
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    const fetchParties = async () => {
      const res = await axios.get('http://localhost:5000/api/parties');
      setParties(res.data);
    };
    fetchParties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formattedDate = formData.issueDate
        ? format(formData.issueDate, 'yyyy-MM-dd')
        : '';

      const response = await axios.post('http://localhost:5000/api/Cheques', formData);
      alert('Cheque issued successfully');

      setFormData({
        paidTo: '',
        bankName: '',
        accountType: '',
        accountNumber: '',
        chequeNo: '',
        chequeAmount: '',
        billNo: '',
        issueDate: formattedDate,
        description: ''
      });

      setSuggestions([]);
      await fetchCheques();
      navigate('/issuecheque');
    } catch (err) {
      console.error('Error issuing cheque:', err);
      alert('Failed to issue cheque');
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'paidTo') {
      const filtered = parties.filter(p =>
        p.PartyName.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
    }
  };

  const handleSuggestionClick = (name) => {
    setFormData({ ...formData, paidTo: name });
    setSuggestions([]);
  };

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const isInSelectedRange = (dateStr) => {
    const date = new Date(dateStr);
    if (filter === 'week') return date >= startOfWeek;
    if (filter === 'month') return date >= startOfMonth;
    if (filter === 'year') return date >= startOfYear;
    return true;
  };

  const filteredCheques = cheques.filter(c => isInSelectedRange(c.DateIssued));

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className='side' onClick={() => navigate('/dashboard')}>Dashboard</button>
        <hr className="sidebar-line" /> <br/>

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
      <button className="hambuo" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
      <div className="issue-content">
        <div className="top-bar">
          <label style={{marginLeft:"0%", marginTop:'-30px'}}>Filter: </label>
          <select style={{marginRight:"100%"}} value={filter} onChange={(e) => setFilter(e.target.value)} >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        <div className="stat-row">
          <label>Number of Cheques Issued</label>
          <input className="stat-input" readOnly value={filteredCheques.length} /> 
        </div>

        <div className="stat-row">
          <label>Total Cheque Amount</label>
          <input className="stat-input" readOnly value={filteredCheques.reduce((sum, cheque) => sum + Number(cheque.ChequeAmount || 0), 0)} />
        </div>

        <hr style={{ margin: '20px 0', borderTop: '2px solid #ccc'}} />

        <div className="cheque-form-container">
          <h3>Issue Cheque</h3>
          <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />
          <form className="cheque-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Paid to:</label>
              <input
                type="text"
                name="paidTo"
                value={formData.paidTo}
                onChange={handleChange}
                autoComplete="off"
              />
              {suggestions.length > 0 && (
                <ul className="suggestions">
                  {suggestions.map((s, i) => (
                    <li key={i} onClick={() => handleSuggestionClick(s.PartyName)}>
                      {s.PartyName}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label>Bank:</label>
              <select name="bankName" value={formData.bankName} onChange={handleChange}>
                <option value="">Select Bank</option>
                {banks.map(bank => (
                  <option key={bank.BankID} value={bank.BankName}>{bank.BankName}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Account Type:</label>
              <select name="accountType" value={formData.accountType} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="Saving">Saving</option>
                <option value="Current">Current</option>
                <option value="Over Draft">Over Draft</option>
              </select>
            </div>

            <div className="form-group">
              <label>Account Number:</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                disabled={!formData.bankName}
              />
            </div>

            <div className="form-group">
              <label>Cheque No:</label>
              <input type="text" name="chequeNo" value={formData.chequeNo} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cheque Amount:</label>
              <input type="text" name="chequeAmount" value={formData.chequeAmount} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Paid Against Bill No:</label>
              <input type="text" name="billNo" value={formData.billNo} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Issue Date (dd/mm/yyyy):</label>
              <DatePicker
                selected={formData.issueDate}
                onChange={(date) => setFormData({ ...formData, issueDate: date })}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange} />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Issuecheque;
