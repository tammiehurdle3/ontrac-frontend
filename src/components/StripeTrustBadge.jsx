// src/components/StripeTrustBadge.jsx
import React from 'react';

function StripeTrustBadge() {
  return (
    <div className="stripe-trust-badge">
      <svg className="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 117.5 0v3h-7.5v-3z" />
      </svg>
      <span>Secure payment by <strong>Stripe</strong></span>
    </div>
  );
}

export default StripeTrustBadge;