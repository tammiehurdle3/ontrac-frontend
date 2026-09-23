import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MaintenancePage from './pages/MaintenancePage';
import Header from './components/Header';
import Footer from './components/Footer';
import './InfoPages.css';

const HomePage = lazy(() => import('./pages/HomePage'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const KnowledgeCenterPage = lazy(() => import('./pages/KnowledgeCenterPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const DeliverySolutionsPage = lazy(() => import('./pages/DeliverySolutionsPage'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy.jsx'));
const PricingPage = lazy(() => import('./pages/PricingPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage.jsx'));

const NewsroomPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.NewsroomPage })));
const CareersPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.CareersPage })));
const SustainabilityPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.SustainabilityPage })));
const InternationalShippingPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.InternationalShippingPage })));
const BusinessEnterprisePage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.BusinessEnterprisePage })));
const D2CDeliveryPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.D2CDeliveryPage })));
const CustomsInfoPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.CustomsInfoPage })));
const ContactPage = lazy(() => import('./pages/NewInfoPages').then((module) => ({ default: module.ContactPage })));


function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }
  
  return (
    <Router>
      <Header />
      <main>
        <Suspense fallback={
          <div className="premium-loading-overlay" role="status" aria-live="polite" aria-label="Loading page">
            <div className="premium-loader-wrapper">
              <img src="/ontrac_favicon.png" alt="" className="loader-logo-img" />
              <svg className="loader-ring-svg" viewBox="25 25 50 50" aria-hidden="true">
                <circle className="loader-ring-circle" cx="50" cy="50" r="20"></circle>
              </svg>
            </div>
          </div>
        }>
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
          <Route path="/pricing" element={<PricingPage />} />
          
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
        </Suspense>
      </main>
      <Footer />
    </Router>
  );
}

export default App;

