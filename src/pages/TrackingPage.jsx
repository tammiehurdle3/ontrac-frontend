// src/pages/TrackingPage.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import RecentEvent from '../components/RecentEvent';
import CollapsibleSection from '../components/CollapsibleSection';
import PaymentModal from '../components/PaymentModal';

function TrackingPage() {
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [isLoading, setIsLoading] = useState(true);
    
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [processingDots, setProcessingDots] = useState(1);

    useEffect(() => {
        let interval;
        if (isPaymentProcessing) {
            interval = setInterval(() => {
                setProcessingDots(dots => (dots % 3) + 1);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isPaymentProcessing]);


    useEffect(() => {
        if (!trackingId) {
            setIsLoading(false); // Stop loading if there's no ID
            return;
        }

        const fetchTrackingData = async () => {
            const baseUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
            if (!response.ok) {
                throw new Error('Tracking number not found or shipment has been canceled.');
            }
            const responseData = await response.json();
            if (responseData) {
                return { // Sanitize the data
                    ...responseData,
                    allEvents: Array.isArray(responseData.allEvents) ? responseData.allEvents : [],
                    recentEvent: Array.isArray(responseData.recentEvent) ? responseData.recentEvent : [],
                    progressLabels: Array.isArray(responseData.progressLabels) ? responseData.progressLabels : [],
                };
            }
            throw new Error('Tracking data is empty.');
        };

        const artificialDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const loadDataWithDelay = async () => {
            setIsLoading(true);
            setError(null);
            setData(null);

            try {
                const [responseData] = await Promise.all([
                    fetchTrackingData(),
                    artificialDelay(1500) // Set a 1.5 second minimum load time
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
    
    const handleVoucherSuccess = () => {
        setIsModalOpen(false);
        setIsPaymentProcessing(true);
    };

    if (isLoading) {
        return (
            <div className="loading-spinner-overlay">
                {/* --- UPDATED: Simpler HTML for the new circular spinner --- */}
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) { return <div className="tracking-page-container"><p>{error}</p></div>; }
    if (!data) { return <div className="tracking-page-container"><p>Searching for your shipment...</p></div>; }

    const latestEvent = data.recentEvent[0] || null;

    return (
        <main className="tracking-page-container">
            <section className="track-results-container">
                <div className="track-block">
                    {/* ... (rest of the tracking block is unchanged) ... */}
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
                                <div className="destination-info"><label>Expected</label><p>{data.expectedDate}</p></div>
                            </div>
                        </div>
                        <ProgressBar percent={data.progressPercent} labels={data.progressLabels} />
                        <RecentEvent event={latestEvent} />
                        
                        <div className="payment-button-container">
                            {isPaymentProcessing ? (
                                <button className="button payment-button processing" disabled>
                                    Processing{'.'.repeat(processingDots)}<span style={{ opacity: 0 }}>{'.'.repeat(3 - processingDots)}</span>
                                </button>
                            ) : (
                                data.requiresPayment && (
                                    <button onClick={() => setIsModalOpen(true)} className="button payment-button">
                                        Make Payment of ${Number(data.paymentAmount).toFixed(2)}
                                    </button>
                                )
                            )}
                        </div>
                        
                        <div className="collapsible-sections">
                            {/* ... (collapsible sections are unchanged) ... */}
                            <CollapsibleSection title="All OnTrac Events" icon="fa-list">
                                <table className="events-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Event</th>
                                            <th>City</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.allEvents.map((event, index) => (
                                            <tr key={index}>
                                                <td>{event.date}</td>
                                                <td>{event.event}</td>
                                                <td>{event.city}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CollapsibleSection>
                            <CollapsibleSection title="Shipment Details" icon="fa-circle-info">
                                <ul className="details-list">
                                    <li><label>Service</label><p>{data.shipmentDetails?.service}</p></li>
                                    <li><label>Weight</label><p>{data.shipmentDetails?.weight}</p></li>
                                    <li><label>Dimensions</label><p>{data.shipmentDetails?.dimensions}</p></li>
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
            />
        </main>
    );
}

export default TrackingPage;
