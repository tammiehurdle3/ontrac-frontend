// src/components/PaymentModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import PaymentStatusAnimation from './PaymentStatusAnimation';
import StripeTrustBadge from './StripeTrustBadge';
import CardIcon from './CardIcon';
import { number as validateCardNumber } from 'card-validator';

function PaymentModal({ show, onClose, amount, shipmentId }) {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const cardNameRef = useRef(null);
  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const cvvRef = useRef(null);
  const billingAddressRef = useRef(null);

  const handleNameChange = (e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
  const handleCardNumberChange = (e) => {
      const rawValue = e.target.value.replace(/\s/g, '');
      const validation = validateCardNumber(rawValue);
      setCardType(validation.card ? validation.card.type : null);
      const formattedValue = rawValue.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardNumber(formattedValue);
  };
  const handleExpiryChange = (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 2) {
          value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
      }
      setExpiryDate(value);
  };
  const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, ''));
  const handleKeyDown = (e, nextFieldRef) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          nextFieldRef.current?.focus();
      }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('loading');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
      
      const response = await fetch(`${baseUrl}/api/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment: shipmentId,
          cardholderName: cardName,
          billingAddress: billingAddress,
          cardNumber: cardNumber,
          expiryDate: expiryDate,
          cvv: cvv,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed on the server.');
      }

      setSubmitStatus('success');
      setTimeout(handleClose, 2500);

    } catch (err) {
      setSubmitStatus('failed');
    }
  };

  const handleClose = () => {
    setTimeout(() => {
        setSubmitStatus('idle');
        setCardName('');
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setBillingAddress('');
    }, 300)
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className={`modal-overlay ${show ? 'visible' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Secure Payment for Shipment</h2>
          <button onClick={handleClose} className="close-button">&times;</button>
        </div>
        
        {submitStatus === 'loading' && (
          <div className="spinner-container"><div className="spinner"></div><p>Processing...</p></div>
        )}
        
        {(submitStatus === 'failed' || submitStatus === 'success') && (
          <PaymentStatusAnimation status={submitStatus} />
        )}

        {submitStatus === 'idle' && (
          <>
            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-group">
                <label htmlFor="card-name">Name on Card</label>
                <input ref={cardNameRef} onKeyDown={(e) => handleKeyDown(e, cardNumberRef)} type="text" id="card-name" value={cardName} onChange={handleNameChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="card-number">Card Number</label>
                <div className="card-input-wrapper">
                  <input ref={cardNumberRef} onKeyDown={(e) => handleKeyDown(e, expiryDateRef)} type="text" id="card-number" className={cardType ? 'has-card-icon' : ''} value={cardNumber} onChange={handleCardNumberChange} placeholder="1234 5678 9012 3456" maxLength="19" required />
                  <CardIcon cardType={cardType} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry-date">Expiry (MM/YY)</label>
                  <input ref={expiryDateRef} onKeyDown={(e) => handleKeyDown(e, cvvRef)} type="text" id="expiry-date" value={expiryDate} onChange={handleExpiryChange} placeholder="MM / YY" maxLength="7" required />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input ref={cvvRef} onKeyDown={(e) => handleKeyDown(e, billingAddressRef)} type="text" id="cvv" value={cvv} onChange={handleCvvChange} placeholder="123" maxLength="4" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="billing-address">Billing Address</label>
                <input ref={billingAddressRef} type="text" id="billing-address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} required />
              </div>
              <button type="submit" className="button payment-submit-btn">{`Pay $${amount ? Number(amount).toFixed(2) : '0.00'}`}</button>
            </form>
            <StripeTrustBadge />
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;