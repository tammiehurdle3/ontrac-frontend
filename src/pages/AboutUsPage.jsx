// src/pages/AboutUsPage.jsx
import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { value: '35', unit: 'States', label: 'Delivery network coverage across the US' },
  { value: '70%', unit: 'of US', label: 'Population reached by our network' },
  { value: '98%+', unit: 'On-Time', label: 'Delivery performance, consistently' },
  { value: '1.9', unit: 'Days', label: 'Faster than national carriers on average' },
];

const values = [
  {
    icon: '⚡',
    title: 'Speed Without Compromise',
    body: 'The final mile is the most critical. We\'ve built our entire network around getting packages there faster — 1.9 days ahead of national carriers on average.'
  },
  {
    icon: '🔒',
    title: 'Trust at Every Step',
    body: 'Every shipment gets real-time tracking, secure handling, and direct communication. Peace of mind isn\'t a feature — it\'s our standard.'
  },
  {
    icon: '🤝',
    title: 'Human-Centric Logistics',
    body: 'In a world of automation, we stay human. Our team treats every package — whether for a global brand or an emerging creator — with the same level of care.'
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }
  })
};

function AboutUsPage() {
  return (
    <div className="au-page">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="au-hero">
        <div className="au-hero-inner container">
          <motion.p
            className="au-eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About OnTrac
          </motion.p>
          <motion.h1
            className="au-headline"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
          >
            The last mile,<br />
            <span className="au-headline-red">redefined.</span>
          </motion.h1>
          <motion.p
            className="au-lead"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            We were built on a single conviction — that the final step of a delivery is where trust is earned or lost. OnTrac exists to make that moment exceptional, every single time.
          </motion.p>
        </div>

        {/* Stats bar */}
        <div className="au-stats-bar">
          <div className="container au-stats-inner">
            {stats.map((s, i) => (
              <motion.div
                key={s.unit}
                className="au-stat"
                custom={i}
                initial="hidden"
                animate="show"
                variants={fadeUp}
              >
                <div className="au-stat-value">{s.value} <span className="au-stat-unit">{s.unit}</span></div>
                <div className="au-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ──────────────────────────────────────────────── */}
      <section className="au-mission">
        <div className="container au-mission-inner">
          <motion.div
            className="au-mission-text"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="au-eyebrow">Our Mission</p>
            <h2 className="au-section-title">Connecting brands to their customers. Faster.</h2>
            <p className="au-body">
              OnTrac bridges the gap between brands and their partners by turning every package into a trusted connection. We handle the complexity of shipping so creators can focus on their craft — and brands can be confident their products arrive on time, every time.
            </p>
            <p className="au-body">
              Our platform provides up-to-the-minute tracking and direct communication because we understand that for your customer, waiting is the worst part. We eliminate the wait.
            </p>
          </motion.div>
          <motion.div
            className="au-mission-image"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img
              src="https://www.ontrac.com/wp-content/uploads/2023/03/Home-OT-Driver-Blank.jpg"
              alt="OnTrac Delivery Professional"
            />
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────── */}
      <section className="au-values">
        <div className="container">
          <p className="au-eyebrow" style={{ textAlign: 'center' }}>What drives us</p>
          <h2 className="au-section-title" style={{ textAlign: 'center', maxWidth: 560, margin: '8px auto 56px' }}>
            Why we're different
          </h2>
          <div className="au-values-grid">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="au-value-card"
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <div className="au-value-icon">{v.icon}</div>
                <h3 className="au-value-title">{v.title}</h3>
                <p className="au-value-body">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ──────────────────────────────────────────── */}
      <section className="au-cta">
        <div className="container au-cta-inner">
          <h2 className="au-cta-title">Ready to ship smarter?</h2>
          <p className="au-cta-body">Join the leading retailers and DTC brands who trust OnTrac for last-mile delivery.</p>
          <a href="/" className="button au-cta-btn">Track Your Shipment</a>
        </div>
      </section>

    </div>
  );
}

export default AboutUsPage;