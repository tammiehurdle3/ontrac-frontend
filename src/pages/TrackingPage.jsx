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
                const response = await fetch(`https://ontrac-backend-eehg.onrender.com/api/shipments/${trackingId}/`);
                if (!response.ok) { throw new Error('Tracking number not found.'); }
                const responseData = await response.json();
                if (responseData) {
                    setData(responseData);
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

    const latestEvent = Array.isArray(data.recentEvent) ? data.recentEvent[0] : data.recentEvent;

    return (
        <main className="tracking-page-container">
            <section className="track-results-container">
                <div className="track-block">
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
                            <div className="status-lhs"><h2>{data.status}</h2></div>
                            <div className="status-rhs">
                                <div className="destination-info"><label>Going To</label><p>{data.destination}</p></div>
                                <div className="destination-info"><label>Expected</label><p>{data.expectedDate}</p></div>
                            </div>
                        </div>

                        <ProgressBar percent={data.progressPercent} labels={data.progressLabels || []} />
                        <RecentEvent event={latestEvent} />
                        
                        {data.requiresPayment && (
                            <div className="payment-button-container">
                                <button onClick={() => setIsModalOpen(true)} className="button payment-button">
                                    Make Payment of ${Number(data.paymentAmount).toFixed(2)}
                                </button>
                            </div>
                        )}
                        
                        <div className="collapsible-sections">
                           {/* ... Your collapsible sections ... */}
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