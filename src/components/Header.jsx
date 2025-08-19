// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" />
        </Link>
        <nav className="main-nav">
          <a href="#services">Delivery Solutions</a>
          <a href="#community">Community</a>
          <a href="#knowledge">Knowledge Center</a>
        </nav>
        {/* UPDATED: Added 'button' and 'button-header' classes for styling */}
        <Link to="/" className="button button-header">
          Track <span>your package</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;