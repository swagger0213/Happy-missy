import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DemoReportuser = () => {
  const navigate = useNavigate();
  const [report, setReport] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchDemoData();
  }, []);

  const fetchDemoData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/get-report');
      setData(res.data);
      setFilteredData(res.data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!fromDate && !toDate) {
      setFilteredData(data);
      return;
    }

    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }

    const from = new Date(fromDate.setHours(0, 0, 0, 0));
    const to = new Date(toDate.setHours(23, 59, 59, 999));

    const filtered = data.filter(item => {
      const issueDate = new Date(item.IssueDate);
      return issueDate >= from && issueDate <= to;
    });

    setFilteredData(filtered);
    setMenuVisibleId(null);
  };

  const handleEdit = (row) => {
    navigate('/demouser', {
      state: {
        editData: {
          _id:            row.Id,
          issueDate:      row.IssueDate,
          paidTo:         row.PaidTo,
          taxableAmount:  row.TaxableAmount.toString(),
        }
      }
    });
    navigate('/demouser', { state: { editData: row } });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this record?");
    if (!confirmDelete) return;
    try {
      await axios.delete(`http://localhost:5000/api/reports/${id}`);
      fetchDemoData();
      setMenuVisibleId(null);
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  const formatDateToDDMMYYYY = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalTaxable = filteredData.reduce((sum, item) => sum + Number(item.TaxableAmount), 0);
  const totalVAT = filteredData.reduce((sum, item) => sum + Number(item.VAT), 0);
  const totalAmount = filteredData.reduce((sum, item) => sum + Number(item.TotalAmount), 0);

  const sortedFilteredData = [...filteredData].sort((a, b) => new Date(b.IssueDate) - new Date(a.IssueDate));

  return (
    <div className="dashboard-container">
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className='side' onClick={() => navigate('/dashboarduser')}>Dashboard</button>
        <hr className="sidebar-line" /> <br /> 

        <button className="sidebar-button" onClick={() => navigate('/addpartyuser')}>Supplier</button>
        <button className='sidebar-button' onClick={() => navigate('/demouser')}>Purchase</button>
        <button className="sidebar-button" onClick={() => navigate('/issuechequeuser')}>Issue Cheque</button>

        <div className="user-menu">
          <button className="sidebar-button" onClick={() => setReport(!report)}>Reports</button>
          {report && (
            <div className="users">
              <button onClick={() => navigate('/demoreportuser')}>• Purchase reports</button><br />
              <button onClick={() => navigate('/reportsuser')}>• Cheque reports</button><br />
            </div>
          )}
        </div>

        <div className="sidebar-bottom">
          <button className="sidebar-button">Settings</button>
          <button className="sidebar-button" onClick={() => navigate('/login')}>Logout</button>
        </div>
      </div>

      <div className="chequcontainer">
        <button className="hambb" onClick={() => setSidebarOpen(!sidebarOpen)}>&#9776;</button>
        <div className="report-header">
          <h3 style={{ fontSize: "30px", marginTop: "-24px", marginLeft:"-10px" }}>Purchase Report</h3>
          <div className="date-filters">
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="From Date"
              className="sssss"
            />
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="To Date"
              className="ram"
            />
            <button className='ssssss' onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="totals-vertical">
          <label>Total Taxable:</label>
          <input className='tttttt' readOnly value={totalTaxable.toFixed(2)} />
        </div>

        <div className="totals-vertical">
          <label>Total VAT:</label>
          <input className='tttttt' readOnly value={totalVAT.toFixed(2)} />
        </div>

        <div className="totals-vertical">
          <label>Total Amount:</label>
          <input className='tttttt' readOnly value={totalAmount.toFixed(2)} />
        </div>

        <div className="reporcontainer">
          <table className="report-table">
            <thead>
              <tr>
                <th>Issue Date</th>
                <th>Supplier</th>
                <th>Taxable Amount</th>
                <th>VAT</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {sortedFilteredData.length > 0 ? (
                sortedFilteredData.map((item) => (
                  <tr key={item.Id}>
                    <td>{formatDateToDDMMYYYY(item.IssueDate)}</td>
                    <td>{item.PaidTo}</td>
                    <td>{item.TaxableAmount}</td>
                    <td>{item.VAT}</td>
                    <td>{item.TotalAmount}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6">No data found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DemoReportuser
