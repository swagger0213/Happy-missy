import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditUser.css';

const EditUser = () => {
  const navigate = useNavigate();
  const [report, setreport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${username}`);
        fetchUsers(); 
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };
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
      <div className="user-list-container">
        <button className="hambu" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <h2>All Users</h2>
        <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />
        {users.map((user) => (
          <div key={user.username} className="user-card">
            <div className="avatar-circle">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="username-text">{user.username}</div>
            <button className="delete-button" onClick={() => deleteUser(user.username)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditUser
