import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
        });
        setSummary(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };
    fetchSummary();
  }, []);
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container mt-3">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }
  if (!summary) return null;
  return (
    <div>
      <Navbar />
      <div className="container mt-3">
        <h2>Dashboard</h2>
        <div className="row">
          <div className="col">
            <div className="card p-3"><strong>Total Products:</strong> {summary.totalProducts}</div>
          </div>
          <div className="col">
            <div className="card p-3"><strong>Total Contacts:</strong> {summary.totalContacts}</div>
          </div>
          <div className="col">
            <div className="card p-3"><strong>Total Revenue:</strong> ${summary.totalRevenue.toFixed(2)}</div>
          </div>
          <div className="col">
            <div className="card p-3"><strong>Total Profit:</strong> ${summary.totalProfit.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}


