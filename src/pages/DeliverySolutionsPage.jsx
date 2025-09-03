import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function DeliverySolutionsPage() {
  const location = useLocation();

  // Scroll to top when the page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="delivery-solutions-page">
      {/* --- 1. The Introduction (The "Why") --- */}
      <section className="solutions-hero">
        <div className="container">
          <h1 className="solutions-hero-title">Reliable Delivery, Tailored For Your Business.</h1>
          <p className="solutions-hero-subtitle">
            Whether you're an e-commerce brand, a creative enterprise, or a business with specialized shipping needs, we provide logistics built on security, transparency, and care.
          </p>
        </div>
      </section>

      {/* --- 2. Our Core Services (The "What") --- */}
      <section className="solutions-services">
        <div className="container">
          <h2 className="section-title">Our Core Services</h2>
          <div className="service-grid">
            {/* Service 1 */}
            <div className="service-card">
              <div className="service-card-icon">
                <i className="fa-solid fa-star"></i>
              </div>
              <h3>Specialized E-Commerce Solutions</h3>
              <p>Our flagship service, designed for the unique needs of modern e-commerce. We provide the reliable, high-touch logistics required for high-value products and brand collaborations, ensuring your items arrive in perfect condition.</p>
              <ul>
                <li>Real-time, shareable tracking portals</li>
                <li>Specialized handling for sensitive items</li>
                <li>Dedicated support for business partners</li>
              </ul>
            </div>
            {/* Service 2 - UPDATED FOR GLOBAL SCOPE */}
            <div className="service-card">
              <div className="service-card-icon">
                <i className="fa-solid fa-globe"></i>
              </div>
              <h3>Worldwide Shipping Solutions</h3>
              <p>Expand your reach with our comprehensive international services. We navigate the complexities of global logistics, managing the entire customs clearance process to provide end-to-end visibility and minimize delays.</p>
              <ul>
                <li>End-to-end international tracking</li>
                <li>Proactive customs documentation</li>
                <li>Global network of carrier partners</li>
              </ul>
            </div>
            {/* Service 3 */}
            <div className="service-card">
              <div className="service-card-icon">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <h3>Direct-to-Consumer Delivery</h3>
              <p>Fast, reliable final-mile delivery directly to your customers' doorsteps. Our network is optimized for residential routes, ensuring a positive delivery experience that reflects the quality of your brand.</p>
              <ul>
                <li>Flexible delivery windows</li>
                <li>Real-time customer notifications</li>
                <li>Photo proof of delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. The Call to Action (The "How") --- */}
      <section className="solutions-cta">
        <div className="container">
          <h2>Ready to Ship with Confidence?</h2>
          <p>Let's build a logistics solution that fits your business. Contact our team today to get a custom quote and learn more about partnering with OnTrac.</p>
          <a href="mailto:support@ontracourier.us" className="button">Partner With Us</a>
        </div>
      </section>
    </div>
  );
}

export default DeliverySolutionsPage;

