// src/components/PaymentStatusAnimation.jsx
import React from 'react';

function PaymentStatusAnimation({ status }) {
  if (status !== 'failed') return null;

  return (
    <div className="status-animation-container">
      <svg className="status-svg" viewBox="0 0 52 52">
        <g className="card-group">
          <rect x="1" y="15" width="42" height="22" rx="3" className="card-body" />
          <rect x="1" y="20" width="42" height="5" className="card-stripe" />
        </g>
        <g className="cross-group">
          <line x1="16" y1="16" x2="36" y2="36" className="cross-line" />
          <line x1="36" y1="16" x2="16" y2="36" className="cross-line" />
        </g>
      </svg>
      <p className="status-text">Card not charged</p>
    </div>
  );
}

export default PaymentStatusAnimation;