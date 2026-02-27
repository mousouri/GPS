import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Navigation, Shield, Bell, BarChart3, Smartphone,
  Zap, Globe, Lock, Gauge, Route, Wifi, ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your vehicles, assets, and personnel in real-time with updates every 5 seconds on an interactive map.',
    image: 'https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=500&h=300&fit=crop',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Route,
    title: 'Route History',
    description: 'Access complete route history with playback. Analyze routes taken and optimize for better efficiency.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&h=300&fit=crop',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Set up geofence alerts, speed warnings, and custom notifications delivered instantly to your device.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&h=300&fit=crop',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reports on mileage, fuel usage, driver behavior, and fleet performance metrics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Anti-Theft Protection',
    description: 'Instant alerts on unauthorized movement. Remote immobilization and recovery assistance.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=500&h=300&fit=crop',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Full-featured mobile app for iOS and Android. Track everything right from your pocket.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&h=300&fit=crop',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Plug-and-play devices with automatic configuration. Get started in minutes, not hours.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=500&h=300&fit=crop',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Worldwide GPS tracking with multi-network SIM. Track across borders without interruption.',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&h=300&fit=crop',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Enterprise-grade encryption and secure data centers. Your tracking data is always protected.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f2?w=500&h=300&fit=crop',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Gauge,
    title: 'Driver Scoring',
    description: 'Monitor driving behavior with acceleration, braking, and cornering analysis for safer fleets.',
    image: 'https://images.unsplash.com/photo-1449965408869-ebd13bc9e5a8?w=500&h=300&fit=crop',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Navigation,
    title: 'Live Navigation',
    description: 'Real-time turn-by-turn navigation with traffic updates and ETA predictions for your drivers.',
    image: 'https://images.unsplash.com/photo-1476242906366-d8eb64c2f661?w=500&h=300&fit=crop',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Wifi,
    title: 'API Integration',
    description: 'RESTful API and webhooks for seamless integration with your existing business systems.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop',
    color: 'from-violet-500 to-violet-600',
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      whileHover={{ y: -8 }}
      className="group glass rounded-3xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />
        <div className={`absolute top-4 left-4 w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
          <feature.icon className="w-5 h-5 text-white" />
        </div>
      </div>
      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function FeaturesPage() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=600&fit=crop"
            alt="Technology Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-950/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
              Features
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Powerful </span>
              <span className="gradient-text">Features</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to track, manage, and optimize your fleet and assets 
              with cutting-edge GPS technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <FeatureCard key={feature.title} feature={feature} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-white">All-in-One </span>
                <span className="gradient-text">Dashboard</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Monitor your entire fleet from a single, intuitive dashboard. See real-time 
                positions, check vehicle status, review alerts, and generate reports — all 
                in one place.
              </p>
              <ul className="space-y-3 mb-8">
                {['Interactive live map', 'Customizable widgets', 'Real-time notifications', 'Export reports to PDF/Excel'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl"
                >
                  Request a Demo <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700&h=500&fit=crop"
                alt="Dashboard Analytics"
                className="rounded-3xl shadow-2xl shadow-primary-500/10 border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
