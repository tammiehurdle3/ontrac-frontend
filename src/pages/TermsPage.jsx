import React from 'react';

const TermsPage = () => {
  return (
    <div className="refund-page-wrapper">
      <div className="refund-container">
        
        {/* Design matched to Refund Policy */}
        <header className="refund-header">
          <div className="brand-accent-line"></div>
          <span className="compliance-tag">OnTrac Logistics Group</span>
          <h1 className="refund-main-title">Terms & <br /><span className="text-red">Conditions</span></h1>
          <p className="last-updated">Last Updated: January, 2026</p>
        </header>

        <div className="refund-content-grid">
          
          <section className="refund-section">
            <h2 className="refund-sub-title">01. Agreement to Terms</h2>
            <p>
              By accessing the OnTrac Logistics Platform (the "SaaS Service"), you agree to be bound by these Terms. 
              Our platform provides proprietary digital tools for shipment management and automated logistics documentation.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">02. Digital Service Credits</h2>
            <p>
              Access to the OnTrac suite is facilitated through the purchase of <strong>Digital Service Credits</strong>. 
              These credits are used within the platform to execute automated tracking tasks, generate manifests, and 
              utilize our logistics optimization software. Credits are consumed upon the execution of a service request.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">03. User Responsibilities</h2>
            <div className="eligibility-cards">
              <div className="policy-card">
                <h3>Accuracy</h3>
                <p>Users must provide precise tracking and data inputs to ensure the software's algorithms function correctly.</p>
              </div>
              <div className="policy-card">
                <h3>Compliance</h3>
                <p>You agree not to use the digital platform for any unauthorized or unlawful activity across global jurisdictions.</p>
              </div>
            </div>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">04. Limitation of Liability</h2>
            <p>
              The Service is provided on an 'as is' basis. OnTrac Courier and its partners shall not be liable for any 
              direct or indirect damages resulting from the use of our digital tools or service interruptions.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">05. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the United States. Any disputes shall be resolved in 
              the appropriate courts of jurisdiction.
            </p>
          </section>

          <section className="refund-section">
            <h2 className="refund-sub-title">06. Contact Support</h2>
            <p>
              For technical queries or billing inquiries regarding your digital credits, contact us at: <br />
              <strong>support@ontracourier.us</strong>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsPage;