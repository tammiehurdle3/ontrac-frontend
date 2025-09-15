// src/components/SubscriptionForm.jsx
import React from 'react';

function SubscriptionForm() {
  // This is a basic form handler to prevent the page from reloading.
  // In a real application, you would connect this to Brevo's API.
  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you for subscribing!');
  };

  return (
    <div className="subscription-form-container" style={{ textAlign: 'center', padding: '40px 0' }}>
      <h2>Subscribe to our newsletter</h2>
      <p>Get the latest news and updates directly in your inbox.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input type="text" placeholder="Enter your name" required style={{ padding: '10px', width: '300px', maxWidth: '100%' }} />
        </div>
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <input type="email" placeholder="Enter your email" required style={{ padding: '10px', width: '300px', maxWidth: '100%' }} />
        </div>
        {/* THIS IS THE CRUCIAL PART FOR BREVO */}
        <div className="form-group" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <input type="checkbox" id="consent" name="consent" required style={{ marginRight: '10px' }} />
          <label htmlFor="consent">
            I agree to receive marketing emails from OnTrac.
          </label>
        </div>
        <button type="submit" className="button">Subscribe</button>
      </form>
    </div>
  );
}

export default SubscriptionForm;