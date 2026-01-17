import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="refund-page-wrapper">
      <div className="refund-container">
        
        {/* Professional Header Section */}
        <header className="refund-header">
          <div className="brand-accent-line"></div>
          <span className="compliance-tag">OnTrac Logistics Group</span>
          <h1 className="refund-main-title">Refund & <br /><span className="text-red">Return Policy</span></h1>
          <p className="last-updated">Last Updated: January, 2026</p>
        </header>

        {/* Content Sections with Red Vertical Accent */}
        <div className="refund-content-grid">
          
          <section className="refund-section">
            <h2 className="refund-sub-title">01. Service Commitment</h2>
            <p>
              OnTrac Courier is dedicated to providing elite logistics solutions. Our platform ensures transparency through clear service agreements and a structured path for resolution. If our delivery service fails to meet the standards of our global network, we are committed to making it right.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">02. Eligibility Criteria</h2>
            <div className="eligibility-cards">
              <div className="policy-card">
                <h3>Transit Loss</h3>
                <p>Verified loss of shipment after 14 business days of the projected delivery window has passed without a final status update.</p>
              </div>
              <div className="policy-card">
                <h3>Transit Damage</h3>
                <p>Documented physical damage to the contents of a shipment occurring while in the custody of OnTrac Courier or its partners.</p>
              </div>
            </div>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">03. Non-Refundable Items</h2>
            <p>
              Please note that fully executed delivery services, government-mandated customs duties, and taxes already paid on behalf of the client are non-refundable once the shipment has cleared transit.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">04. Claim Execution</h2>
            <p>
              Approved refunds are processed back to the original payment method within <strong>7–10 business days</strong>. All claims must be submitted via <strong>support@ontracourier.us</strong> with a valid tracking ID and photo documentation.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;