import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ProcessTimeline } from './components/ProcessTimeline';
import { Pricing } from './components/Pricing';
import { ConsultantAI } from './components/ConsultantAI';
import { BusinessWizard } from './components/BusinessWizard';
import { Footer } from './components/Footer';
import { Testimonials } from './components/Testimonials';
import { BlogPreview } from './components/BlogPreview';
import { ContactPage } from './pages/ContactPage';
import { ToolsPage } from './pages/ToolsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { AboutPage } from './pages/AboutPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { LoginPage } from './pages/admin/LoginPage';
import { Dashboard } from './pages/admin/Dashboard';
import { InvoiceBuilder } from './pages/admin/InvoiceBuilder';
import { BlogEditor } from './pages/admin/BlogEditor';
import { OrderWizardPage } from './pages/OrderWizardPage';
import { ClientPortal } from './pages/portal/ClientPortal.tsx';
import { TermsOfService } from './pages/legal/TermsOfService';
import { PrivacyPolicy } from './pages/legal/PrivacyPolicy';
import { RefundPolicy } from './pages/legal/RefundPolicy';
import { Disclaimer } from './pages/legal/Disclaimer';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PricingProvider } from './contexts/PricingContext';
import { ViewModeProvider } from './contexts/ViewModeContext';
import { ViewModeToggle } from './components/admin/ViewModeToggle';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

// Component compositions for pages
const HomePage: React.FC = () => (
  <>
    <Navigation />
    <Hero />
    <Services />
    <ProcessTimeline />
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Find Your Perfect Structure</h2>
        <p className="text-slate-500 dark:text-slate-400">Not sure what to register? Use our AI tool.</p>
      </div>
      <BusinessWizard />
    </section>
    <Pricing />
    <Testimonials />
    <BlogPreview />
    <ConsultantAI />
    <Footer />
  </>
);

const ServicesListPage: React.FC = () => (
  <>
    <Navigation />
    <div className="pt-20">
      <div className="bg-slate-900 dark:bg-black text-white py-24 text-center">
         <h1 className="text-4xl font-bold mb-4">Our Services</h1>
         <p className="text-slate-400 max-w-2xl mx-auto px-4">Comprehensive corporate compliance solutions for the modern Namibian entrepreneur.</p>
      </div>
      <Services />
      <ProcessTimeline />
    </div>
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PricingProvider>
        <AuthProvider>
          <ViewModeProvider>
            <Router>
              <ScrollToTop />
              <ViewModeToggle />
              <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-chrimson-100 selection:text-chrimson-900 flex flex-col transition-colors duration-300">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/services" element={<ServicesListPage />} />
                  <Route path="/services/:slug" element={<><Navigation /><ServiceDetailPage /><Footer /></>} />
                  
                  <Route path="/pricing" element={<><Navigation /><div className="pt-20"><Pricing /></div><Footer /></>} />
                  <Route path="/tools" element={<><Navigation /><ToolsPage /><Footer /></>} />
                  <Route path="/blog" element={<><Navigation /><BlogPage /><Footer /></>} />
                  <Route path="/blog/:slug" element={<><Navigation /><BlogPostPage /><Footer /></>} />
                  <Route path="/about" element={<><Navigation /><AboutPage /><Footer /></>} />
                  <Route path="/contact" element={<><Navigation /><ContactPage /><Footer /></>} />
                  
                  {/* Legal Routes */}
                  <Route path="/terms" element={<><Navigation /><TermsOfService /><Footer /></>} />
                  <Route path="/privacy" element={<><Navigation /><PrivacyPolicy /><Footer /></>} />
                  <Route path="/refunds" element={<><Navigation /><RefundPolicy /><Footer /></>} />
                  <Route path="/disclaimer" element={<><Navigation /><Disclaimer /><Footer /></>} />

                  {/* Order Wizard */}
                  <Route path="/order" element={<OrderWizardPage />} />

                  {/* Client Portal */}
                  <Route path="/portal/:clientId" element={<ClientPortal />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  
                  <Route path="/admin/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard defaultTab="analytics" />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/admin/dashboard/projects" element={
                     <ProtectedRoute><Dashboard defaultTab="projects" /></ProtectedRoute>
                  } />
                   <Route path="/admin/dashboard/clients" element={
                     <ProtectedRoute><Dashboard defaultTab="clients" /></ProtectedRoute>
                  } />
                   <Route path="/admin/dashboard/tasks" element={
                     <ProtectedRoute><Dashboard defaultTab="tasks" /></ProtectedRoute>
                  } />
                  
                  <Route path="/admin/dashboard/invoices" element={
                    <ProtectedRoute><Dashboard defaultTab="invoices" /></ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard/invoices/new" element={
                    <ProtectedRoute><InvoiceBuilder /></ProtectedRoute>
                  } />
                  
                  <Route path="/admin/dashboard/quotations" element={
                    <ProtectedRoute><Dashboard defaultTab="quotations" /></ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard/quotations/new" element={
                    <ProtectedRoute><InvoiceBuilder /></ProtectedRoute>
                  } />
                  
                  <Route path="/admin/dashboard/blogs" element={
                    <ProtectedRoute><Dashboard defaultTab="blog" /></ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard/blogs/new" element={
                    <ProtectedRoute><BlogEditor /></ProtectedRoute>
                  } />
                  <Route path="/admin/dashboard/blogs/edit/:id" element={
                    <ProtectedRoute><BlogEditor /></ProtectedRoute>
                  } />
                  
                   <Route path="/admin/dashboard/settings" element={
                    <ProtectedRoute><Dashboard defaultTab="settings" /></ProtectedRoute>
                  } />
                  
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </div>
            </Router>
          </ViewModeProvider>
        </AuthProvider>
      </PricingProvider>
    </ThemeProvider>
  );
};

export default App;