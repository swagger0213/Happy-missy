import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './Login.css';
import { FaUser, FaLock } from 'react-icons/fa';
import navLogo from '../assets/logoo.jpg';
import sideImage from '../assets/logo1.jpg';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }
    if (!password.trim()) {
      alert("Please enter a password.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (data.success) {
        if (data.role === 'admin') {
          navigate('/dashboard');
        } else if (data.role === 'user') {
          navigate('/dashboarduser');
        }
      } else {
        alert("Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="navbar-content">
          <img src={navLogo} alt="Logo" className="navbar-logo" />
        </div>
      </div>

      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-left">
            <img src={sideImage} alt="Login Illustration" className="login-image" />
          </div>

          <div className="login-right">
            <div className="login-card">
              <h2>Login</h2>
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </span>
              </div>
              <div className="options">
                <label><input type="checkbox" /> Remember me</label>
                <span className="forgot">Forgot password?</span>
              </div>
              <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
          </div>
        </div>
      </div>
      <footer className="login-footer">
        <div className="footer-content">
          <p>
            Happy Missy 2025. © All Rights Reserved.{' '}
          </p> <br />
          <a href="http://www.pandainformatics.com/" target="_blank" rel="noopener noreferrer">
              Powered by Panda Informatics
            </a>
        </div>
      </footer>
    </>
  );
}

export default Login;
