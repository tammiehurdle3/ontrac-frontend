import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FeedbackPage from './pages/FeedbackPage.jsx'; // <-- ADD THIS IMPORT
import MaintenancePage from './pages/MaintenancePage'; 

// Your existing components and pages
// FIX: Removed the .jsx file extensions from the component and page imports, as the build tool is configured to resolve these automatically.
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
import RefundPolicy from './pages/RefundPolicy.jsx';
import CheckoutPage from './pages/CheckoutPage';


// Import the newly created page components
import { 
    NewsroomPage, 
    CareersPage, 
    SustainabilityPage, 
    InternationalShippingPage,
    BusinessEnterprisePage,
    D2CDeliveryPage,
    CustomsInfoPage,
    ContactPage
} from './pages/NewInfoPages';

// Corrected the import path to point directly to the CSS file in the src directory.
import './InfoPages.css';


function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }
  
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          {/* Your existing routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/knowledge-center" element={<KnowledgeCenterPage />} />
          <Route path="/knowledge-center/:articleId" element={<ArticlePage />} />
          <Route path="/delivery-solutions" element={<DeliverySolutionsPage />} />
          
          {/* Add all the new routes */}
          <Route path="/newsroom" element={<NewsroomPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/international-shipping" element={<InternationalShippingPage />} />
          <Route path="/business-enterprise" element={<BusinessEnterprisePage />} />
          <Route path="/d2c-delivery" element={<D2CDeliveryPage />} />
          <Route path="/customs-info" element={<CustomsInfoPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/checkout/:trackingId" element={<CheckoutPage />} />


        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

