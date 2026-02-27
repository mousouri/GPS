import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from './BrandMark';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Services', path: '/services' },
  { name: 'About', path: '/about' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Blog', path: '/blog' },
  { name: 'FAQ', path: '/faq' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-strong shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-2">
              <div className="relative">
                <BrandMark className="h-10 w-auto rounded-xl relative z-10" />
                <div className="absolute inset-0 blur-lg opacity-35 group-hover:opacity-55 transition-opacity bg-primary-500/20 rounded-2xl" />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.span
                  className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 inline-block ${
                    location.pathname === link.path
                      ? 'text-white bg-white/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 glass text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </motion.span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-gray-400 hover:text-red-400 text-sm font-medium rounded-xl hover:bg-red-500/10 transition-all flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 glass text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </motion.span>
                </Link>
                <Link to="/register">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-shadow inline-block"
                  >
                    Get Started
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link, idx) => (
                <Link key={link.name} to={link.path}>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`block px-4 py-3 rounded-xl transition-colors ${
                      location.pathname === link.path
                        ? 'text-white bg-white/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'}>
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                      className="block px-4 py-3 mt-2 text-center glass text-white font-semibold rounded-xl"
                    >
                      Dashboard
                    </motion.span>
                  </Link>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={handleLogout}
                    className="block w-full px-4 py-3 mt-1 text-center text-red-400 hover:bg-red-500/10 font-medium rounded-xl transition-colors"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                      className="block px-4 py-3 mt-2 text-center glass text-white font-medium rounded-xl"
                    >
                      Sign In
                    </motion.span>
                  </Link>
                  <Link to="/register">
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="block px-4 py-3 mt-1 text-center bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-xl"
                    >
                      Get Started
                    </motion.span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
