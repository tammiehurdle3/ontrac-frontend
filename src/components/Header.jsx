import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Snowfall from 'react-snowfall';
import { motion } from 'framer-motion';

// --- ICONS (Kept from your original) ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- PROFESSIONAL SANTA HAT ---
const SantaHat = () => (
  <motion.svg
    animate={{ y: [0, -4, 0], rotate: [-15, -12, -15] }}
    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    style={{
      position: 'absolute',
      top: '-18px',
      left: '120px',
      width: '35px',
      zIndex: 10,
      filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.2))',
      pointerEvents: 'none'
    }}
    viewBox="0 0 50 50"
  >
    <path d="M10,40 Q25,10 40,40 Z" fill="#C41E3A" /> 
    <circle cx="25" cy="12" r="5" fill="white" />
    <rect x="8" y="35" width="34" height="8" rx="4" fill="white" />
  </motion.svg>
);

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="main-header" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Luxury Snow Effect */}
        <Snowfall 
          color="#ffffff"
          snowflakeCount={30}
          speed={[0.2, 0.5]} 
          radius={[0.5, 1.5]}
          style={{ opacity: 0.6 }}
        />

        <div className="container">
          <Link to="/" className="logo" style={{ position: 'relative' }} onClick={handleLinkClick}>
            <SantaHat />
            <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" />
          </Link>
          
          <nav className="main-nav">
            <NavLink to="/delivery-solutions">Delivery Solutions</NavLink>
            <NavLink to="/about-us">About Us</NavLink>
            <NavLink to="/knowledge-center">Knowledge Center</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </nav>
          
          <div className="header-controls">
            <Link to="/" className="button button-header">
              Track <span>your package</span>
            </Link>

            <div id="google_translate_element"></div>

            {/* Mobile Toggle (Restored) */}
            <button className="mobile-nav-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Restored) */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <nav>
          <NavLink to="/delivery-solutions" onClick={handleLinkClick}>Delivery Solutions</NavLink>
          <NavLink to="/about-us" onClick={handleLinkClick}>About Us</NavLink>
          <NavLink to="/knowledge-center" onClick={handleLinkClick}>Knowledge Center</NavLink>
          <NavLink to="/contact" onClick={handleLinkClick}>Contact</NavLink>
        </nav>
        <Link to="/" className="button button-mobile-track" onClick={handleLinkClick}>
          Track Your Package
        </Link>
      </div>
    </>
  );
}

export default Header;