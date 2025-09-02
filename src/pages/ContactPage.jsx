import React from 'react';

function ContactPage() {
  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-header">
          <h1 className="contact-title">Get in Touch</h1>
          <p className="contact-subtitle">
            We're here to help. Whether you have a question about a shipment, a partnership inquiry, or need support, our team is ready to answer your questions.
          </p>
        </div>
        <div className="contact-grid">
          <div className="contact-details">
            <h3>Contact Information</h3>
            <p>For direct inquiries, please use the contact details below. We typically respond within 24 business hours.</p>
            <ul className="contact-info-list">
              <li>
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:support@ontracourier.us">support@ontracourier.us</a>
              </li>
              <li>
                <i className="fa-solid fa-envelope"></i>
                <a href="mailto:support@ontracourier.co">support@ontracourier.co</a>
              </li>
              <li>
                <i className="fa-solid fa-phone"></i>
                <a href="tel:+17077875797">+1 (707) 787 5797</a>
              </li>
            </ul>
          </div>
          <div className="contact-form-container">
            <h3>Send us a Message</h3>
            {/* Netlify Form: data-netlify="true" enables submission handling */}
            <form name="contact" method="POST" data-netlify="true" className="contact-form">
              {/* This hidden input is required for Netlify forms */}
              <input type="hidden" name="form-name" value="contact" />
              
              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input type="text" id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" required />
              </div>
              <div className="form-group">
                <label htmlFor="message">Your Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
              </div>
              <button type="submit" className="button">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;

