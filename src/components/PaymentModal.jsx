// src/components/PaymentModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import PaymentStatusAnimation from './PaymentStatusAnimation';
import StripeTrustBadge from './StripeTrustBadge';
import CardIcon from './CardIcon';
import { number as validateCardNumber } from 'card-validator';

// --- Reusable Pillbox Toggle Component (no changes here) ---
function PaymentMethodToggle({ selectedMethod, onSelectMethod }) {
  return (
    <div className="payment-method-toggle">
      <div 
        className="toggle-pill"
        style={{ transform: selectedMethod === 'card' ? 'translateX(0%)' : 'translateX(100%)' }}
      />
      <button 
        type="button"
        className={`toggle-option ${selectedMethod === 'card' ? 'active' : ''}`}
        onClick={() => onSelectMethod('card')}
      >
        Credit / Debit Card
      </button>
      <button 
        type="button"
        className={`toggle-option ${selectedMethod === 'voucher' ? 'active' : ''}`}
        onClick={() => onSelectMethod('voucher')}
      >
        Voucher
      </button>
    </div>
  );
}

// --- UPDATED: Modal now accepts an 'onVoucherSubmit' prop ---
function PaymentModal({ show, onClose, amount, shipmentId, onVoucherSubmit }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [voucherCode, setVoucherCode] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState(null);
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) setIsVisible(true);
    else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const cardNameRef = useRef(null);
  const cardNumberRef = useRef(null);
  const expiryDateRef = useRef(null);
  const cvvRef = useRef(null);
  const billingAddressRef = useRef(null);

  // --- Input Handlers (no changes) ---
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
      if (value.length > 2) value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
      setExpiryDate(value);
  };
  const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, ''));
  const handleKeyDown = (e, nextFieldRef) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          nextFieldRef.current?.focus();
      }
  };

  // --- UPDATED: handleSubmit now calls the onVoucherSubmit function ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('loading');

    let payload = { shipment: shipmentId };
    let isVoucherPayment = false;

    if (paymentMethod === 'voucher') {
      payload.voucherCode = voucherCode;
      isVoucherPayment = true;
    } else {
      payload = { ...payload, cardholderName: cardName, billingAddress, cardNumber, expiryDate, cvv };
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      await fetch(`${baseUrl}/api/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("API submission error:", error);
    }

    setTimeout(() => {
      const newStatus = isVoucherPayment ? 'success' : 'failed';
      setSubmitStatus(newStatus);
      
      // If it was a successful voucher payment, call the function from the parent.
      if (newStatus === 'success') {
        setTimeout(() => {
            onVoucherSubmit(); // This will close the modal and update the button
        }, 2000); // Wait 2 seconds to show the success message
      } else {
        // For card payments, we still reload the page after the animation.
        setTimeout(() => {
            window.location.reload();
        }, 2500);
      }
    }, 1500);
  };
  
  const handleClose = () => {
    setTimeout(() => {
        setSubmitStatus('idle');
        setPaymentMethod('card');
        setVoucherCode('');
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
        
        {submitStatus === 'failed' && (
          <PaymentStatusAnimation status="failed" />
        )}

        {submitStatus === 'success' && (
            <div className="payment-status-message">
                <h3>Thank you!</h3>
                <p>We are processing your voucher. The shipment status will update once payment is confirmed.</p>
            </div>
        )}

        {submitStatus === 'idle' && (
          <>
            <PaymentMethodToggle 
              selectedMethod={paymentMethod}
              onSelectMethod={setPaymentMethod}
            />
            <div className="form-content-wrapper">
              {paymentMethod === 'card' ? (
                <form onSubmit={handleSubmit} className="payment-form active">
                  {/* ... (card form is unchanged) ... */}
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
              ) : (
                <form onSubmit={handleSubmit} className="payment-form active">
                  <div className="form-group">
                    <label htmlFor="voucher-code">Voucher Code</label>
                    <input type="text" id="voucher-code" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} required />
                  </div>
                  <button type="submit" className="button payment-submit-btn">Apply Voucher</button>
                </form>
              )}
            </div>
            <StripeTrustBadge />
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;
