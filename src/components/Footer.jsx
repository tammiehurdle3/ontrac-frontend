// src/components/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column-main">
            <a href="/">
              <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" className="footer-logo"/>
            </a>
            <div className="footer-bottom">
              <div className="legal-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms & Conditions</a>
              </div>
              <small>© 2025 OnTrac. All rights reserved.</small>
            </div>
          </div>
          <div className="footer-column-links">
            <h4>E-Commerce Delivery</h4>
            <a href="#">Residential Delivery</a>
            <a href="#">Transcontinental</a>
            <a href="#">Everyday Delivery</a>
          </div>
          {/* UPDATED: Added Contact Us column */}
          <div className="footer-column-links">
            <h4>Contact Us</h4>
            <a href="mailto:support@ontracourier.us">support@ontracourier.us</a>
            <a href="mailto:support@ontracourier.co">support@ontracourier.co</a>
            <a href="tel:+17077875797">+1 (707) 787 5797</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;