import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  MapPin, Navigation, Shield, Bell, BarChart3, Smartphone,
  Zap, Globe, Lock, Gauge, Route, Wifi
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your vehicles, assets, and personnel in real-time with updates every 5 seconds on an interactive map.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Route,
    title: 'Route History',
    description: 'Access complete route history with playback. Analyze routes taken and optimize for better efficiency.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    description: 'Set up geofence alerts, speed warnings, and custom notifications delivered instantly to your device.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive reports on mileage, fuel usage, driver behavior, and fleet performance metrics.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Anti-Theft Protection',
    description: 'Instant alerts on unauthorized movement. Remote immobilization and recovery assistance.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Full-featured mobile app for iOS and Android. Track everything right from your pocket.',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Plug-and-play devices with automatic configuration. Get started in minutes, not hours.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Globe,
    title: 'Global Coverage',
    description: 'Worldwide GPS tracking with multi-network SIM. Track across borders without interruption.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: Lock,
    title: 'Data Security',
    description: 'Enterprise-grade encryption and secure data centers. Your tracking data is always protected.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Gauge,
    title: 'Driver Scoring',
    description: 'Monitor driving behavior with acceleration, braking, and cornering analysis for safer fleets.',
    color: 'from-pink-500 to-pink-600',
  },
  {
    icon: Navigation,
    title: 'Live Navigation',
    description: 'Real-time turn-by-turn navigation with traffic updates and ETA predictions for your drivers.',
    color: 'from-teal-500 to-teal-600',
  },
  {
    icon: Wifi,
    title: 'API Integration',
    description: 'RESTful API and webhooks for seamless integration with your existing business systems.',
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
      whileHover={{ y: -8, scale: 1.02 }}
      className="group glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 cursor-default"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <feature.icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
    </motion.div>
  );
}

export default function Features() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Powerful </span>
            <span className="gradient-text">Features</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to track, manage, and optimize your fleet and assets 
            with cutting-edge GPS technology.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
