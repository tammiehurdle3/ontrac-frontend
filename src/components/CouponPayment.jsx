import React, { useState } from 'react';

function CouponPayment({ shipmentId, onSuccess }) {
  const [couponCode, setCouponCode] = useState('');
  const [validationStatus, setValidationStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleValidate = async () => {
    if (!couponCode) {
      setValidationStatus('error');
      setMessage('Please enter a coupon code.');
      return;
    }
    setValidationStatus('loading');
    setMessage('Verifying your coupon code, please wait...');

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${baseUrl}/api/submit-voucher/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, shipment_id: shipmentId }),
      });
      const data = await response.json();
      if (response.ok) {
        setValidationStatus('success');
        setMessage(data.message || 'Voucher submitted! Awaiting admin approval.');
        if (onSuccess) onSuccess(); // Trigger your existing success handler
      } else {
        setValidationStatus('error');
        setMessage(data.error || 'Invalid code. Try again.');
      }
    } catch (error) {
      setValidationStatus('error');
      setMessage('Network error. Please try again.');
    }
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

      {(validationStatus === 'loading' || validationStatus === 'success' || validationStatus === 'error') && (
        <div className={`validation-message ${validationStatus}`}>
          {validationStatus === 'loading' ? (
            <div className="mini-spinner"></div>
          ) : validationStatus === 'success' ? (
            <i className="fa-solid fa-check-circle success-icon"></i>
          ) : (
            <i className="fa-solid fa-exclamation-circle error-icon"></i>
          )}
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default CouponPayment;