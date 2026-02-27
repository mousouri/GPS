import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, ChevronDown, HelpCircle, MessageCircle,
  Zap, Shield, CreditCard, Settings, Truck, MapPin,
} from 'lucide-react';

const faqCategories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'tracking', label: 'GPS Tracking', icon: MapPin },
  { id: 'fleet', label: 'Fleet Management', icon: Truck },
  { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  { id: 'security', label: 'Security & Privacy', icon: Shield },
  { id: 'technical', label: 'Technical Support', icon: Settings },
];

const faqs = [
  {
    id: 1,
    category: 'getting-started',
    question: 'How do I get started with TrackPro?',
    answer: 'Getting started is easy! Simply sign up for an account, choose your plan, and install our GPS tracking devices on your vehicles. Our onboarding team will guide you through the setup process. Most customers are up and running within 24 hours.',
  },
  {
    id: 2,
    category: 'getting-started',
    question: 'What devices are compatible with TrackPro?',
    answer: 'TrackPro is compatible with a wide range of GPS tracking devices including our proprietary TrackPro GPS Pro, GPS Mini, and OBD-II connectors. We also support third-party devices from major manufacturers. Contact our sales team for a complete compatibility list.',
  },
  {
    id: 3,
    category: 'tracking',
    question: 'How accurate is the GPS tracking?',
    answer: 'Our GPS tracking provides accuracy within 2-5 meters under open sky conditions. We use multi-constellation GNSS receivers (GPS, GLONASS, Galileo) for maximum accuracy. Indoor or urban canyon areas may have slightly reduced accuracy.',
  },
  {
    id: 4,
    category: 'tracking',
    question: 'How often does the location update?',
    answer: 'Location updates depend on your plan and device configuration. Standard tracking updates every 30 seconds, while real-time tracking on Professional and Enterprise plans can update as frequently as every 5 seconds.',
  },
  {
    id: 5,
    category: 'fleet',
    question: 'Can I set up geofence alerts?',
    answer: 'Yes! Our Geofence Manager allows you to create circular, rectangular, or polygon zones. You can set alerts for when vehicles enter, exit, or overstay in a zone. Alerts can be sent via email, SMS, or push notification.',
  },
  {
    id: 6,
    category: 'fleet',
    question: 'How many vehicles can I track?',
    answer: 'There\'s no hard limit on the number of vehicles. Our Starter plan includes up to 10 vehicles, Professional up to 50, and Enterprise offers unlimited vehicle tracking. Additional vehicles can be added to any plan for an extra fee.',
  },
  {
    id: 7,
    category: 'billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), ACH bank transfers, PayPal, and wire transfers for Enterprise customers. All payments are processed securely through Stripe.',
  },
  {
    id: 8,
    category: 'billing',
    question: 'Can I change my plan at any time?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and you\'ll be charged the prorated difference. Downgrades take effect at the start of your next billing cycle.',
  },
  {
    id: 9,
    category: 'billing',
    question: 'Is there a free trial available?',
    answer: 'Yes! We offer a 14-day free trial on all plans with no credit card required. You get full access to all features during the trial period. Our team is available to help you make the most of your trial.',
  },
  {
    id: 10,
    category: 'security',
    question: 'How is my data protected?',
    answer: 'We take security seriously. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We maintain SOC 2 Type II compliance, undergo regular security audits, and host our infrastructure on AWS with multi-region redundancy.',
  },
  {
    id: 11,
    category: 'security',
    question: 'Do you sell or share customer data?',
    answer: 'Absolutely not. Your data belongs to you. We never sell, share, or use customer data for advertising purposes. Our privacy policy clearly outlines how we handle data, and we comply with GDPR, CCPA, and other privacy regulations.',
  },
  {
    id: 12,
    category: 'technical',
    question: 'What happens if a device loses connection?',
    answer: 'Our devices have built-in memory that stores location data when offline. Once the connection is restored, all stored data points are automatically uploaded to the platform. Devices can store up to 30 days of tracking data offline.',
  },
  {
    id: 13,
    category: 'technical',
    question: 'Do you provide an API for integration?',
    answer: 'Yes, we offer a comprehensive RESTful API and webhooks for integration with your existing systems. Our API documentation includes examples for common integrations with ERP, CRM, and dispatch software. Enterprise customers get dedicated API support.',
  },
  {
    id: 14,
    category: 'technical',
    question: 'What is the device battery life?',
    answer: 'Battery life varies by device and tracking frequency. Our GPS Pro (wired) runs on vehicle power indefinitely. The GPS Mini (battery-powered) lasts 2-4 weeks on standard tracking or up to 6 months with motion-activated tracking.',
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(1);

  const filtered = faqs.filter((f) => {
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-600/10 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-primary-400" />
            <span className="text-sm text-gray-300">Help Center</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-xl mx-auto mb-8">
            Find answers to common questions about TrackPro GPS tracking, fleet management features, pricing, and more.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="text" placeholder="Search questions..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 glass rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 border border-white/10" />
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* Category Filters */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-10 justify-center">
          {faqCategories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-primary-500 text-dark-950 shadow-lg shadow-primary-500/25'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}>
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filtered.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3 flex-1 pr-4">
                  <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${openId === faq.id ? 'text-primary-400' : 'text-gray-600'}`} />
                  <span className={`font-medium transition-colors ${openId === faq.id ? 'text-white' : 'text-gray-300'}`}>
                    {faq.question}
                  </span>
                </div>
                <motion.div animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pl-13">
                      <p className="text-gray-400 leading-relaxed ml-8">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No questions found</h3>
            <p className="text-gray-500">Try a different search term or category.</p>
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center glass rounded-3xl border border-white/5 p-10"
        >
          <MessageCircle className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Can't find what you're looking for? Our support team is ready to help.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/contact"
              className="px-6 py-3 bg-primary-500 text-dark-950 rounded-xl font-medium hover:bg-primary-600 transition-colors">
              Contact Support
            </Link>
            <a href="mailto:support@trackpro.com"
              className="px-6 py-3 bg-white/5 text-gray-300 rounded-xl font-medium hover:bg-white/10 transition-colors">
              Email Us
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
