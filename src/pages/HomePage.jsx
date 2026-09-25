// src/pages/HomePage.jsx
import React from 'react';
import NetworkHandoffHero from '../components/NetworkHandoffHero';

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

function HomePage() {
  return (
    <main>

      {/* ── HERO ── */}
      <NetworkHandoffHero />

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
          <a href="/delivery-solutions" className="button">Explore delivery solutions</a>
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
          .ont-marquee {
            width: 100%;
            overflow: hidden;
            -webkit-mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
            mask-image: linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent);
          }
          .ont-marquee-track {
            display: flex;
            width: max-content;
            will-change: transform;
            animation: ontAmbientRail 52s linear infinite;
          }
          .ont-marquee:hover .ont-marquee-track {
            animation-play-state: paused;
          }
          .ont-rail {
            flex: 0 0 auto;
            width: max-content;
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
          }
          .ont-brand {
            position: relative;
            display: inline-flex;
            align-items: center;
            min-height: 40px;
            padding: 0 clamp(28px, 3.6vw, 54px);
            color: #717278;
            opacity: 0.92;
            white-space: nowrap;
            transition: color 160ms ease, opacity 160ms ease;
            cursor: default;
            user-select: none;
          }
          .ont-brand::after {
            content: '';
            position: absolute;
            right: 0;
            width: 1px;
            height: 28px;
            background: #dedde1;
          }
          .ont-brand:hover {
            color: #24262a;
            opacity: 1;
          }
          @keyframes ontAmbientRail {
            to { transform: translate3d(-50%, 0, 0); }
          }
          @media (max-width: 640px) {
            .ont-marquee {
              -webkit-mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
              mask-image: linear-gradient(90deg, transparent, #000 4%, #000 96%, transparent);
            }
            .ont-brand {
              padding: 0 28px;
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .ont-marquee {
              -webkit-mask-image: none;
              mask-image: none;
              overflow-x: auto;
              scrollbar-width: none;
            }
            .ont-marquee::-webkit-scrollbar { display: none; }
            .ont-marquee-track { animation: none; }
            .ont-rail[aria-hidden='true'] { display: none; }
          }
        `}</style>

        <p style={{
          fontFamily: 'Manrope, Inter, sans-serif',
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#7d7e84',
          textAlign: 'center',
          margin: '0 0 44px',
          position: 'relative',
          zIndex: 3,
        }}>
          Trusted by leading retailers &amp; DTC brands
        </p>

        <div className="ont-marquee" style={{ position: 'relative', zIndex: 1 }}>
          <div className="ont-marquee-track">
            {[0, 1].map((loop) => (
              <div className="ont-rail" key={loop} aria-hidden={loop === 1 ? 'true' : undefined}>
                {BRANDS.map((brand, i) => (
                  <span
                    className="ont-brand"
                    key={`${loop}-${i}`}
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
                ))}
              </div>
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
              <a href="/careers" className="button">Explore opportunities</a>
            </div>
            <div className="detail-image">
              <img src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-OT-Driver-Blank.jpg" alt="OnTrac delivery driver career opportunity" />
            </div>
          </div>
          <div className="detail-block reversed">
            <div className="detail-text">
              <h2 className="section-title">Care to our communities</h2>
              <p>We use our geographical footprint and infrastructure to show up in times of need, supporting disaster recovery, hunger relief, community health, and more.</p>
              <a href="/sustainability" className="button">Our community work</a>
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
            <a href="/knowledge-center" className="button button-white">View all resources</a>
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