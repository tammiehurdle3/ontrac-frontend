import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pusher from 'pusher-js';

// Your existing component imports
import ProgressBar from '../components/ProgressBar';
import RecentEvent from '../components/RecentEvent';
import CollapsibleSection from '../components/CollapsibleSection';
import ReceiptModal from '../components/ReceiptModal';
import { useNavigate } from 'react-router-dom';
// NEW: Import the refund components
import RefundNotification from '../components/RefundNotification';
import RefundChoiceModal from '../components/RefundChoiceModal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Your existing date formatting function (UNCHANGED)
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

function TrackingPage() {
    const navigate = useNavigate();
    // Your existing state variables
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [processingDots, setProcessingDots] = useState(1);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    // --- NEW: Add state for the refund feature ---
    const [refundBalance, setRefundBalance] = useState(null);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);


    useEffect(() => {
        let interval;
        if (isPaymentProcessing) {
            interval = setInterval(() => {
                setProcessingDots(dots => (dots % 3) + 1);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPaymentProcessing]);
    
    // This is the core data fetching function. It now also checks for balance.
    const fetchTrackingData = async (isUpdate = false) => {
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
    };

    useEffect(() => {
        if (!trackingId) {
            setIsLoading(false);
            return;
        }
        const artificialDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const loadDataWithDelay = async () => {
            setIsLoading(true);
            setError(null);
            setData(null);
            try {
                const [responseData] = await Promise.all([
                    fetchTrackingData(),
                    artificialDelay(1500)
                ]);
                setData(responseData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadDataWithDelay();
    }, [trackingId]);

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
    }, [trackingId]);

    const handlePaymentClick = () => {
        navigate(`/checkout/${trackingId}`);
    };

    const handleVoucherSuccess = () => {
        setIsPaymentProcessing(true);
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

    if (isLoading) {
        return <div className="loading-spinner-overlay"><div className="loading-spinner"></div></div>;
    }
    if (error) { return <div className="tracking-page-container"><p>{error}</p></div>; }
    if (!data) { return <div className="tracking-page-container"><p>Searching for your shipment...</p></div>; }

    const latestEvent = data.recentEvent || null;

    return (
        <main className="tracking-page-container">

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
                 <div className="track-block">
                    <div className="track-block-top">
                        <div className="header-lhs">
                             <div className="tracking-overview">
                                <h2>{trackingId}</h2>
                                <p>{data.status}</p>
                            </div>
                        </div>
                    </div>
                    <div className="track-block-main">
                        <div className="status-summary">
                            <div className="status-lhs"><h2>{data.status}</h2></div>
                            <div className="status-rhs">
                                <div className="destination-info"><label>Going To</label><p>{data.destination}</p></div>
                                <div className="destination-info"><label>Expected</label><p>{formatExpectedDate(data.expectedDate)}</p></div>
                            </div>
                        </div>
                        <ProgressBar status={data.status} labels={data.progressLabels} allEvents={data.allEvents} />
                        <RecentEvent event={latestEvent} />
                        {data.requiresPayment && !isPaymentProcessing && (
                            <div className="payment-section">
                                <div className="payment-summary">
                                    <span className="payment-label">Payment Required:</span>
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
                                <button onClick={handlePaymentClick} className="button payment-button">Pay Now</button>
                            </div>
                        )}
                        {isPaymentProcessing && (
                            <div className="payment-button-container">
                                <button className="button payment-button processing" disabled>Processing...</button>
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
                                    className="proof-of-payment-link"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faDownload} className="link-icon" />
                                    Print proof of payment
                                </button>
                            </div>
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
                                            <td data-label="Event">{event.event}</td>
                                            <td data-label="City">{event.city}</td>
                                            </tr>
                                     ))}
                                </tbody>
                            </table>
                        </div>


                            </CollapsibleSection>
                            <CollapsibleSection title="Shipment Details" icon="fa-circle-info">
                                <ul className="details-list">
                                    <li><label>Service</label><p>{data.shipmentDetails?.service}</p></li>
                                    <li><label>Weight</label><p>{data.shipmentDetails?.weight}</p></li>
                                    <li><label>Dimensions</label><p>{data.shipmentDetails?.dimensions}</p></li>
                                    <li><label>Origin</label><p>{data.shipmentDetails?.originZip}</p></li>
                                    <li><label>Destination</label><p>{data.shipmentDetails?.destinationZip}</p></li>
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