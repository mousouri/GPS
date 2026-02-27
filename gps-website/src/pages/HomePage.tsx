import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Shield, ArrowRight, Satellite, Radio, Truck, BarChart3, Smartphone } from 'lucide-react';

const stats = [
  { value: '50K+', label: 'Active Devices', icon: MapPin },
  { value: '99.9%', label: 'Uptime', icon: Shield },
  { value: '120+', label: 'Countries', icon: Navigation },
  { value: '24/7', label: 'Live Support', icon: Radio },
];

const highlights = [
  {
    icon: Truck,
    title: 'Fleet Management',
    desc: 'Track and manage your entire fleet in real-time with advanced analytics.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop',
  },
  {
    icon: Satellite,
    title: 'Satellite Precision',
    desc: 'Sub-meter accuracy using multi-constellation GNSS technology.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&h=400&fit=crop',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'AI-powered insights to optimize routes, reduce costs, and improve safety.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  },
];

export default function HomePage() {
  return (
    <div className="pt-20">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1920&h=1080&fit=crop"
            alt="GPS Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950/95 via-dark-950/80 to-dark-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <span className="text-sm text-gray-300">Real-time GPS Tracking Technology</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
              >
                <span className="text-white">Track </span>
                <span className="gradient-text">Everything</span>
                <br />
                <span className="text-white">Anywhere</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-lg mb-8"
              >
                Advanced GPS tracking solutions for vehicles, assets, and personnel. 
                Get real-time location data, route history, and intelligent alerts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(51, 150, 255, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-2xl flex items-center gap-2 text-lg"
                  >
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                </Link>
                <Link to="/features">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 glass text-white font-semibold rounded-2xl hover:bg-white/10 transition-colors text-lg inline-block"
                  >
                    Explore Features
                  </motion.span>
                </Link>
              </motion.div>
            </div>

            {/* Right - Device Mockup Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=600&h=700&fit=crop"
                  alt="GPS Tracking App on Mobile"
                  className="rounded-3xl shadow-2xl shadow-primary-500/20 border border-white/10"
                />
                {/* Floating card */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -left-8 top-1/4 glass-strong rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-accent-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Location Updated</p>
                      <p className="text-sm font-semibold text-white">Vehicle #247</p>
                    </div>
                  </div>
                </motion.div>
                {/* Floating card 2 */}
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute -right-4 bottom-1/4 glass-strong rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Speed</p>
                      <p className="text-sm font-semibold text-white">65 km/h</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass rounded-2xl p-6 text-center group cursor-default"
              >
                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-3 group-hover:text-accent-400 transition-colors" />
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights with Photos */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Why Choose </span>
              <span className="gradient-text">TrackPro?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Industry-leading GPS solutions trusted by thousands of businesses worldwide.
            </p>
          </motion.div>

          <div className="space-y-20">
            {highlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6`}>
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">{item.desc}</p>
                  <Link to="/features">
                    <motion.span
                      whileHover={{ x: 5 }}
                      className="inline-flex items-center gap-2 gradient-text font-semibold text-lg"
                    >
                      Learn More <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Link>
                </div>
                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary-500/10"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-[350px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Background Image */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=600&fit=crop"
            alt="Technology"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-950/85" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              <span className="text-white">Ready to Get </span>
              <span className="gradient-text">Started?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ devices tracked worldwide. Start your free 14-day trial today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-2xl inline-block"
                >
                  Start Free Trial
                </motion.span>
              </Link>
              <Link to="/pricing">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 glass text-white font-semibold rounded-2xl inline-block hover:bg-white/10"
                >
                  View Pricing
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section with Logos */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm uppercase tracking-widest mb-8">Trusted by industry leaders</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-40">
            {['DHL', 'FedEx', 'Maersk', 'UPS', 'Amazon', 'Tesla'].map((name) => (
              <div key={name} className="text-2xl font-bold text-gray-400 tracking-wider">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
