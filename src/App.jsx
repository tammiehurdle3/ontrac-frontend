import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TrackingPage from './pages/TrackingPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import AboutUsPage from './pages/AboutUsPage';
import KnowledgeCenterPage from './pages/KnowledgeCenterPage';
import ArticlePage from './pages/ArticlePage';
import DeliverySolutionsPage from './pages/DeliverySolutionsPage';
// --- IMPORT THE NEW PAGE ---
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/knowledge-center/:articleId" element={<ArticlePage />} />
          <Route path="/delivery-solutions" element={<DeliverySolutionsPage />} />
          {/* --- ADD THE NEW ROUTE --- */}
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

