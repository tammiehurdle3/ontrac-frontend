// src/pages/AboutUsPage.jsx
import React from 'react';

function AboutUsPage() {
  return (
    <div className="container" style={{ padding: '60px 20px', maxWidth: '800px', lineHeight: '1.7' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.8rem', marginBottom: '30px' }}>
        About OnTrac
      </h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-gray)' }}>
        OnTrac was founded on a simple principle: the final mile of a delivery is the most critical. It's the moment that defines the customer experience and reflects the promise of a brand. We specialize in providing transparent, reliable, and secure logistics solutions specifically designed for brand and creator partnerships.
      </p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '50px' }}>Our Mission</h2>
      <p>
        Our mission is to bridge the gap between brands and their valued partners by ensuring that every package is more than just a delivery—it's a trusted connection. We handle the complexities of shipping so that creators can focus on their craft and brands can be confident that their products are arriving safely and on time, every time.
      </p>

      <h2 style={{ fontFamily: 'var(--font-heading)', marginTop: '50px' }}>Why We're Different</h2>
      <p>
        In a world of automated systems, we believe in a human-centric approach. Our platform provides clear, up-to-the-minute tracking and direct communication channels because we understand that peace of mind is paramount. Whether it's a product launch for a global brand or a curated package for an emerging creator, we treat every shipment with the care and priority it deserves.
      </p>
    </div>
  );
}

export default AboutUsPage;
