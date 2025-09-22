import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './ReceiptPage.css';

const ReceiptPage = () => {
    const [searchParams] = useSearchParams();
    const trackingId = searchParams.get('id');
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!trackingId) {
            setError("No tracking ID provided.");
            return;
        }
        const fetchShipment = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_URL;
                const response = await fetch(`${baseUrl}/api/shipments/${trackingId}/`);
                if (!response.ok) throw new Error("Shipment not found.");
                const data = await response.json();
                setShipment(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchShipment();
    }, [trackingId]);

    if (error) return <div className="receipt-container"><p className="error">{error}</p></div>;
    if (!shipment) return <div className="receipt-container"><p>Loading receipt...</p></div>;

    return (
        <div className="receipt-container">
            <div className="receipt-header">
                <img src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg" alt="OnTrac Logo" className="receipt-logo" />
                <h1>Payment Receipt</h1>
            </div>
            <div className="receipt-body">
                <div className="receipt-section">
                    <h2>Shipment Details</h2>
                    <p><strong>Tracking ID:</strong> {shipment.trackingId}</p>
                    <p><strong>Recipient:</strong> {shipment.recipient_name}</p>
                    <p><strong>Destination:</strong> {shipment.destination}</p>
                </div>
                <div className="receipt-section">
                    <h2>Payment Details</h2>
                    <p><strong>Date of Payment:</strong> {new Date().toLocaleDateString()}</p>
                    <p><strong>Payment For:</strong> {shipment.paymentDescription}</p>
                    <p className="total-amount"><strong>Amount Paid:</strong> {new Intl.NumberFormat('en-US', { style: 'currency', currency: shipment.paymentCurrency || 'USD' }).format(shipment.paymentAmount)}</p>
                </div>
            </div>
            <div className="receipt-footer">
                <p>Thank you for your payment.</p>
                <button onClick={() => window.print()} className="print-button">Print this Receipt</button>
            </div>
        </div>
    );
};

export default ReceiptPage;