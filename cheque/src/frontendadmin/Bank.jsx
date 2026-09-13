import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Bank.css';
import axios from 'axios';

const Bank = () => {
  const navigate = useNavigate();
  const [report, setreport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [bankName, setBankName] = useState('');
  const [bankList, setBankList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    const res = await axios.get('http://localhost:5000/api/banks');
    setBankList(res.data);
  };

  const handleAddBank = async () => {
    if (!bankName.trim()) return;
    await axios.post('http://localhost:5000/api/banks', { bankName });
    setBankName('');
    fetchBanks();
  };

  const handleDeleteBank = async (id) => {
    await axios.delete(`http://localhost:5000/api/banks/${id}`);
    fetchBanks();
  };

  const handledashboard =() => {
    navigate('/dashboard')
  };
  const handleParty =() =>{
    navigate('/addparty');
  };
  const handleDemo = () =>{
    navigate('/demo');
  };
  const handleIssueCheque = () => {
    navigate('/issuecheque');
  };
  const handleDemoReports = () => {
    navigate('/demoreport');
  };
  const handleReports = () => {
    navigate('/reports');
  };
  const handleAddUser = () => {
    navigate('/adduser');
  };
  const handleEditUser = () => {
    navigate('/edituser'); 
  };
  const handleLogout = () => {
    navigate('/login'); 
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <button className='side'onClick={handledashboard}>Dashboard</button>
        <hr className="sidebar-line" /> <br />

        
        <button onClick={handleParty} className="sidebar-button"> Supplier</button>
        <button className="sidebar-button">Bank</button>
        <button className='sidebar-button' onClick={handleDemo}> Purchase</button>
        <button className="sidebar-button" onClick={handleIssueCheque}>Issue Cheque</button>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setreport(!report)}>Reports</button>
          {report && (
            <div className="users">
              <button onClick={handleDemoReports}>• Purchase reports</button> <br/>
              <button onClick={handleReports}>• Cheque reports</button> <br />
            </div>
          )}
        </div>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>Users</button>
          {userMenuOpen && (
            <div className="user-submenu">
              <button onClick={handleAddUser}>• Add User</button> <br />
              <button onClick={handleEditUser}>• Edit User</button> <br />
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-button">Settings</button>
          <button className="sidebar-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="bank-content">
        <button className="hamburgerss" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <h2 className='add-title'>Add Bank</h2>
        <input
          type="text"
          placeholder="Enter Bank Name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="bank-input"
        />
        <button className="add-bank-button" onClick={handleAddBank}>Add Bank</button>

        <h3 style={{ marginTop: '30px' }}>Bank List</h3>

        <table className="bank-table">
          <thead>
            <tr>
              <th >Bank Name</th>
              <th >Action</th>
            </tr>
          </thead>
          <tbody>
            {bankList.map((bank) => (
              <tr key={bank.BankID}>
                <td>{bank.BankName}</td>
                <td>
                  <button className="bank-delete-button" onClick={() => handleDeleteBank(bank.BankID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bank;
