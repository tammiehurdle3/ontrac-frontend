// src/pages/HomePage.jsx
import React from 'react';
import TrackingForm from '../components/TrackingForm';
import SubscriptionForm from '../components/SubscriptionForm';

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1 style={{ marginTop: '0' }}>
            <span className="line">On Time.</span>
            <span className="line">On Point.</span>
            <span className="line logo-line">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/02/logo.svg" alt="OnTrac Logo" />
            </span>
          </h1>
          <TrackingForm />
        </div>
      </section>

      <section className="about-top">
        <div className="container">
          
          <img className="sticker" src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/sticker.png" alt="Sticker" />
          
          <h2 style={{ marginTop: '20px' }}>Connecting Leading Retailers and Shippers to Their Customers. Faster.</h2>
          <p>We provide last-mile e-commerce delivery services that hit the mark for you and your customers.</p>
          <a href="#" className="button">LEARN MORE</a>
          <ul className="stats-list">
            <li><h3>1.9 Days</h3><p>Faster than national carriers</p></li>
            <li><h3>10-35%</h3><p>Cost savings</p></li>
            <li><h3>98%+</h3><p>On-time delivery performance</p></li>
          </ul>
          
        </div>
      </section>

      <section id="services" className="features">
        <div className="container">
          <h2 className="section-title">Last Mile E-Commerce Delivery That <br />Goes the Extra Mile</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ backgroundImage: "url(https://www.ontrac.com/wp-content/uploads/2024/03/OnTrac-FasterDelivery.png)" }}>
              <div className="card-content"><h3>Faster Delivery That Wins Customers</h3><p>With the largest 1 and 2 day ground footprint, our fast network helps meet your customers’ expectations and build brand loyalty.</p></div>
            </div>
            <div className="feature-card"><img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-SaveYouMoney.jpg" alt="Save Money" /><div className="card-content"><h3>Built to Help You Save Money</h3><p>By only handing small packages, we save on everything from facility space to transportation expenses, resulting in lower shipping costs for you.</p></div></div>
            <div className="feature-card"><img src="https://www.ontrac.com/wp-content/uploads/2024/02/OnTrac-Residential-Ecommerce-Delivery-Network-1-1.png" alt="US Population" /><div className="card-content"><h3>Reach 70% of the US population</h3><p>The OnTrac delivery network serves 35 states and Washington, D.C. We deliver where your customers are.</p></div></div>
            <div className="feature-card red-bg"><img src="https://www.ontrac.com/wp-content/uploads/2023/03/feature-1.png" alt="Carrier Mix" /><div className="card-content"><h3>Diversify Your Carrier Mix</h3><p>Single-carrier shipping strategies are obsolete. Mitigate risk, save money, and increase flexibility with a proven alternative.</p></div></div>
          </div>
        </div>
      </section>

      <section className="clients">
        <div className="container">
          <h2 className="section-title">Trusted by Leading Retailers and DTC Brands</h2>
          <div className="client-logos">
            <img src="https://www.ontrac.com/wp-content/uploads/2023/07/lulus.png" alt="Lulus" />
            <img src="https://www.ontrac.com/wp-content/uploads/2023/03/bodybuilding.svg" alt="Bodybuilding.com" />
            <img src="https://www.ontrac.com/wp-content/uploads/2023/03/nuts.svg" alt="Nuts.com" />
            <img src="https://www.ontrac.com/wp-content/uploads/2023/07/temu.png" alt="Temu" />
            <img src="https://www.ontrac.com/wp-content/uploads/2023/07/savagexfenty-1.png" alt="Savage X Fenty" />
            <img src="https://www.ontrac.com/wp-content/uploads/2023/07/Shein.png" alt="Shein" />
          </div>
        </div>
      </section>

      <section className="details-section">
        <div className="container">
          <div className="detail-block">
            <div className="detail-text">
              <h2 className="section-title">Calling all delivery professionals</h2>
              <p>If you’re a delivery professional who is passionate about customer experience, has a positive attitude, and a strong attention-to-detail, then we have exciting delivery opportunities for you.</p>
              <a href="#" className="button">LEARN MORE</a>
            </div>
            <div className="detail-image">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-OT-Driver-Blank.jpg" alt="Delivery Professional"/>
            </div>
          </div>
          <div className="detail-block reversed">
            <div className="detail-text">
              <h2 className="section-title">Care to our communities</h2>
              <p>We use our geographical footprint and infrastructure to show up in times of need — aiding in disaster recovery, hunger relief, community health improvement, and more.</p>
              <a href="#" className="button">LEARN MORE</a>
            </div>
            <div className="detail-image">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-TimeOfNeed.jpg" alt="Community Care"/>
            </div>
          </div>
        </div>
      </section>
      
      <section className="latest-news">
        <div className="container">
          <div className="latest-news-header">
            <h2 className="section-title">Raise The Bar On Your Parcel Strategy</h2>
            <a href="#" className="button button-white">VIEW ALL RESOURCES</a>
          </div>
          <div className="articles-grid">
            <div className="article-block">
              <a href="#">
                <img src="https://www.ontrac.com/wp-content/uploads/2024/09/B2B-WP-CarrierConsolidation-FeaturedImage-3-1.png" alt="Article 1"/>
                <h3>Carrier Consolidation Becomes Fashionable: How Retailers Are Adapting...</h3>
              </a>
            </div>
            <div className="article-block">
              <a href="#">
                <img src="https://www.ontrac.com/wp-content/uploads/2024/03/OnTrac-7-Day-Delivery-Featured-Blog-Image.png" alt="Article 2"/>
                <h3>OnTrac Adds Weekend Deliveries to Provide Retailers with Faster Delivery...</h3>
              </a>
            </div>
            <div className="article-block">
              <a href="#">
                <img src="https://www.ontrac.com/wp-content/uploads/2024/07/OnTracDesktopShipper-Partnership-FeaturedImage-1.gif" alt="Article 3"/>
                <h3>OnTrac and ShipWise Announce Partnership</h3>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section className="newsletter-signup" style={{ backgroundColor: '#f7f7f7' }}>
        <div className="container">
          <SubscriptionForm />
        </div>
      </section>
    </main>
  );
}

export default HomePage;