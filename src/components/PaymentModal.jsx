// src/components/PaymentModal.jsx
import React, { useState, useEffect } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

import PaymentStatusAnimation from './PaymentStatusAnimation';
import StripeTrustBadge from './StripeTrustBadge';

// --- Informational Modal with Refined Instructions ---
function VoucherInfoModal({ show, onClose }) {
    if (!show) return null;

    return (
        <div className="info-modal-overlay" onClick={onClose}>
            <div className="info-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="info-modal-header">
                    <h3>How to Pay with a Digital Voucher</h3>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div className="info-modal-body">
                    <ol className="info-steps">
                        <li>
                            <strong>Visit Our Partner Site:</strong> Click the button below to go to MyGiftCardSupply, our trusted digital voucher provider.
                        </li>
                        <li>
                            <strong>Purchase Your Voucher:</strong> On their site, search for "Binance USDT" and select the amount you need. You can use a standard payment method like a credit/debit card or PayPal for the transaction.
                        </li>
                        <li>
                            <strong>Receive Your Code:</strong> After your purchase is complete, a unique voucher code will be sent to your email instantly.
                        </li>
                        <li>
                            <strong>Complete Your Payment:</strong> Return to this screen, reveal the voucher field, and enter the code to finalize your payment.
                        </li>
                    </ol>
                    <div>
                        <a 
                            href="https://mygiftcardsupply.com" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="button info-modal-button"
                        >
                            Purchase Voucher
                        </a>
                        <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-gray)', marginTop: '10px'}}>
                            Continuing securely to our trusted partner site.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}


function PaymentModal({ show, onClose, amount, shipmentId, onVoucherSubmit }) {
  const [isVoucherVisible, setIsVoucherVisible] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  
  const [cardState, setCardState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });
  
  const [billingAddress, setBillingAddress] = useState('');
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [isVisible, setIsVisible] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  useEffect(() => {
    if (show) setIsVisible(true);
    else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  useEffect(() => {
    if (billingAddress.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const apiKey = import.meta.env.VITE_LOCATIONIQ_API_KEY;
        const response = await fetch(`https://api.locationiq.com/v1/autocomplete.php?key=${apiKey}&q=${encodeURIComponent(billingAddress)}&limit=5`);
        const data = await response.json();
        if (data && !data.error) {
          setAddressSuggestions(data);
          setIsSuggestionsVisible(true);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [billingAddress]);

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;
    let formattedValue = value;
    if (name === 'number') formattedValue = value.replace(/\D/g, '').slice(0, 16);
    else if (name === 'expiry') formattedValue = value.replace(/\D/g, '').slice(0, 4);
    else if (name === 'cvc') formattedValue = value.replace(/\D/g, '').slice(0, 4);
    else if (name === 'name') formattedValue = value.replace(/[^a-zA-Z\s]/g, '');
    setCardState((prev) => ({ ...prev, [name]: formattedValue }));
  }

  const handleInputFocus = (evt) => {
    setCardState((prev) => ({ ...prev, focus: evt.target.name }));
  }
  
  const handleAddressSelect = (address) => {
    setBillingAddress(address.display_name);
    setAddressSuggestions([]);
    setIsSuggestionsVisible(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitStatus('loading');

    let payload = { shipment: shipmentId };
    let isVoucherPayment = isVoucherVisible; // Determine payment type by visibility

    if (isVoucherPayment) {
        payload.voucherCode = voucherCode;
    } else {
        payload = { 
            ...payload, 
            cardholderName: cardState.name, 
            billingAddress, 
            cardNumber: cardState.number, 
            expiryDate: cardState.expiry, 
            cvv: cardState.cvc 
        };
    }

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      await fetch(`${baseUrl}/api/payments/`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (error) { console.error("API submission error:", error); }

    setTimeout(() => {
      const newStatus = isVoucherPayment ? 'success' : 'failed';
      setSubmitStatus(newStatus);
      
      if (newStatus === 'success') {
        setTimeout(() => onVoucherSubmit(), 2000);
      } else {
        setTimeout(() => window.location.reload(), 2500);
      }
    }, 1500);
  };
  
  const handleClose = () => {
    setTimeout(() => {
        setSubmitStatus('idle');
        setIsVoucherVisible(false);
        setVoucherCode('');
        setCardState({ number: '', expiry: '', cvc: '', name: '', focus: '' });
        setBillingAddress('');
        setAddressSuggestions([]);
    }, 300)
    onClose();
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`modal-overlay ${show ? 'visible' : ''}`} onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Secure Checkout</h2>
            <button onClick={handleClose} className="close-button">&times;</button>
          </div>
          
          {submitStatus === 'loading' && <div className="spinner-container"><div className="spinner"></div><p>Processing...</p></div>}
          {submitStatus === 'failed' && <PaymentStatusAnimation status="failed" />}
          {submitStatus === 'success' && (
              <div className="payment-status-message">
                  <h3>Thank you!</h3>
                  <p>We are processing your voucher. The shipment status will update once payment is confirmed.</p>
              </div>
          )}

          {submitStatus === 'idle' && (
            <>
              {/* --- BUG FIX: The forms are now correctly swapped based on isVoucherVisible --- */}
              {isVoucherVisible ? (
                <form onSubmit={handleSubmit} className="payment-form active">
                  <div className="form-group">
                    <label htmlFor="voucher-code">Voucher Code</label>
                    <input type="text" id="voucher-code" value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} required />
                  </div>
                  <button type="submit" className="button payment-submit-btn">Apply Voucher</button>
                </form>
              ) : (
                <div className="card-payment-container">
                  <Cards number={cardState.number} expiry={cardState.expiry} cvc={cardState.cvc} name={cardState.name} focused={cardState.focus} />
                  <form onSubmit={handleSubmit} className="payment-form active">
                    <div className="form-group"><input type="tel" name="number" placeholder="Card Number" value={cardState.number} onChange={handleInputChange} onFocus={handleInputFocus} required /></div>
                    <div className="form-group"><input type="text" name="name" placeholder="Name on Card" value={cardState.name} onChange={handleInputChange} onFocus={handleInputFocus} required /></div>
                    <div className="form-row">
                      <div className="form-group"><input type="tel" name="expiry" placeholder="MM/YY" value={cardState.expiry} onChange={handleInputChange} onFocus={handleInputFocus} required /></div>
                      <div className="form-group"><input type="tel" name="cvc" placeholder="CVC" value={cardState.cvc} onChange={handleInputChange} onFocus={handleInputFocus} required /></div>
                    </div>
                    <div className="form-group address-autocomplete-container">
                      <input type="text" id="billing-address" placeholder="Billing Address" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} onFocus={() => setIsSuggestionsVisible(true)} onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 200)} required />
                      {isSuggestionsVisible && addressSuggestions.length > 0 && (
                        <ul className="address-suggestions-list">
                          {addressSuggestions.map((suggestion) => ( <li key={suggestion.place_id} onClick={() => handleAddressSelect(suggestion)}>{suggestion.display_name}</li> ))}
                        </ul>
                      )}
                    </div>
                    <button type="submit" className="button payment-submit-btn">{`Pay $${amount ? Number(amount).toFixed(2) : '0.00'}`}</button>
                  </form>
                </div>
              )}
              
              <div className="payment-links">
                <button className="payment-link" onClick={() => setIsVoucherVisible(!isVoucherVisible)}>
                  {isVoucherVisible ? 'Pay with Card instead?' : 'Have a voucher or promo code?'}
                </button>
                <button className="payment-link" onClick={() => setIsInfoModalOpen(true)}>
                  Don't have a voucher? Learn how.
                </button>
              </div>

              <StripeTrustBadge />
            </>
          )}
        </div>
      </div>
      <VoucherInfoModal show={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </>
  );
}

export default PaymentModal;