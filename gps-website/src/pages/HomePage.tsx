import { motion, type Variants, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Shield, ArrowRight, Satellite, Radio, Truck, BarChart3, Smartphone, Play, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState } from 'react';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1, scale: 1,
    transition: { delay: i * 0.08, type: 'spring', stiffness: 120, damping: 14 },
  }),
};

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
    image: '/images/fleet-truck.jpg',
  },
  {
    icon: Satellite,
    title: 'Satellite Precision',
    desc: 'Sub-meter accuracy using multi-constellation GNSS technology.',
    image: '/images/satellite.jpg',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    desc: 'AI-powered insights to optimize routes, reduce costs, and improve safety.',
    image: '/images/dashboard-analytics.jpg',
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
            src="/images/laptops-workspace.jpg"
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
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                <span className="text-sm text-gray-300">Real-time GPS Tracking Technology</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6"
              >
                <span className="text-white">Track </span>
                <span className="gradient-text">Everything</span>
                <br />
                <span className="text-white">Anywhere</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={2}
                className="text-lg text-gray-400 max-w-lg mb-8"
              >
                Advanced GPS tracking solutions for vehicles, assets, and personnel. 
                Get real-time location data, route history, and intelligent alerts.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="flex flex-wrap gap-4"
              >
                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(234, 179, 8, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-2xl flex items-center gap-2 text-lg"
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
              initial={{ opacity: 0, x: 60, rotateY: -8 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 60, damping: 16 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <img
                  src="/images/phone-mockup.jpg"
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
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                variants={scaleIn}
                custom={idx}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="glass rounded-2xl p-6 text-center group cursor-default"
              >
                <stat.icon className="w-6 h-6 text-primary-400 mx-auto mb-3 group-hover:text-accent-400 transition-colors" />
                <div className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ Fleet Video Showcase Section ═══ */}
      <section className="relative py-28 overflow-hidden">
        {/* Blurred Truck Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/fleet-truck.jpg"
            alt=""
            className="w-full h-full object-cover scale-110 blur-xl brightness-[0.25]"
          />
          <div className="absolute inset-0 bg-dark-950/60" />
          {/* Animated glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/15 rounded-full blur-[100px]"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={0}
            className="text-center mb-14"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '80px' }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mb-6 rounded-full"
            />
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
              <span className="text-white">Our Fleet in </span>
              <span className="gradient-text">Action</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Watch our GPS-tracked fleet navigate highways with real-time precision monitoring.
              Every vehicle, every route, every second — tracked and optimized.
            </p>
          </motion.div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl mx-auto"
          >
            {/* Glow border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/30 via-accent-500/20 to-primary-500/30 rounded-[2rem] blur-lg" />
            
            {/* Video wrapper */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-primary-500/10">
              {/* Main truck video */}
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
                poster="/images/fleet-truck.jpg"
              >
                <source src="/videos/fleet-video.mp4" type="video/mp4" />
              </video>

              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-dark-950/20 pointer-events-none" />

              {/* Animated HUD overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top-left: Live indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center gap-2 glass rounded-full px-4 py-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs sm:text-sm font-medium text-white">LIVE TRACKING</span>
                </motion.div>

                {/* Top-right: Vehicle count */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute top-4 sm:top-6 right-4 sm:right-6 glass rounded-xl px-4 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary-400" />
                    <span className="text-xs sm:text-sm font-medium text-white">247 Vehicles Active</span>
                  </div>
                </motion.div>

                {/* Bottom-left: Speed/location info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 glass rounded-xl p-3 sm:p-4"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Avg. Speed</p>
                      <p className="text-lg sm:text-xl font-bold text-primary-400">72 km/h</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">Distance</p>
                      <p className="text-lg sm:text-xl font-bold text-accent-400">1,847 km</p>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden sm:block" />
                    <div className="hidden sm:block">
                      <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider">ETA</p>
                      <p className="text-lg sm:text-xl font-bold text-white">3h 24m</p>
                    </div>
                  </div>
                </motion.div>

                {/* Bottom-right: Map pin animation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6"
                >
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="glass rounded-xl p-3 sm:p-4 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-400" />
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-xs text-gray-400">Current Route</p>
                      <p className="text-sm font-semibold text-white">I-95 North • Mile 342</p>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Scanning line animation */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400/40 to-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* Stats under video */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-4xl mx-auto"
          >
            {[
              { value: '2.4M', label: 'Miles Tracked Daily', color: 'text-primary-400' },
              { value: '99.7%', label: 'On-Time Delivery', color: 'text-accent-400' },
              { value: '34%', label: 'Fuel Savings', color: 'text-primary-400' },
              { value: '<2s', label: 'Update Interval', color: 'text-accent-400' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                variants={scaleIn}
                custom={i}
                className="glass rounded-xl p-4 text-center hover:bg-white/[0.06] transition-colors"
              >
                <div className={`text-2xl sm:text-3xl font-bold ${item.color} mb-1`}>{item.value}</div>
                <div className="text-xs sm:text-sm text-gray-500">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Highlights with Photos */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-white">Why Choose </span>
              <span className="gradient-text">CRESTECH?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Tanzania's trusted GPS and IoT solutions partner.
            </p>
          </motion.div>

          <div className="space-y-20">
            {highlights.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-6`}
                  >
                    <item.icon className="w-7 h-7 text-dark-950" />
                  </motion.div>
                  <h3 className="text-3xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed mb-6">{item.desc}</p>
                  <Link to="/features">
                    <motion.span
                      whileHover={{ x: 8, transition: { type: 'spring', stiffness: 400 } }}
                      className="inline-flex items-center gap-2 gradient-text font-semibold text-lg"
                    >
                      Learn More <ArrowRight className="w-5 h-5" />
                    </motion.span>
                  </Link>
                </div>
                <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                  <motion.div
                    whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
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
            src="/images/office-tech.jpg"
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
                  className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-2xl inline-block"
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
