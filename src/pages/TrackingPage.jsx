import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import Pusher from 'pusher-js';

// Your existing component imports
import ProgressBar from '../components/ProgressBar';
import RecentEvent from '../components/RecentEvent';
import TrackingForm from '../components/TrackingForm';
import CollapsibleSection from '../components/CollapsibleSection';
import ReceiptModal from '../components/ReceiptModal';
import { useNavigate } from 'react-router-dom';
// NEW: Import the refund components
import RefundNotification from '../components/RefundNotification';
import RefundChoiceModal from '../components/RefundChoiceModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Your existing date formatting function (UNCHANGED)
const US_STATE_FULL = {
    "AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California",
    "CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia",
    "HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas",
    "KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts",
    "MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana",
    "NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico",
    "NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma",
    "OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina",
    "SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont",
    "VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","DC":"District of Columbia"
};

const formatDestination = (destination) => {
    if (!destination) return '';
    const lower = destination.toLowerCase();
    if (!lower.includes('united states')) return destination;
    // US domestic — strip country, expand state abbreviation
    const withoutCountry = destination.replace(/,?\s*United States$/i, '').trim();
    // withoutCountry = "Cockeysville, MD"
    const parts = withoutCountry.split(',').map(p => p.trim());
    if (parts.length === 2) {
        const stateAbbr = parts[1].toUpperCase();
        const stateFull = US_STATE_FULL[stateAbbr] || parts[1];
        return `${parts[0]}, ${stateFull}`;
    }
    return withoutCountry;
};

const customerText = (value) => (
    typeof value === 'string' ? value.replace(/—/g, '-') : value
);

const formatExpectedDate = (dateString) => {
    // ... (no changes here)
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (!isNaN(date.getTime()) && dateString.includes('-')) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        });
    }
    return dateString;
};

function DeliveryPhotoSection({ imageUrl }) {
    const [revealed, setRevealed] = useState(false);
    return (
        <div className="delivery-photo-container">
            {!revealed ? (
                <button
                    onClick={() => setRevealed(true)}
                    className="proof-of-payment-link ont-receipt-link"
                    style={{width: '100%', justifyContent: 'center', padding: '14px'}}
                    type="button"
                >
                    <i className="fa-solid fa-box-open" style={{marginRight: '8px'}}></i>
                    View Proof of Delivery
                </button>
            ) : (
                <>
                    <div className="delivery-photo-header">
                        <i className="fa-solid fa-box-open"></i>
                        <span>Proof of Delivery</span>
                    </div>
                    <img src={imageUrl} alt="Proof of delivery" className="delivery-photo-img" />
                    <a href={imageUrl} download target="_blank" rel="noopener noreferrer" className="proof-of-payment-link ont-receipt-link" style={{marginTop: '12px', display: 'inline-flex'}}>
                        <FontAwesomeIcon icon={faDownload} className="link-icon" />
                        Download Photo
                    </a>
                </>
            )}
        </div>
    );
}

function TrackingPage() {
    const navigate = useNavigate();
    const location = useLocation();
    // Your existing state variables
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    // --- NEW: Add state for the refund feature ---
    const [refundBalance, setRefundBalance] = useState(null);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);


    // This is the core data fetching function. It now also checks for balance.
    const fetchTrackingData = useCallback(async (isUpdate = false) => {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
        if (!response.ok) {
            throw new Error('Tracking number not found or shipment has been canceled.');
        }
        const responseData = await response.json();

        // --- NEW: Check for refund balance after getting shipment data ---
        if (responseData && responseData.recipient_email) {
            try {
                const balanceResponse = await fetch(`${baseUrl}/api/check-balance/${responseData.recipient_email}/`);
                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    // Only show the notification if the balance is available to be claimed
                    if (balanceData && balanceData.status === 'AVAILABLE') {
                        setRefundBalance(balanceData);
                    }
                } else {
                    // It's okay if it fails, just means no balance. Clear any old one.
                    if(!isUpdate) setRefundBalance(null);
                }
            } catch (err) {
                console.error("Balance check failed:", err);
                if(!isUpdate) setRefundBalance(null);
            }
        }
        // --- End of new logic ---

        if (responseData) {
            return {
                ...responseData,
                allEvents: Array.isArray(responseData.allEvents) ? responseData.allEvents : [],
                progressLabels: Array.isArray(responseData.progressLabels) ? responseData.progressLabels : [],
            };
        }
        throw new Error('Tracking data is empty.');
    }, [trackingId]);

    useEffect(() => {
        if (!trackingId) {
            setIsLoading(false);
            return;
        }
        const artificialDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const skipInitialDelay = location.state?.skipTrackingDelay === true;

        const loadTrackingData = async () => {
            setIsLoading(true);
            setError(null);
            setData(null);
            try {
                const responseData = skipInitialDelay
                    ? await fetchTrackingData()
                    : (await Promise.all([
                        fetchTrackingData(),
                        artificialDelay(1500)
                    ]))[0];
                setData(responseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadTrackingData();
    }, [trackingId, location.state, fetchTrackingData]);

    useEffect(() => {
        if (!trackingId) return;
        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });
        const channel = pusher.subscribe(`shipment-${trackingId}`);
        channel.bind('update', async () => {
            try {
                // When an update is received, fetch the new data (which also checks for balance)
                const newData = await fetchTrackingData(true);
                setData(newData);
                setIsPaymentProcessing(false); 
            } catch (err) {
                console.error("Failed to fetch update:", err);
            }
        });
        return () => {
            pusher.unsubscribe(`shipment-${trackingId}`);
            pusher.disconnect();
        };
    }, [trackingId, fetchTrackingData]);

    const handlePaymentClick = () => {
        navigate(`/checkout/${trackingId}`);
    };

    const openReceiptModal = () => {
        setIsReceiptModalOpen(true);
    };

    // --- NEW: Function to handle closing the refund modal ---
    const handleCloseRefundModal = () => {
        setIsRefundModalOpen(false);
        // After choosing, hide the notification by clearing the balance from state
        setRefundBalance(null); 
    };

    // --- PREMIUM LOADER UPDATE ---
    if (isLoading) {
        return (
            <div className="premium-loading-overlay">
                <div className="premium-loader-wrapper">
                    <div className="loader-logo">
                        <img src="/ontrac_favicon.png" alt="OnTrac" className="loader-logo-img" />
                    </div>
                    <svg className="loader-ring-svg" viewBox="25 25 50 50">
                        <circle className="loader-ring-circle" cx="50" cy="50" r="20"></circle>
                    </svg>
                </div>
                <div className="loading-text-wrapper">
                    <h3 className="loading-title-main">Tracking Shipment</h3>
                    <p className="loading-subtitle-sub">Retrieving latest status...</p>
                </div>
            </div>
        );
    }
    if (!trackingId) {
        return (
            <main className="tracking-state-page">
                <section className="tracking-state-card">
                    <span className="tracking-state-kicker">Shipment tracking</span>
                    <h1>Enter a tracking number</h1>
                    <p>Use the tracking number from your shipment notification.</p>
                    <TrackingForm />
                </section>
            </main>
        );
    }

    if (error) {
        return (
            <main className="tracking-state-page">
                <section className="tracking-state-card">
                    <div className="tracking-state-icon" aria-hidden="true">
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <span className="tracking-state-kicker">Tracking unavailable</span>
                    <h1>We couldn't find that shipment</h1>
                    <p>{customerText(error)}</p>
                    <button type="button" className="button tracking-state-action" onClick={() => navigate('/')}>
                        Track another package
                    </button>
                </section>
            </main>
        );
    }

    if (!data) { return null; }

    const latestEvent = data.recentEvent || null;

    return (
        <main className="tracking-page-container ont-tracking-main">

            {/* --- NEW: RENDER THE NOTIFICATION AND MODAL --- */}
            <RefundNotification 
                excessAmount={refundBalance?.excess_amount_usd}
                onClaim={() => setIsRefundModalOpen(true)}
            />
            <RefundChoiceModal 
                show={isRefundModalOpen}
                onClose={handleCloseRefundModal}
                balanceData={refundBalance}
            />
            {/* --- END OF NEW COMPONENTS --- */}

            <section className="track-results-container">
                 {/* ... (rest of your existing JSX is unchanged) ... */}
                 <div className="track-block ont-track-card">
                    <div className="track-block-top">
                        <div className="header-lhs">
                             <div className="tracking-overview">
                                <h2>{trackingId}</h2>
                                <p>{customerText(data.status)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="track-block-main">
                        <div className="status-summary">
                            <div className="status-lhs"><h2>{customerText(data.status)}</h2></div>
                            <div className="status-rhs">
                                <div className="destination-info"><label>Going To</label><p>{formatDestination(data.destination)}</p></div>
                                <div className="destination-info"><label>Expected</label><p>{formatExpectedDate(data.expectedDate)}</p></div>
                            </div>
                        </div>
                        <ProgressBar status={data.status} labels={data.progressLabels} allEvents={data.allEvents} requiresPayment={data.requiresPayment} paymentDescription={data.paymentDescription} paymentActionMessage={data.paymentActionMessage} destinationCountry={data.destination_country} />
                        <RecentEvent event={latestEvent} />
                        {data.requiresPayment && !isPaymentProcessing && (
                            <div className="payment-section">
                                <div className="payment-summary">
                                    <span className="payment-label">Payment required</span>
                                    <h3 className="primary-amount">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: data.paymentCurrency || 'USD' }).format(data.paymentAmount)}
                                    </h3>
                                    {data.paymentBreakdown && data.paymentBreakdown.length > 0 && (
                                        <div className="payment-breakdown">
                                            {data.paymentBreakdown.map((item, index) => (
                                                <div className="breakdown-item" key={index}>
                                                    <span>{item.item}:</span>
                                                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: data.paymentCurrency || 'USD' }).format(item.amount)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {data.approximatedUSD && (
                                        <p className="secondary-amount">(Approximately ${data.approximatedUSD.amount} USD)</p>
                                    )}
                                </div>
                                <button onClick={handlePaymentClick} className="button payment-button ont-pay-btn">Pay Now</button>
                            </div>
                        )}
                        {isPaymentProcessing && (
                            <div className="payment-button-container">
                                 <button className="button payment-button processing ont-pay-btn" disabled>Verifying Payment...</button>
                            </div>
                        )}
                        {data.show_receipt && (
                            <div className="receipt-link-container">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        openReceiptModal();
                                    }}
                                    className="proof-of-payment-link ont-receipt-link"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faDownload} className="link-icon" />
                                    Print proof of payment
                                </button>
                            </div>
                        )}
                        {data.delivery_image_url && (
                            <DeliveryPhotoSection imageUrl={data.delivery_image_url} />
                        )}
                        <div className="collapsible-sections">
                            <CollapsibleSection title="All OnTrac Events" icon="fa-list">
                        <div className="events-table-container">
                            <table className="events-table">
                                <thead>
                                    <tr><th>Date & Time</th><th>Event</th><th>City</th></tr>
                                </thead>
                                <tbody>
                                    {data.allEvents.map((event, index) => (
                                        <tr key={index}>
                                            <td data-label="Date & Time">{event.date}</td>
                                            <td data-label="Event">{customerText(event.event)}</td>
                                            <td data-label="City">{customerText(event.city)}</td>
                                            </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>


                            </CollapsibleSection>
                            <CollapsibleSection title="Shipment Details" icon="fa-circle-info">
                                <ul className="details-list">
                                    <li><label>Service</label><p>{customerText(data.shipmentDetails?.service)}</p></li>
                                    <li><label>Weight</label><p>{customerText(data.shipmentDetails?.weight)}</p></li>
                                    <li><label>Dimensions</label><p>{customerText(data.shipmentDetails?.dimensions)}</p></li>
                                    <li><label>Origin</label><p>{customerText(data.shipmentDetails?.originZip)}</p></li>
                                    <li><label>Destination</label><p>{customerText(data.shipmentDetails?.destinationZip)}</p></li>
                                </ul>
                            </CollapsibleSection>
                        </div>
                    </div>
                </div>
            </section>
            <ReceiptModal 
                show={isReceiptModalOpen} 
                onClose={() => setIsReceiptModalOpen(false)} 
                receipt={data.receipt}
                trackingId={trackingId}
                recipientName={data.recipient_name}
                paymentAmount={data.paymentAmount}
                paymentCurrency={data.paymentCurrency}
                paymentDescription={data.paymentDescription}
            />
        </main>
    );
}

export default TrackingPage;