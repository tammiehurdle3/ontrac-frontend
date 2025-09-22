import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pusher from 'pusher-js';

// Your existing component imports
import ProgressBar from '../components/ProgressBar';
import RecentEvent from '../components/RecentEvent';
import CollapsibleSection from '../components/CollapsibleSection';
import PaymentModal from '../components/PaymentModal';
import ReceiptModal from '../components/ReceiptModal'; // NEW: For the modal

// NEW: Add FontAwesome imports (safe to have even if not used)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Your existing date formatting function (UNCHANGED)
const formatExpectedDate = (dateString) => {
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
    // Your existing state variables (UNCHANGED)
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [processingDots, setProcessingDots] = useState(1);

    // NEW: Add this state for receipt modal
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

    // Your existing useEffect for the processing dots animation (UNCHANGED)
    useEffect(() => {
        let interval;
        if (isPaymentProcessing) {
            interval = setInterval(() => {
                setProcessingDots(dots => (dots % 3) + 1);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPaymentProcessing]);

    // This is the core data fetching function. It now only fetches and returns data.
    const fetchTrackingData = async () => {
        const baseUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
        if (!response.ok) {
            throw new Error('Tracking number not found or shipment has been canceled.');
        }
        const responseData = await response.json();
        if (responseData) {
            // Your original data processing logic, now returns the formatted data
            return {
                ...responseData,
                allEvents: Array.isArray(responseData.allEvents) ? responseData.allEvents : [],
                progressLabels: Array.isArray(responseData.progressLabels) ? responseData.progressLabels : [],
            };
        }
        throw new Error('Tracking data is empty.');
    };

    // Your original useEffect for the initial data load, now corrected to work properly.
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
                // This now correctly waits for both promises and gets the data
                const [responseData] = await Promise.all([
                    fetchTrackingData(),
                    artificialDelay(1500)
                ]);
                setData(responseData); // Sets the data in state AFTER it's been fetched
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false); // This now correctly runs AFTER data is set or an error occurs
            }
        };

        loadDataWithDelay();
    }, [trackingId]);

    // --- NEW: The Real-Time Logic (Now safe to use) ---
    useEffect(() => {
        if (!trackingId) return;

        const pusher = new Pusher(import.meta.env.VITE_PUSHER_KEY, {
            cluster: import.meta.env.VITE_PUSHER_CLUSTER,
        });

        const channel = pusher.subscribe(`shipment-${trackingId}`);

        channel.bind('update', async () => {
            console.log('A real-time update was received!');
            try {
                // When an update is received, fetch the new data and update the state
                const newData = await fetchTrackingData();
                setData(newData);
            } catch (err) {
                console.error("Failed to fetch update:", err);
            }
        });

        return () => {
            pusher.unsubscribe(`shipment-${trackingId}`);
            pusher.disconnect();
        };
    }, [trackingId]);

    // Your existing handleVoucherSuccess function (UNCHANGED)
    const handleVoucherSuccess = () => {
        setIsModalOpen(false);
        setIsPaymentProcessing(true);
    };

    // NEW: Fixed function to open receipt modal
    const openReceiptModal = () => {
        console.log('🔵 Opening receipt modal'); // DEBUG
        setIsReceiptModalOpen(true);
    };

    // The entire JSX return block below is completely UNCHANGED.
    if (isLoading) {
        return <div className="loading-spinner-overlay"><div className="loading-spinner"></div></div>;
    }
    if (error) { return <div className="tracking-page-container"><p>{error}</p></div>; }
    if (!data) { return <div className="tracking-page-container"><p>Searching for your shipment...</p></div>; }

    const latestEvent = data.recentEvent || null;

    return (
        <main className="tracking-page-container">
            <section className="track-results-container">
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
                                <button onClick={() => setIsModalOpen(true)} className="button payment-button">Pay Now</button>
                            </div>
                        )}
                        {isPaymentProcessing && (
                            <div className="payment-button-container">
                                <button className="button payment-button processing" disabled>Processing...</button>
                            </div>
                        )}
                        {/* NEW: FIXED receipt link - Uses button instead of anchor */}
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
                                <table className="events-table">
                                    <thead><tr><th>Date & Time</th><th>Event</th><th>City</th></tr></thead>
                                    <tbody>
                                        {data.allEvents.map((event, index) => (
                                            <tr key={index}><td>{event.date}</td><td>{event.event}</td><td>{event.city}</td></tr>
                                        ))}
                                    </tbody>
                                </table>
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
            <PaymentModal 
                show={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                amount={data.paymentAmount || 0}
                shipmentId={data.id}
                onVoucherSubmit={handleVoucherSuccess}
                currency={data.paymentCurrency}
            />
            {/* NEW: Add the receipt modal */}
            <ReceiptModal 
                show={isReceiptModalOpen} 
                onClose={() => setIsReceiptModalOpen(false)} 
                receipt={data.receipt}
                trackingId={trackingId}
                recipientName={data.recipient_name}
                paymentAmount={data.paymentAmount}
                paymentCurrency={data.paymentCurrency}
            />
        </main>
    );
}

export default TrackingPage;