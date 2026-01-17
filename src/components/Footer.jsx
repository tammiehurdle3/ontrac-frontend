import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Simple SVG Icons for a clean, professional look without needing a library
const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);


function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    // --- Replace with your Formspree or other form endpoint ---
    const response = await fetch("https://formspree.io/f/xblaqgbj", { 
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    });

    if (response.ok) {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail(''); 
    } else {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };


  return (
    <footer className="main-footer-b">
      <div className="container">
        <div className="footer-cta-section">
          <div className="cta-content">
            <h3>Stay Ahead of Your Shipments</h3>
            <p>Get news, shipping tips, and service updates delivered to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
        {message && <p className={`form-message ${status}`}>{message}</p>}

        <div className="footer-grid-b">
          <div className="footer-column-brand">
            <a href="/">
              <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" className="footer-logo-b"/>
            </a>
            <p className="footer-tagline">Connecting businesses and consumers with reliable, everyday delivery.</p>
            <div className="footer-address">
              <MapPinIcon />
              <span>7400 W Buckeye Rd<br/>Phoenix, AZ 85043</span>
            </div>
          </div>

          <div className="footer-column-links-b">
            <h4>Company</h4>
            <Link to="/about-us">About Us</Link>
            <Link to="/knowledge-center">Knowledge Center</Link>
            <Link to="/newsroom">Newsroom</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/sustainability">Sustainability</Link>
          </div>

          <div className="footer-column-links-b">
            <h4>Shipping Solutions</h4>
            <Link to="/international-shipping">International Shipping</Link>
            <Link to="/business-enterprise">Business & Enterprise</Link>
            <Link to="/d2c-delivery">Direct-to-Consumer (D2C)</Link>
            <Link to="/customs-info">Customs & Duties Info</Link>
          </div>

          <div className="footer-column-links-b">
            <h4>Support</h4>
            <div className="footer-contact-item">
                <MailIcon />
                <a href="mailto:support@ontracourier.us">support@ontracourier.us</a>
            </div>
             <div className="footer-contact-item">
                <MailIcon />
                <a href="mailto:support@ontracourier.co">support@ontracourier.co</a>
            </div>
            <div className="footer-contact-item">
                <PhoneIcon />
                <a href="tel:+17077875797">+1 (707) 787 5797</a>
            </div>
            <Link to="/contact" className="footer-contact-page-link">Contact Us Form</Link>
          </div>
        </div>

        <div className="footer-sub-b">
            <small className="copyright">© {new Date().getFullYear()} OnTrac Logistics, Inc. All rights reserved.</small>
            <div className="legal-links-b">
                <Link to="/privacy-policy">Privacy Policy</Link>
                <span>|</span>
                <Link to="/terms-and-conditions">Terms & Conditions</Link>
                <span>|</span>
                <Link to="/refund-policy">Refund Policy</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

