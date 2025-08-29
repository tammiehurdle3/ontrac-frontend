// src/pages/TermsPage.jsx
import React from 'react';

function TermsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '30px' }}>Terms and Conditions</h1>
      <p style={{ color: 'var(--text-gray)' }}><strong>Last Updated: August 29, 2025</strong></p>
      
      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>1. Agreement to Terms</h2>
      <p>By accessing or using our website at https://ontracourier.us (the "Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the Service.</p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>2. Service Description</h2>
      <p>OnTrac Courier provides a platform for users to track shipments and process payments related to those shipments. The information provided is for tracking purposes only and is subject to change based on carrier updates.</p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>3. User Responsibilities</h2>
      <p>You are responsible for the accuracy of any information you provide to the Service, including tracking numbers and payment details. You agree not to use the Service for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>4. Disclaimer of Warranties; Limitation of Liability</h2>
      <p>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free. The Service is provided on an 'as is' and 'as available' basis. In no case shall OnTrac Courier, our directors, employees, or partners be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind.</p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>5. Governing Law</h2>
      <p>These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
      
      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>6. Contact Information</h2>
      <p>Questions about the Terms and Conditions should be sent to us at either of our support emails:</p>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <li><strong>support@ontracourier.us</strong></li>
        <li><strong>support@ontracourier.co</strong></li>
      </ul>
    </div>
  );
}

export default TermsPage;

