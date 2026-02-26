import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Lock scroll when menu open — fixes desktop scrollbar jump + iOS Safari
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Measure scrollbar width BEFORE hiding it to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      // Lock on <html> not <body> — iOS Safari ignores body overflow:hidden
      document.documentElement.style.overflow = 'hidden';
      // Compensate for the scrollbar disappearing so header doesn't jump right
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = scrollbarWidth + 'px';
      }
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { to: '/delivery-solutions', label: 'Delivery Solutions' },
    { to: '/about-us',           label: 'About Us'           },
    { to: '/knowledge-center',   label: 'Knowledge Center'   },
    { to: '/contact',            label: 'Contact'            },
  ];

  return (
    <>
      {/* ── HEADER BAR ────────────────────────────────────────────── */}
      <header className={`main-header ph-header${scrolled ? ' ph-scrolled' : ''}`}>
        <div className="container">

          {/* Logo */}
          <Link to="/" className="logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img
              src="https://www.ontrac.com/wp-content/themes/ontrac/assets/images/logo.svg"
              alt="OnTrac Logo"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="main-nav">
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `ph-nav-link${isActive ? ' ph-nav-active' : ''}`}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="header-controls">
            <Link to="/" className="button button-header">
              Track <span>your package</span>
            </Link>
            <div id="google_translate_element" />

            {/* Morphing hamburger */}
            <button
              className="ph-hamburger mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(o => !o)}
              aria-label="Toggle navigation"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`ph-bar${isMobileMenuOpen ? ' ph-bar--open' : ''}`} />
              <span className={`ph-bar${isMobileMenuOpen ? ' ph-bar--open' : ''}`} />
              <span className={`ph-bar${isMobileMenuOpen ? ' ph-bar--open' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* ── FULL-SCREEN MOBILE MENU ───────────────────────────────── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="ph-menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(170% at calc(100% - 44px) 36px)' }}
            exit={{   clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Decorative accent blob */}
            <div className="ph-menu-blob" />

            {/* Nav items */}
            <nav className="ph-menu-nav">
              {navLinks.map(({ to, label }, i) => (
                <motion.div
                  key={to}
                  className="ph-menu-row"
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{   opacity: 0, x: -16 }}
                  transition={{
                    delay: 0.18 + i * 0.07,
                    duration: 0.55,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <span className="ph-menu-idx">0{i + 1}</span>
                  <NavLink
                    to={to}
                    className="ph-menu-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="ph-menu-link-text">{label}</span>
                    <span className="ph-menu-link-arrow" aria-hidden>↗</span>
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              className="ph-menu-footer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: 10 }}
              transition={{ delay: 0.48, duration: 0.45 }}
            >
              <Link
                to="/"
                className="ph-menu-cta"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Track Your Package</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
              <p className="ph-menu-tagline">On Time. On Point. OnTrac.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;