import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';

function RefundNotification({ excessAmount, onClaim }) {
    // 'hidden', 'visible', 'dismissed' (badge only)
    const [displayState, setDisplayState] = useState('hidden');

    // --- THIS IS THE MISSING PIECE ---
    // This effect watches the prop from the parent page and makes the notification appear.
    useEffect(() => {
        if (excessAmount && excessAmount > 0) {
            setDisplayState('visible');
        } else {
            // If for any reason the balance disappears, hide everything.
            setDisplayState('hidden');
        }
    }, [excessAmount]);
    // --- END OF MISSING PIECE ---

    // This effect handles the auto-dismiss timer. It is correct.
    useEffect(() => {
        let timer;
        if (displayState === 'visible') {
            timer = setTimeout(() => {
                setDisplayState('dismissed');
            }, 10000);
        }
        return () => clearTimeout(timer);
    }, [displayState]);

    const handleClaimClick = () => {
        setDisplayState('hidden');
        onClaim();
    };
    
    const handleBadgeClick = () => {
        setDisplayState('visible');
    };

    if (displayState === 'hidden') {
        return null;
    }

    if (displayState === 'dismissed') {
        return (
            <div className="refund-notification-handle" onClick={handleBadgeClick}>
                <FontAwesomeIcon icon={faGift} />
            </div>
        );
    }

    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(excessAmount);

    return (
        <div className="refund-notification-container">
            <div className="notification-icon">
                <FontAwesomeIcon icon={faGift} />
            </div>
            <div className="notification-content">
                <p className="notification-title">Update on Your Recent Payment</p>
                <p className="notification-text">A credit of {formattedAmount} is now available on your account.</p>
            </div>
            <div className="notification-action">
                <button onClick={handleClaimClick} className="button-claim">Claim</button>
            </div>
            <button onClick={() => setDisplayState('dismissed')} className="notification-close">&times;</button>
            <div className="notification-timer"></div>
        </div>
    );
}

export default RefundNotification;