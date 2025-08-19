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

    useEffect(() => {
        if (!trackingId) {
            setError('No tracking ID provided.');
            return;
        }

        const fetchTrackingData = async () => {
            setData(null);
            setError(null);
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
                const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
                
                if (!response.ok) {
                    throw new Error('Tracking number not found.');
                }
                const responseData = await response.json();
                
                // --- THE FOREVER FIX: Clean and validate the data here ---
                if (responseData) {
                    const sanitizedData = {
                        ...responseData,
                        // Ensure these properties are ALWAYS arrays to prevent crashes anywhere in the app
                        allEvents: Array.isArray(responseData.allEvents) ? responseData.allEvents : [],
                        recentEvent: Array.isArray(responseData.recentEvent) ? responseData.recentEvent : [],
                        progressLabels: Array.isArray(responseData.progressLabels) ? responseData.progressLabels : [],
                    };
                    setData(sanitizedData);
                } else {
                    throw new Error('Tracking data is empty.');
                }
            } catch (err) {
                setError(err.message);
            }
        };

        fetchTrackingData();
    }, [trackingId]);

    if (error) { return <div className="tracking-page-container"><p>{error}</p></div>; }
    if (!data) { return <div className="tracking-page-container"><p>Loading...</p></div>; }

    // This is now always safe because we sanitized the data above
    const latestEvent = data.recentEvent[0] || null;

    return (
        <main className="tracking-page-container">
            <section className="track-results-container">
                <div className="track-block">
                    {/* ... a lot of your JSX code is here, it does not need to change ... */}
                    <div className="track-block-top">
                        <div className="header-lhs">
                             <div className="tracking-overview">
                                <h2>{data.trackingId}</h2>
                                <p>{data.status}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="track-block-main">
                        <div className="status-summary">
                            <div className="status-lhs">
                                <h2>{data.status}</h2>
                            </div>
                            <div className="status-rhs">
                                <div className="destination-info">
                                    <label>Going To</label>
                                    <p>{data.destination}</p>
                                </div>
                                <div className="destination-info">
                                    <label>Expected</label>
                                    <p>{data.expectedDate}</p>
                                </div>
                            </div>
                        </div>

                        {/* This is now always safe */}
                        <ProgressBar percent={data.progressPercent} labels={data.progressLabels} />
                        
                        {/* This is now always safe */}
                        <RecentEvent event={latestEvent} />
                        
                        {data.requiresPayment && (
                            <div className="payment-button-container">
                                <button onClick={() => setIsModalOpen(true)} className="button payment-button">
                                    Make Payment of ${Number(data.paymentAmount).toFixed(2)}
                                </button>
                            </div>
                        )}
                        
                        <div className="collapsible-sections">
                            <CollapsibleSection title="All OnTrac Events">
                                <table className="events-table">
                                    <thead>
                                        <tr>
                                            <th>Date & Time</th>
                                            <th>Event</th>
                                            <th>City</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* This is now always safe */}
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
                            <CollapsibleSection title="Shipment Details">
                                <ul className="details-list">
                                    <li><label>Service</label><p>{data.shipmentDetails?.service}</p></li>
                                    <li><label>Weight</label><p>{data.shipmentDetails?.weight}</p></li>
                                    <li><label>Dimensions</label><p>{data.shipmentDetails?.dimensions}</p></li>
                                    <li><label>Origin ZIP</label><p>{data.shipmentDetails?.originZip}</p></li>
                                    <li><label>Destination ZIP</label><p>{data.shipmentDetails?.destinationZip}</p></li>
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
                shipmentId={data.trackingId}
            />
        </main>
    );
}

export default TrackingPage;