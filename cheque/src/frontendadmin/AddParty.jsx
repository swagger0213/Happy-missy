import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addparty.css'; 
import axios from 'axios';

const AddParty = () => {
  const navigate = useNavigate();
  const [report, setreport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [partyName, setPartyName] = useState('');
  const [partyList, setPartyList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchParties();
  }, []);

  const fetchParties = async () => {
    const res = await axios.get('http://localhost:5000/api/parties');
    setPartyList(res.data);
  };

  const handleAddParty = async () => {
    if (!partyName.trim()) return;
    await axios.post('http://localhost:5000/api/parties', { partyName });
    setPartyName('');
    fetchParties();
  };

  const handleDeleteParty = async (id) => {
    await axios.delete(`http://localhost:5000/api/parties/${id}`);
    fetchParties();
  };

  const handleDashboard = () => {
    navigate('/dashboard')
  };
  const handleBank = () => {
    navigate('/bank');
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
        <button className='side'onClick={handleDashboard}>Dashboard</button>
        <hr className="sidebar-line" /> <br/>

          
          <button className="sidebar-button"> Supplier</button>
          <button className="sidebar-button" onClick={handleBank}>Bank</button>
          <button className='sidebar-button' onClick={handleDemo}> Purchase</button>
          <button className="sidebar-button"onClick={handleIssueCheque}>Issue Cheque</button>
          
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

      <div className="party-content">
        <button className="hamburgers" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <h2 className='add-supplier'>Add Supplier</h2> <br />
        <input
          type="text"
          value={partyName}
          placeholder="Enter supplier name"
          onChange={(e) => setPartyName(e.target.value)}
          className='party-input'
        />
        <button className="add-supplier-button" onClick={handleAddParty}>Add Supplier</button>

          <h3 style={{ marginTop: '30px' }}>Supplier List</h3>

            <table className="party-table">
              <thead>
                <tr>
                  <th>Supplier Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {partyList.map((party) => (
                  <tr key={party.PartyID}>
                    <td>{party.PartyName}</td>
                    <td>
                      <button className="delete-button" onClick={() => handleDeleteParty(party.PartyID)}>
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

export default AddParty
