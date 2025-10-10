import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCreditCard, faMoneyCheckDollar, faEnvelope, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

function RefundChoiceModal({ show, onClose, balanceData }) {
    const [choice, setChoice] = useState(null);
    const [payoutMethod, setPayoutMethod] = useState(null);
    const [refundDetail, setRefundDetail] = useState('');
    const [submitStatus, setSubmitStatus] = useState('idle');
    const [message, setMessage] = useState('');

    if (!show || !balanceData) return null;
    
    const { excess_amount_usd, claim_token } = balanceData;

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(excess_amount_usd);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitStatus('loading');
        setMessage('');

        if (!choice) {
            setMessage('Please select a refund method.');
            setSubmitStatus('error');
            return;
        }

        let finalRefundDetail = '';
        if (choice === 'MANUAL') {
            if (!payoutMethod) {
                setMessage('Please select a payout destination.');
                setSubmitStatus('error');
                return;
            }
            finalRefundDetail = `${payoutMethod}: ${refundDetail}`;
        }
        
        try {
            const response = await fetch(`${API_URL}/submit-refund-choice/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claim_token: claim_token,
                    refund_method: choice,
                    refund_detail: finalRefundDetail,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Submission failed. Please try again.');
            }
            
            setSubmitStatus('success');

        } catch (error) {
            setSubmitStatus('error');
            setMessage(error.message);
        }
    };
    
    const handleClose = () => {
        setChoice(null);
        setPayoutMethod(null);
        setRefundDetail('');
        setSubmitStatus('idle');
        setMessage('');
        onClose();
    };

    // --- NEW: High-Quality Success Message ---
    if (submitStatus === 'success') {
        const isCredit = choice === 'CREDIT';
        return (
            <div className="refund-modal-overlay show" onClick={handleClose}>
                <div className="refund-modal-content success" onClick={(e) => e.stopPropagation()}>
                    <div className="success-icon">
                        <FontAwesomeIcon icon={faCircleCheck} />
                    </div>
                    <h2 className="success-title">{isCredit ? "Credit Applied" : "Request Submitted"}</h2>
                    <p className="success-message">
                        {isCredit 
                            ? `The balance of ${formattedAmount} has been added to your account for future shipments.`
                            : `Your request for a ${formattedAmount} refund has been received. Please allow 3-7 business days for processing.`
                        }
                    </p>
                    <button onClick={handleClose} className="button button-close">Done</button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="refund-modal-overlay show" onClick={handleClose}>
            <div className="refund-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Manage Your Account Credit</h2>
                    <button onClick={handleClose} className="close-button">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <p className="balance-display">
                        Available Balance: <span className="balance-amount">{formattedAmount} USD</span>
                    </p>

                    <div className="choice-grid">
                        <label className={`choice-card ${choice === 'CREDIT' ? 'active' : ''}`}>
                            <input type="radio" name="refund-choice" value="CREDIT" onChange={() => setChoice('CREDIT')} className="sr-only"/>
                            <FontAwesomeIcon icon={faWallet} className="card-icon" />
                            <h3 className="card-title">Future Shipment Credit</h3>
                            <p className="card-description">Instant credit linked to your email, automatically applied to your next payment.</p>
                        </label>

                        <label className={`choice-card ${choice === 'MANUAL' ? 'active' : ''}`}>
                            <input type="radio" name="refund-choice" value="MANUAL" onChange={() => { setChoice('MANUAL'); setPayoutMethod(null); }} className="sr-only"/>
                            <FontAwesomeIcon icon={faCreditCard} className="card-icon" />
                            <h3 className="card-title">Manual Payout (Refund)</h3>
                            <p className="card-description">Request a direct refund to PayPal or a prepaid card (3-5 business days).</p>
                        </label>
                    </div>

                    {choice === 'MANUAL' && (
                        <div className="manual-payout-section">
                            <label className="payout-label">Select Payout Destination:</label>
                            <div className="payout-method-selector">
                                <button type="button" className={`method-btn ${payoutMethod === 'PayPal' ? 'active' : ''}`} onClick={() => setPayoutMethod('PayPal')}>
                                    <FontAwesomeIcon icon={faPaypal} /> PayPal
                                </button>
                                <button type="button" className={`method-btn ${payoutMethod === 'Prepaid Card' ? 'active' : ''}`} onClick={() => setPayoutMethod('Prepaid Card')}>
                                    <FontAwesomeIcon icon={faCreditCard} /> Digital Prepaid Card
                                </button>
                            </div>

                            {payoutMethod === 'PayPal' && (
                                <div className="input-group">
                                    <FontAwesomeIcon icon={faPaypal} className="input-icon" />
                                    <input 
                                        type="text" 
                                        value={refundDetail} 
                                        onChange={(e) => setRefundDetail(e.target.value)} 
                                        placeholder="Enter your PayPal email or username" 
                                        className="input-field"
                                        required
                                    />
                                </div>
                            )}

                            {payoutMethod === 'Prepaid Card' && (
                                <div className="input-group">
                                    <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                                    <input 
                                        type="email" 
                                        value={refundDetail} 
                                        onChange={(e) => setRefundDetail(e.target.value)} 
                                        placeholder="Enter email for card delivery" 
                                        className="input-field"
                                        required
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    
                    {message && (
                        <p className={`form-message ${submitStatus === 'error' ? 'error' : 'success'}`}>
                            {message}
                        </p>
                    )}

                    <button type="submit" className="button button-submit" disabled={submitStatus === 'loading'}>
                        {submitStatus === 'loading' ? 'Submitting...' : 'Confirm Selection'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RefundChoiceModal;