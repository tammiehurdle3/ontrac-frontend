import React from 'react';

function ReceiptModal({ 
    show, 
    onClose, 
    receipt, 
    trackingId, 
    recipientName, 
    paymentAmount, 
    paymentCurrency,
    paymentDescription
}) {
    if (!show) return null;

    const confirmedAt = receipt?.generated_at ? new Date(receipt.generated_at) : new Date();

    /**
     * Creates a single, self-contained HTML string for the receipt.
     * This is used by the print function to generate a clean, styled document.
     */
    const getReceiptHtml = () => {
        const receiptId = receipt?.receipt_number || `RCP-${trackingId}-${new Date().toISOString().slice(0,10)}`;
        const fullReceiptName = recipientName ? `${receiptId} - ${recipientName}` : receiptId;
        
        // Correctly formatted values to be inserted into the HTML
        const formattedDate = confirmedAt.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric' 
        });
        const formattedTime = confirmedAt.toLocaleTimeString('en-US', {
            hour: 'numeric', minute: '2-digit'
        });
        const formattedAmount = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: paymentCurrency || 'USD' 
        }).format(paymentAmount || 0);
        const formattedGeneratedDate = confirmedAt.toLocaleString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: 'numeric', minute: '2-digit'
        });
        const description = paymentDescription || 'Shipping Fee';

        return `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Receipt - ${fullReceiptName}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; margin: 0.5in; padding: 0; background: white; color: black; line-height: 1.4; }
                        .receipt-header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 15px; }
                        .company-info h3 { margin: 0 0 5px 0; font-size: 24px; color: #c9252d; }
                        .company-info p { margin: 0 0 3px 0; font-size: 12px; color: #666; }
                        .receipt-title h1 { margin: 14px 0 0 0; font-size: 20px; color: #17191c; }
                        .receipt-details-section { margin: 20px 0; }
                        .receipt-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12pt; }
                        .receipt-table td { padding: 8px; border: 1px solid #333; vertical-align: top; }
                        .receipt-table td:first-child { width: 35%; font-weight: bold; background-color: #f9f9f9; }
                        .payment-breakdown-section { margin: 25px 0; }
                        .payment-table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 12pt; }
                        .payment-table th, .payment-table td { padding: 10px 8px; border: 1px solid #333; text-align: left; }
                        .payment-table th { background-color: #f2f2f2; font-weight: bold; }
                        .total-row { background-color: #f9f9f9 !important; border-top: 2px solid #333 !important; }
                        .total-row td { font-weight: bold !important; font-size: 14pt !important; }
                        .receipt-footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #333; text-align: center; font-size: 11pt; }
                        .receipt-footer p { margin: 8px 0; }
                        .receipt-footer em { font-style: italic; color: #666; }
                        @page { margin: 0.5in; size: letter; }
                    </style>
                </head>
                <body>
                    <div class="receipt-header">
                        <div class="company-info"><h3>OnTrac Courier</h3><p>Shipment payment confirmation</p><p>Phoenix, AZ | support@ontracourier.us</p></div>
                        <div class="receipt-title"><h1>Payment Receipt</h1><p><strong>Receipt ID: ${fullReceiptName}</strong></p></div>
                    </div>
                    <div class="receipt-details-section">
                        <table class="receipt-table">
                            <tr><td>Tracking number:</td><td>${trackingId}</td></tr>
                            <tr><td>Recipient:</td><td>${recipientName || 'Customer'}</td></tr>
                            <tr><td>Payment status:</td><td>Confirmed</td></tr>
                            <tr><td>Confirmed date:</td><td>${formattedDate}</td></tr>
                            <tr><td>Confirmed time:</td><td>${formattedTime}</td></tr>
                        </table>
                    </div>
                    <div class="payment-breakdown-section">
                        <h4>Payment Details</h4>
                        <table class="payment-table">
                            <thead><tr><th>Description</th><th>Amount</th></tr></thead>
                            <tbody>
                                <tr><td>${description}</td><td>${formattedAmount}</td></tr>
                                <tr class="total-row"><td><strong>Total Amount Paid</strong></td><td><strong>${formattedAmount}</strong></td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="receipt-footer">
                        <p><strong>Payment confirmed</strong></p>
                        <p>This receipt confirms successful payment for the shipment above.</p>
                        <p>For questions or support, contact support@ontracourier.us</p>
                        <p>Confirmation recorded ${formattedGeneratedDate}</p>
                    </div>
                </body>
            </html>
        `;
    };

    const handlePrint = () => {
        const printHtml = getReceiptHtml(); // Get the master HTML
        const printWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        if (!printWindow) {
            alert('Please allow pop-ups to print your receipt.');
            return;
        }
        printWindow.document.write(printHtml);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    };

    return (
        <div className={`receipt-modal-overlay ${show ? 'show' : ''}`} onClick={onClose}>
            <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Payment receipt</h2>
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                <div id="printable-receipt" className="receipt-printable">
                    <div className="receipt-header">
                        <div className="company-info">
                            <h3>OnTrac Courier</h3>
                            <p>Shipment payment confirmation</p>
                            <p>Phoenix, AZ | support@ontracourier.us</p>
                        </div>
                        <div className="receipt-title">
                            <h1>Payment Receipt</h1>
                            <p><strong>Receipt ID: {receipt?.receipt_number || `RCP-${trackingId}-${new Date().toISOString().slice(0,10)}`}</strong></p>
                            <p><strong>Recipient: {recipientName || 'Customer'}</strong></p>
                        </div>
                    </div>
                    <div className="receipt-details-section">
                        <table className="receipt-table">
                            <tbody>
                                <tr><td><strong>Tracking number:</strong></td><td>{trackingId}</td></tr>
                                <tr><td><strong>Recipient:</strong></td><td>{recipientName || 'Customer'}</td></tr>
                                <tr><td><strong>Payment status:</strong></td><td>Confirmed</td></tr>
                                <tr><td><strong>Confirmed:</strong></td><td>{confirmedAt.toLocaleString()}</td></tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="payment-breakdown-section">
                        <h4>Payment Details</h4>
                        <table className="payment-table">
                            <thead><tr><th>Description</th><th>Amount</th></tr></thead>
                            <tbody>
                                <tr>
                                    <td>{paymentDescription || 'Shipping Fee'}</td> 
                                    <td>{new Intl.NumberFormat('en-US', { style: 'currency', currency: paymentCurrency || 'USD' }).format(paymentAmount || 0)}</td>
                                </tr>
                                <tr className="total-row">
                                    <td><strong>Total Amount Paid</strong></td>
                                    <td><strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: paymentCurrency || 'USD' }).format(paymentAmount || 0)}</strong></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="receipt-footer">
                        <p><strong>Payment confirmed</strong></p>
                        <p>This receipt confirms successful payment for the shipment above.</p>
                        <p>For questions or support, contact support@ontracourier.us</p>
                        <p>Confirmation recorded {confirmedAt.toLocaleString()}</p>
                    </div>
                </div>
                <div className="receipt-actions">
                    <button onClick={handlePrint} className="button print-btn" type="button">Print Receipt</button>
                    <button onClick={onClose} className="button close-btn" type="button">Close</button>
                </div>
            </div>
        </div>
    );
}

export default ReceiptModal;