// src/components/CouponPayment.jsx
import React, { useState } from 'react';

function CouponPayment({ shipmentId }) {
  const [couponCode, setCouponCode] = useState('');
  const [validationStatus, setValidationStatus] = useState('idle'); // idle | loading | success
  const [message, setMessage] = useState('');

  const handleValidate = () => {
    if (!couponCode) return;
    setValidationStatus('loading');
    setMessage('Verifying your coupon code, please wait...');

    // Simulate a network call for 2.5 seconds
    setTimeout(() => {
      setValidationStatus('success');
      setMessage('Coupon applied! Your payment has been confirmed.');
    }, 2500);
  };

  return (
    <div className="coupon-payment-container">
      <h4>Pay with Coupon</h4>
      <p>Please enter your payment coupon code below to validate your payment.</p>
      
      {validationStatus === 'idle' && (
        <>
          <div className="form-group">
            <label htmlFor="coupon-code">Coupon Code</label>
            <input 
              type="text" 
              id="coupon-code" 
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter your code here"
            />
          </div>
          <button 
            onClick={handleValidate} 
            className="button payment-submit-btn"
          >
            Apply Coupon
          </button>
        </>
      )}

      {(validationStatus === 'loading' || validationStatus === 'success') && (
        <div className={`validation-message ${validationStatus}`}>
          {validationStatus === 'loading' ? (
            <div className="mini-spinner"></div>
          ) : (
            <i className="fa-solid fa-check-circle success-icon"></i>
          )}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default CouponPayment;