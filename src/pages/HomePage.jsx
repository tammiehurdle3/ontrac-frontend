// src/pages/HomePage.jsx
import React from 'react';
import TrackingForm from '../components/TrackingForm';

const BRANDS = [
  { name: 'Lulus',            size: '1.5rem', weight: 800, spacing: '-0.03em', style: 'italic' },
  { name: 'SHEIN',            size: '1.1rem', weight: 900, spacing: '0.12em',  style: 'normal' },
  { name: 'Temu',             size: '1.6rem', weight: 800, spacing: '-0.02em', style: 'normal' },
  { name: 'Savage X Fenty',   size: '1rem',   weight: 600, spacing: '0.04em',  style: 'normal' },
  { name: 'Bodybuilding.com', size: '1rem',   weight: 700, spacing: '-0.01em', style: 'normal' },
  { name: 'Nuts.com',         size: '1.4rem', weight: 800, spacing: '-0.02em', style: 'italic' },
  { name: 'Urban Outfitters', size: '0.9rem', weight: 600, spacing: '0.08em',  style: 'normal' },
  { name: 'PacSun',           size: '1.5rem', weight: 900, spacing: '-0.03em', style: 'normal' },
  { name: 'Revolve',          size: '1.3rem', weight: 700, spacing: '0.02em',  style: 'normal' },
  { name: 'Finish Line',      size: '1.1rem', weight: 800, spacing: '-0.02em', style: 'normal' },
  { name: 'MILANI',           size: '1.2rem', weight: 800, spacing: '0.1em',   style: 'normal' },
];

const DOUBLED = [...BRANDS, ...BRANDS];

function HomePage() {
  return (
    <main>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <h1 style={{ marginTop: '0' }}>
            <span className="line">On Time.</span>
            <span className="line">On Point.</span>
            <span className="line logo-line">
              <img
                src="https://www.ontrac.com/wp-content/uploads/2023/02/logo.svg"
                alt="OnTrac - Last Mile E-Commerce Delivery"
              />
            </span>
          </h1>
          <TrackingForm />
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="about-top">
        <div className="container">
          <img
            className="sticker"
            src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/sticker.png"
            alt="OnTrac delivery sticker"
          />
          <h2 style={{ marginTop: '20px' }}>
            Last-mile delivery that<br />
            <span style={{ color: 'var(--primary-red)' }}>your customers remember.</span>
          </h2>
          <p>35 states. 70% of the US population. 1.9 days faster than national carriers. We handle the last mile so your brand can own the moment.</p>
          <a href="#" className="button">SEE HOW IT WORKS</a>
          <ul className="stats-list">
            <li><h3>1.9 Days</h3><p>Faster than national carriers</p></li>
            <li><h3>10-35%</h3><p>Cost savings</p></li>
            <li><h3>98%+</h3><p>On-time delivery performance</p></li>
          </ul>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="services" className="features">
        <div className="container">
          <h2 className="section-title">Last Mile E-Commerce Delivery That <br />Goes the Extra Mile</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ backgroundImage: "url(https://www.ontrac.com/wp-content/uploads/2024/03/OnTrac-FasterDelivery.png)" }}>
              <div className="card-content">
                <h3>Faster Delivery That Wins Customers</h3>
                <p>With the largest 1 and 2 day ground footprint, our fast network helps meet your customers' expectations and build brand loyalty.</p>
              </div>
            </div>
            <div className="feature-card">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-SaveYouMoney.jpg" alt="OnTrac last mile delivery cost savings" />
              <div className="card-content">
                <h3>Built to Help You Save Money</h3>
                <p>By only handling small packages, we save on everything from facility space to transportation expenses, resulting in lower shipping costs for you.</p>
              </div>
            </div>
            <div className="feature-card">
              <img src="https://www.ontrac.com/wp-content/uploads/2024/02/OnTrac-Residential-Ecommerce-Delivery-Network-1-1.png" alt="OnTrac delivery network covering 70% of US population" />
              <div className="card-content">
                <h3>Reach 70% of the US population</h3>
                <p>The OnTrac delivery network serves 35 states and Washington, D.C. We deliver where your customers are.</p>
              </div>
            </div>
            <div className="feature-card red-bg">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/feature-1.png" alt="Diversify your carrier mix with OnTrac" />
              <div className="card-content">
                <h3>Diversify Your Carrier Mix</h3>
                <p>Single-carrier shipping strategies are obsolete. Mitigate risk, save money, and increase flexibility with a proven alternative.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ── */}
      <section style={{
        background: '#ffffff',
        padding: '80px 0',
        overflow: 'hidden',
        position: 'relative',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <style>{`
          @keyframes ont-marquee {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .ont-rail {
            display: flex;
            align-items: center;
            width: max-content;
            animation: ont-marquee 40s linear infinite;
          }
          .ont-rail:hover { animation-play-state: paused; }
          .ont-brand {
            display: inline-flex;
            align-items: center;
            padding: 0 44px;
            flex-shrink: 0;
            color: #c8c8cc;
            transition: color 0.3s ease, transform 0.3s ease;
            cursor: default;
            user-select: none;
          }
          .ont-brand:hover {
            color: #1d1d1f;
            transform: scale(1.05);
          }
          .ont-sep {
            width: 1px;
            height: 32px;
            background: #ebebf0;
            flex-shrink: 0;
          }
        `}</style>

        {/* Left fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: 180,
          background: 'linear-gradient(to right, #fff 20%, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />
        {/* Right fade */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: 180,
          background: 'linear-gradient(to left, #fff 20%, transparent)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        <p style={{
          fontFamily: 'Manrope, Inter, sans-serif',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#c0c0c5',
          textAlign: 'center',
          margin: '0 0 52px',
          position: 'relative',
          zIndex: 3,
        }}>
          Trusted by leading retailers &amp; DTC brands
        </p>

        <div style={{ overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <div className="ont-rail">
            {DOUBLED.map((brand, i) => (
              <React.Fragment key={i}>
                <span
                  className="ont-brand"
                  style={{
                    fontFamily: 'Manrope, Inter, sans-serif',
                    fontSize: brand.size,
                    fontWeight: brand.weight,
                    letterSpacing: brand.spacing,
                    fontStyle: brand.style,
                  }}
                >
                  {brand.name}
                </span>
                <span className="ont-sep" aria-hidden="true" />
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── DETAILS ── */}
      <section className="details-section">
        <div className="container">
          <div className="detail-block">
            <div className="detail-text">
              <h2 className="section-title">Calling all delivery professionals</h2>
              <p>If you're a delivery professional who is passionate about customer experience, has a positive attitude, and a strong attention-to-detail, then we have exciting delivery opportunities for you.</p>
              <a href="#" className="button">LEARN MORE</a>
            </div>
            <div className="detail-image">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-OT-Driver-Blank.jpg" alt="OnTrac delivery driver career opportunity" />
            </div>
          </div>
          <div className="detail-block reversed">
            <div className="detail-text">
              <h2 className="section-title">Care to our communities</h2>
              <p>We use our geographical footprint and infrastructure to show up in times of need — aiding in disaster recovery, hunger relief, community health improvement, and more.</p>
              <a href="#" className="button">LEARN MORE</a>
            </div>
            <div className="detail-image">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-TimeOfNeed.jpg" alt="OnTrac community outreach and disaster relief" />
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      <section className="latest-news">
        <div className="container">
          <div className="latest-news-header">
            <h2 className="section-title">Raise The Bar On Your Parcel Strategy</h2>
            <a href="#" className="button button-white">VIEW ALL RESOURCES</a>
          </div>
          <div className="articles-grid">
            <div className="article-block">
              <a href="#">
                <img
                  src="https://www.ontrac.com/wp-content/uploads/2024/09/B2B-WP-CarrierConsolidation-FeaturedImage-3-1.png"
                  alt="Carrier Consolidation: How Retailers Are Adapting Their Shipping Strategy"
                />
                <h3>Carrier Consolidation Becomes Fashionable: How Retailers Are Adapting...</h3>
              </a>
            </div>
            <div className="article-block">
              <a href="#">
                <img
                  src="https://www.ontrac.com/wp-content/uploads/2024/03/OnTrac-7-Day-Delivery-Featured-Blog-Image.png"
                  alt="OnTrac Adds Weekend Deliveries for Faster Last Mile Shipping"
                />
                <h3>OnTrac Adds Weekend Deliveries to Provide Retailers with Faster Delivery...</h3>
              </a>
            </div>
            <div className="article-block">
              <a href="#">
                <img
                  src="https://www.ontrac.com/wp-content/uploads/2024/07/OnTracDesktopShipper-Partnership-FeaturedImage-1.gif"
                  alt="OnTrac and ShipWise Announce Delivery Partnership"
                />
                <h3>OnTrac and ShipWise Announce Partnership</h3>
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default HomePage;