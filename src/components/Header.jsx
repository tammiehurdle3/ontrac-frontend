import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

// A simple SVG for the hamburger icon
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// A simple SVG for the close (X) icon
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="main-header">
        <div className="container">
          <Link to="/" className="logo" onClick={handleLinkClick}>
            <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" />
          </Link>
          
          {/* --- DESKTOP NAVIGATION (Hidden on mobile) --- */}
          <nav className="main-nav">
            <NavLink to="/delivery-solutions">Delivery Solutions</NavLink>
            <NavLink to="/about-us">About Us</NavLink>
            <NavLink to="/knowledge-center">Knowledge Center</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          
          {/* --- RIGHT-SIDE CONTROLS --- */}
          <div className="header-controls">
            {/* This button now links back to the homepage as requested */}
            <Link to="/" className="button button-header">
              Track <span>your package</span>
            </Link>

            {/* --- THIS IS THE NEW LINE YOU NEED TO ADD --- */}
            {/* The Google script will find this div and place the dropdown here */}
            <div id="google_translate_element"></div>

            {/* HAMBURGER MENU TOGGLE (Hidden on desktop) */}
            <button className="mobile-nav-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE NAVIGATION MENU --- */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <nav>
          <NavLink to="/delivery-solutions" onClick={handleLinkClick}>Delivery Solutions</NavLink>
          <NavLink to="/about-us" onClick={handleLinkClick}>About Us</NavLink>
          <NavLink to="/knowledge-center" onClick={handleLinkClick}>Knowledge Center</NavLink>
          <NavLink to="/contact" onClick={handleLinkClick}>Contact</NavLink>
        </nav>
        {/* We keep the original track button in the mobile menu for easy access */}
        <Link to="/" className="button button-mobile-track" onClick={handleLinkClick}>
          Track Your Package
        </Link>
      </div>
    </>
  );
}

export default Header;