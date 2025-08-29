// src/pages/PrivacyPolicyPage.jsx
import React from 'react';

function PrivacyPolicyPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '30px' }}>Privacy Policy for OnTrac Courier</h1>
      <p style={{ color: 'var(--text-gray)' }}><strong>Last Updated: August 29, 2025</strong></p>
      
      <p>Welcome to OnTrac Courier ("us", "we", or "our"). We operate the https://ontracourier.us website (hereinafter referred to as the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.</p>
      <p>We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.</p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>Information Collection and Use</h2>
      <p>We collect only the essential information necessary to provide our core services. The types of personal information we may collect include:</p>
      <ul>
        <li><strong>Shipment Information:</strong> Tracking IDs and destination details required to provide tracking updates.</li>
        <li><strong>Payment Information:</strong> For shipments that require payment, we collect necessary payment details such as cardholder name, billing address, and voucher codes. This information is processed securely.</li>
        <li><strong>Contact Information:</strong> If you contact us via our Live Chat or email, we may collect your name and email address to respond to your inquiries.</li>
      </ul>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>Use of Data</h2>
      <p>OnTrac Courier uses the collected data for various purposes:</p>
      <ul>
        <li>To provide and maintain the Service</li>
        <li>To process payments for shipments</li>
        <li>To provide customer care and support</li>
        <li>To monitor the usage of the Service</li>
        <li>To detect, prevent and address technical issues</li>
      </ul>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>Data Security</h2>
      <p>The security of your data is important to us but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>
      
      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '40px' }}>Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at either of our support emails:</p>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        <li><strong>support@ontracourier.us</strong></li>
        <li><strong>support@ontracourier.co</strong></li>
      </ul>
    </div>
  );
}

export default PrivacyPolicyPage;

