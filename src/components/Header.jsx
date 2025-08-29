// src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom'; // Use NavLink for active styles

function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" />
        </Link>
        <nav className="main-nav">
          {/* Using NavLink for potential active styling */}
          <NavLink to="/delivery-solutions">Delivery Solutions</NavLink>
          {/* --- ADD THE NEW LINK --- */}
          <NavLink to="/about-us">About Us</NavLink>
          <NavLink to="/knowledge-center">Knowledge Center</NavLink>
        </nav>
        <Link to="/" className="button button-header">
          Track <span>your package</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;
