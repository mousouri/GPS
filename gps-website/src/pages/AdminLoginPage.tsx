import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { adminLogin, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && isAdmin) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await adminLogin(email, password);
    setIsLoading(false);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid admin credentials. Try: admin@crestech.co.tz / admin123');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/analytics-screen.jpg"
          alt="Admin Control Center"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-950/90 via-dark-950/70 to-dark-950" />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Track<span className="gradient-text">Pro</span>
              </span>
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-red-400 uppercase tracking-wider">Admin Portal</h2>
                <p className="text-xs text-gray-500">Restricted Access</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4">
              Administration <br />
              <span className="gradient-text">Control Center</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md">
              Manage users, monitor system health, configure settings, and oversee all platform operations.
            </p>

            <div className="mt-12 space-y-4">
              {[
                'Full user & subscription management',
                'System analytics & performance monitoring',
                'Platform configuration & security',
              ].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">
                Track<span className="gradient-text">Pro</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="w-6 h-6 text-red-400" />
            <span className="text-sm font-medium text-red-400 uppercase tracking-wider">Admin Portal</span>
          </div>

          <h2 className="text-3xl font-bold mb-2">Admin Sign In</h2>
          <p className="text-gray-400 mb-8">Access the administration dashboard</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@crestech.co.tz"
                  required
                  className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-12 pr-12 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Admin Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
            <p className="text-xs text-gray-500 text-center">
              <span className="text-red-400 font-medium">Demo credentials:</span> admin@crestech.co.tz / admin123
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              ← Back to User Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
