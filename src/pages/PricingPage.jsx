import React from 'react';
import { Link } from 'react-router-dom';

const tiers = [
  {
    name: 'Dispatcher',
    price: '$99',
    cadence: '/mo',
    description: 'Perfect for small, independent delivery teams.',
    features: [
      'Up to 10 Driver Seats',
      'Basic Route Optimization Dashboard',
      'Standard Email Support',
      '30-day Data Retention',
    ],
    cta: 'Start 14-Day Free Trial',
    ctaTo: '/contact',
    featured: false,
  },
  {
    name: 'Fleet Pro',
    price: '$249',
    cadence: '/mo',
    description: 'Advanced tools for growing courier operations.',
    features: [
      'Up to 50 Driver Seats',
      'Advanced API Access (10k requests/mo)',
      'Real-time Fleet Tracking',
      'Route Analytics & Reporting',
      'Priority 24/7 Support',
    ],
    cta: 'Get Started',
    ctaTo: '/contact',
    featured: true,
  },
  {
    name: 'Enterprise API',
    price: 'Custom',
    cadence: '',
    description: 'Full infrastructure for enterprise logistics.',
    features: [
      'Unlimited Driver Seats',
      'Unlimited API Requests',
      'Custom E-commerce Integrations',
      'Dedicated Account Manager',
      'White-labeled Driver App',
    ],
    cta: 'Contact Sales',
    ctaTo: '/contact',
    featured: false,
  },
];

const faqs = [
  {
    question: 'Does OnTrac handle the physical delivery of packages?',
    answer:
      'No, OnTrac is strictly a software platform. We provide the dispatching, routing, and tracking infrastructure that independent courier businesses use to manage their own physical fleets.',
  },
  {
    question: 'Can I integrate this with my existing e-commerce checkout?',
    answer:
      'Yes, our Fleet Pro and Enterprise plans include full API access to connect your order management system directly to our routing engine.',
  },
];

const CheckIcon = () => (
  <svg
    className="pricing-check-icon"
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PricingPage = () => {
  return (
    <div className="refund-page-wrapper">
      <div className="refund-container pricing-container">

        {/* Professional Header Section — mirrors the Refund Policy language */}
        <header className="refund-header pricing-header">
          <div className="brand-accent-line"></div>
          <span className="compliance-tag">OnTrac Logistics SaaS</span>
          <h1 className="refund-main-title">
            Simple, Transparent Pricing<br />
            <span className="text-red">for Delivery Fleets</span>
          </h1>
          <p className="pricing-subhead">
            Scale your logistics operations with our cloud-based dispatch and routing software.
          </p>
        </header>

        {/* Pricing Tiers */}
        <div className="pricing-grid">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card${tier.featured ? ' pricing-card--featured' : ''}`}
            >
              {tier.featured && <span className="pricing-badge">Most Popular</span>}

              <h2 className="pricing-tier-name">{tier.name}</h2>
              <div className="pricing-price">
                <span className="pricing-amount">{tier.price}</span>
                {tier.cadence && <span className="pricing-cadence">{tier.cadence}</span>}
              </div>
              <p className="pricing-tier-desc">{tier.description}</p>

              <ul className="pricing-features">
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to={tier.ctaTo}
                className={`pricing-cta${tier.featured ? ' pricing-cta--featured' : ''}`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="pricing-faq">
          <h2 className="refund-sub-title pricing-faq-title">Frequently Asked Questions</h2>
          <div className="pricing-faq-grid">
            {faqs.map((faq) => (
              <div key={faq.question} className="refund-section pricing-faq-item">
                <h3 className="pricing-faq-question">{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default PricingPage;
