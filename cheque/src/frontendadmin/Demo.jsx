import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import './Demo.css';

const Demo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData || null;
  const isEditMode = !!editData;

  const [parties, setParties] = useState([]);
  const [report, setReport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    issueDate: null,
    paidTo: '',
    taxableAmount: '',
  });

  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/parties');
        setParties(res.data);
      } catch (error) {
        console.error('Error fetching parties:', error);
      }
    };
    fetchParties();
  }, []);

  useEffect(() => {
    if (!editData) return;

    const formattedIssueDate = editData.IssueDate ? parseISO(editData.IssueDate) : null;
    const amt = parseFloat(editData.TaxableAmount) || 0;
    const v = amt * 0.13;
    const tot = amt + v;

    setFormData({
      issueDate: formattedIssueDate,
      paidTo: editData.PaidTo,
      taxableAmount: editData.TaxableAmount?.toString() ?? '',
    });

    setVat(v.toFixed(2));
    setTotal(tot.toFixed(2));
  }, [editData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === 'taxableAmount') {
        const amount = parseFloat(value) || 0;
        const calculatedVat = amount * 0.13;
        setVat(calculatedVat.toFixed(2));
        setTotal((amount + calculatedVat).toFixed(2));
      }

      if (name === 'paidTo') {
        if (value.trim() !== '') {
          const filtered = parties.filter((p) =>
            p.PartyName.toLowerCase().startsWith(value.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 5));
        } else {
          setSuggestions([]);
        }
      }

      return updated;
    });
  };

  const handleSuggestionClick = (name) => {
    setFormData((prev) => ({ ...prev, paidTo: name }));
    setSuggestions([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.issueDate) {
      alert('Please select an issue date');
      return;
    }

    const formattedDate = format(formData.issueDate, 'yyyy-MM-dd');

    try {
      if (isEditMode) {
        const reportId = editData.id || editData.ReportId; 

        await axios.put(`http://localhost:5000/api/reports/update-report/${reportId.id}`, {
          issueDate: formattedDate,
          paidTo: formData.paidTo,
          taxableAmount: parseFloat(formData.taxableAmount),
          vat: parseFloat(vat),
          total: parseFloat(total),
        });

        alert('Data updated successfully!');
        navigate('/demoreport', { replace: true });
        return;
      }

      await axios.post('http://localhost:5000/api/reports/post-report', {
        issueDate: formattedDate,
        paidTo: formData.paidTo,
        taxableAmount: parseFloat(formData.taxableAmount),
        vat: parseFloat(vat),
        total: parseFloat(total),
      });

      alert('Data saved successfully!');
      navigate('/demo', { replace: true });

      setFormData({ issueDate: null, paidTo: '', taxableAmount: '' });
      setVat(0);
      setTotal(0);
      setSuggestions([]);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save data');
    }
  };

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="side" onClick={() => navigate('/dashboard')}>Dashboard</button>
        <hr className="sidebar-line" /><br />
        <button className="sidebar-button" onClick={() => navigate('/addparty')}>Supplier</button>
        <button className="sidebar-button" onClick={() => navigate('/bank')}>Bank</button>
        <button className="sidebar-button" onClick={() => navigate('/demo')}>Purchase</button>
        <button className="sidebar-button" onClick={() => navigate('/issuecheque')}>Issue Cheque</button>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setReport(!report)}>Reports</button>
          {report && (
            <div className="users">
              <button onClick={() => navigate('/demoreport')}>• Purchase reports</button><br />
              <button onClick={() => navigate('/reports')}>• Cheque reports</button><br />
            </div>
          )}
        </div>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setUserMenuOpen(!userMenuOpen)}>Users</button>
          {userMenuOpen && (
            <div className="user-submenu">
              <button onClick={() => navigate('/adduser')}>• Add User</button><br />
              <button onClick={() => navigate('/edituser')}>• Edit User</button><br />
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-button">Settings</button>
          <button className="sidebar-button" onClick={() => navigate('/login')}>Logout</button>
        </div>
      </div>

      <div className="cheque-demo-container">
        <button className="hamburgersss" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <hr style={{ margin: '30px 0', borderTop: '2px solid #ccc' }} />

        <form className="Demo-form" onSubmit={handleSubmit}>
          <h3>{editData ? 'Edit Purchase' : 'New Purchase'}</h3>

          <label>Issue Date (dd/mm/yyyy):</label>
          <DatePicker
            selected={formData.issueDate}
            onChange={(date) => setFormData((prev) => ({ ...prev, issueDate: date }))}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            className="cussss"
            required
          />

          <div className="form-group-demo">
            <label>Supplier:</label>
            <input
              type="text"
              name="paidTo"
              value={formData.paidTo}
              onChange={handleInputChange}
              autoComplete="off"
              placeholder="Enter supplier name"
              required
            />
            {suggestions.length > 0 && (
              <ul className="suggestionss">
                {suggestions.map((s, i) => (
                  <li key={i} onClick={() => handleSuggestionClick(s.PartyName)}>
                    {s.PartyName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="demooo">
            <label>Total Taxable Amount:</label>
            <input
              type="text"
              name="taxableAmount"
              value={formData.taxableAmount}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="Demooo">
            <label>VAT (13%):</label>
            <input type="text" value={vat} readOnly />
          </div>

          <div className="demoooooo">
            <label>Total Amount (with VAT):</label>
            <input type="text" value={total} readOnly />
          </div>

          <button type="submit" className="submit-button-demo">
            {editData ? 'Update' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Demo;
