import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center max-w-lg"
      >
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">Track<span className="gradient-text">Pro</span></span>
        </Link>

        {/* 404 */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-[8rem] sm:text-[10rem] font-black leading-none gradient-text">404</h1>
        </motion.div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Looks like this location is off the map. The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Search */}
        <div className="relative max-w-sm mx-auto mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search for pages..."
            className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/">
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-shadow"
            >
              <Home className="w-4 h-4" />
              Go Home
            </motion.span>
          </Link>
          <button onClick={() => window.history.back()}>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 glass text-white font-medium rounded-xl hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </motion.span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-sm text-gray-500 mb-4">Quick links</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'Features', path: '/features' },
              { name: 'Pricing', path: '/pricing' },
              { name: 'Contact', path: '/contact' },
            ].map((link) => (
              <Link key={link.name} to={link.path} className="text-sm text-gray-400 hover:text-primary-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
