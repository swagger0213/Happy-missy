import React, { useState } from 'react';
import './AddUser.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBars } from 'react-icons/fa';

const AddUser = () => {
  const navigate = useNavigate();
  const [report, setreport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    return password.length >= 6 && /^[A-Z]/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(form.password)) {
      alert('Password must start with a capital letter and be at least 6 characters long.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/users', {
        username: form.username,
        firstName: form.firstName,
        lastName: form.lastName,
        password: form.password
      });
      alert(response.data.message);
      setForm({
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      alert('Failed to add user. Please try again.');
      console.error(error);
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
              <button onClick={() => navigate('/demoreport')}>• Purchase reports</button> <br />
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

      <main className="adduser-container">
        <button className="ham" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <div className="adduser-card">
          <p className="adduser-title">Create New User</p>
          <form className="adduser-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" value={form.username} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </div>
            <button type="submit" className="adduser-register-button">Register</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddUser;
