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
        if (!trackingId) { return; }

        const fetchTrackingData = async () => {
            setData(null);
            setError(null);
            try {
                const baseUrl = "https://ontrac-backend-eehg.onrender.com";
                const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
                
                if (!response.ok) { throw new Error('Tracking number not found or server error.'); }
                
                const responseData = await response.json();
                
                if (responseData) {
                    // --- THE FOREVER FIX: Clean and validate the data here ---
                    const sanitizedData = {
                        ...responseData,
                        // Ensure these properties are ALWAYS arrays to prevent crashes
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
            />
        </main>
    );
}

export default TrackingPage;