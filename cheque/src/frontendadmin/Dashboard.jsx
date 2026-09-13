import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('week');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [report, setreport] = useState(false);
  const [cheques, setCheques] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    const fetchCheques = async () => {
      const res = await axios.get('http://localhost:5000/api/Cheques');
      setCheques(res.data);
    };
    fetchCheques();
  }, []);

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
        <button className='side'>Dashboard</button>
        <hr className="sidebar-line" /> <br />

        <button className="sidebar-button" onClick={() => navigate('/addparty')}>Supplier</button>
        <button className="sidebar-button" onClick={() => navigate('/bank')}>Bank</button>
        <button className='sidebar-button' onClick={() => navigate('/demo')}>Purchase</button>
        <button className="sidebar-button" onClick={() => navigate('/issuecheque')}>Issue Cheque</button>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setreport(!report)}>Reports</button>
          {report && (
            <div className="users">
              <button onClick={() => navigate('/demoreport')}>• Purchase reports</button> <br />
              <button onClick={() => navigate('/reports')}>• Cheque reports</button>
            </div>
          )}
        </div>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>Users</button>
          {userMenuOpen && (
            <div className="user-submenu">
              <button onClick={() => navigate('/adduser')}>• Add User</button>
              <button onClick={() => navigate('/edituser')}>• Edit User</button>
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
          <div>
            <label>Filter: </label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
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

        <footer className="dashboard">
        <div className="dash">
          <a href="http://www.pandainformatics.com/" target="_blank" rel="noopener noreferrer">
              Powered by Panda Informatics
            </a>
        </div>
      </footer>
      
      </div>
    </div>
  );
};

export default Dashboard;
