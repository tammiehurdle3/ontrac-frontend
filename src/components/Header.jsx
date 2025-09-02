import React from 'react';
import { Link, NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">
          <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" />
        </Link>
        <nav className="main-nav">
          <NavLink to="/delivery-solutions">Delivery Solutions</NavLink>
          <NavLink to="/about-us">About Us</NavLink>
          <NavLink to="/knowledge-center">Knowledge Center</NavLink>
          {/* --- ADD THE NEW LINK --- */}
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <Link to="/" className="button button-header">
          Track <span>your package</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;

