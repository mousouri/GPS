import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';
import CookieConsent from './components/CookieConsent';

// Pages
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import PricingPage from './pages/PricingPage';
import TestimonialsPage from './pages/TestimonialsPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import FAQPage from './pages/FAQPage';

// Auth Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';

// User Dashboard Pages
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import LiveMapPage from './pages/LiveMapPage';
import ReportsPage from './pages/ReportsPage';
import GeofencePage from './pages/GeofencePage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserDetailPage from './pages/AdminUserDetailPage';
import AdminBillingPage from './pages/AdminBillingPage';
import AdminAuditLogPage from './pages/AdminAuditLogPage';

// 404
import NotFoundPage from './pages/NotFoundPage';

// Layout with Navbar & Footer for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main><PageTransition>{children}</PageTransition></main>
      <Footer />
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Pages */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/features" element={<PublicLayout><FeaturesPage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/pricing" element={<PublicLayout><PricingPage /></PublicLayout>} />
        <Route path="/testimonials" element={<PublicLayout><TestimonialsPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />

        {/* Auth Pages (no Navbar/Footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Protected: User Dashboard Pages */}
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="user"><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute requiredRole="user"><ProfilePage /></ProtectedRoute>} />
        <Route path="/dashboard/map" element={<ProtectedRoute requiredRole="user"><LiveMapPage /></ProtectedRoute>} />
        <Route path="/dashboard/reports" element={<ProtectedRoute requiredRole="user"><ReportsPage /></ProtectedRoute>} />
        <Route path="/dashboard/geofence" element={<ProtectedRoute requiredRole="user"><GeofencePage /></ProtectedRoute>} />

        {/* Protected: Admin Pages */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute requiredRole="admin"><AdminUserDetailPage /></ProtectedRoute>} />
        <Route path="/admin/billing" element={<ProtectedRoute requiredRole="admin"><AdminBillingPage /></ProtectedRoute>} />
        <Route path="/admin/audit-log" element={<ProtectedRoute requiredRole="admin"><AdminAuditLogPage /></ProtectedRoute>} />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="relative">
            <AnimatedRoutes />
            <ThemeToggle />
            <CookieConsent />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
