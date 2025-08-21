import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };
  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="brand">CRM</span>
        <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
        <NavLink to="/form" className="nav-link">Add Product</NavLink>
        <NavLink to="/table-view" className="nav-link">Table</NavLink>
        <NavLink to="/visualization" className="nav-link">Charts</NavLink>
        <NavLink to="/contacts" className="nav-link">Contacts</NavLink>
      </div>
      <div className="nav-right">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}


