import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, User, Building2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/BrandMark';

const plans = [
  { id: 'starter', name: 'Starter', price: '$29', desc: 'Up to 10 devices' },
  { id: 'professional', name: 'Professional', price: '$79', desc: 'Up to 50 devices', popular: true },
  { id: 'enterprise', name: 'Enterprise', price: '$199', desc: 'Unlimited devices' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();

  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (step === 1) {
      if (!name || !email || !company) {
        setError('Please fill in all fields.');
        return;
      }
      setStep(2);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please agree to the terms and conditions.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        company,
        plan: selectedPlan,
      });
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to create your account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/images/skyscraper.jpg"
          alt="Modern Building"
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
              <BrandMark className="h-10 w-auto rounded-xl" />
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              Start tracking <br />
              <span className="gradient-text">in minutes</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-12">
              Launch with real accounts, real devices, and a backend-backed fleet workspace from day one.
            </p>

            <div className="space-y-5">
              {[
                'Immediate access to your private fleet dashboard',
                'Seeded devices, reports, and billing to get started faster',
                'Password reset and profile management included',
              ].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-accent-400" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2">
              <BrandMark className="h-10 w-auto rounded-xl" />
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((currentStep) => (
              <div key={currentStep} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= currentStep ? 'bg-primary-500 text-dark-950' : 'bg-white/5 text-gray-500'
                }`}>
                  {step > currentStep ? <Check className="w-4 h-4" /> : currentStep}
                </div>
                <span className={`text-sm ${step >= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {currentStep === 1 ? 'Account' : 'Security & Plan'}
                </span>
                {currentStep < 2 && <div className={`w-12 h-0.5 mx-2 ${step > 1 ? 'bg-primary-500' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>

          <h2 className="text-3xl font-bold mb-2">Create Account</h2>
          <p className="text-gray-400 mb-8">{step === 1 ? 'Enter your business details' : 'Secure your account & choose a plan'}</p>

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
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="John Anderson"
                      required
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="john@company.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      placeholder="Anderson Logistics"
                      required
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Min. 6 characters"
                      required
                      className="w-full pl-12 pr-12 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm your password"
                      required
                      className="w-full pl-12 pr-4 py-3.5 glass rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Select Plan</label>
                  <div className="space-y-2">
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                          selectedPlan === plan.id ? 'glass-strong border-primary-500/50 ring-1 ring-primary-500/30' : 'glass hover:bg-white/[0.07]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedPlan === plan.id ? 'border-primary-500 bg-primary-500' : 'border-gray-600'
                          }`}>
                            {selectedPlan === plan.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-white">
                              {plan.name} {plan.popular && <span className="text-xs text-primary-400 ml-1">Popular</span>}
                            </p>
                            <p className="text-xs text-gray-500">{plan.desc}</p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-white">{plan.price}<span className="text-xs text-gray-500">/mo</span></span>
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) => setAgreeTerms(event.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-600 bg-dark-800 text-primary-500 focus:ring-primary-500/50"
                  />
                  <span className="text-sm text-gray-400">
                    I agree to the <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </motion.div>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <motion.button
                  type="button"
                  onClick={() => setStep(1)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3.5 glass text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                >
                  Back
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-dark-950/30 border-t-dark-950 rounded-full animate-spin" />
                ) : (
                  <>{step === 1 ? 'Continue' : 'Create Account'} <ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
