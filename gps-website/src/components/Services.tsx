import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Truck, Car, Package, Users, Building2, Ship } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Fleet Management',
    description: 'Complete fleet tracking with driver management, fuel monitoring, maintenance scheduling, and comprehensive reporting for logistics companies.',
    features: ['Real-time fleet overview', 'Driver performance scoring', 'Fuel consumption tracking', 'Maintenance alerts'],
    gradient: 'from-primary-500 to-blue-600',
    bgGlow: 'bg-primary-500/10',
  },
  {
    icon: Car,
    title: 'Vehicle Tracking',
    description: 'Personal and commercial vehicle tracking with anti-theft protection, trip logging, and driving behavior analysis.',
    features: ['Anti-theft alerts', 'Trip history log', 'Speed monitoring', 'Remote immobilization'],
    gradient: 'from-accent-500 to-emerald-600',
    bgGlow: 'bg-accent-500/10',
  },
  {
    icon: Package,
    title: 'Asset Tracking',
    description: 'Track valuable equipment, containers, and cargo across the supply chain with real-time location and condition monitoring.',
    features: ['Container tracking', 'Temperature monitoring', 'Tamper detection', 'Chain of custody'],
    gradient: 'from-purple-500 to-violet-600',
    bgGlow: 'bg-purple-500/10',
  },
  {
    icon: Users,
    title: 'Personnel Tracking',
    description: 'Workforce safety and management with lone worker protection, attendance tracking, and emergency SOS capabilities.',
    features: ['Lone worker safety', 'SOS emergency button', 'Attendance tracking', 'Zone management'],
    gradient: 'from-orange-500 to-amber-600',
    bgGlow: 'bg-orange-500/10',
  },
  {
    icon: Building2,
    title: 'Enterprise Solutions',
    description: 'Custom GPS solutions for large organizations with dedicated support, API integrations, and white-label options.',
    features: ['Custom integrations', 'White-label platform', 'Dedicated support', 'SLA guarantee'],
    gradient: 'from-cyan-500 to-sky-600',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    icon: Ship,
    title: 'Marine Tracking',
    description: 'Vessel tracking and maritime fleet management with AIS integration, port notifications, and voyage reporting.',
    features: ['AIS integration', 'Port notifications', 'Voyage reports', 'Weather overlay'],
    gradient: 'from-indigo-500 to-blue-700',
    bgGlow: 'bg-indigo-500/10',
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group relative glass rounded-3xl p-8 hover:bg-white/[0.08] transition-all duration-500"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-px rounded-3xl ${service.bgGlow} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          <service.icon className="w-7 h-7 text-white" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-6">{service.description}</p>

        {/* Feature List */}
        <ul className="space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
              <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.gradient}`} />
              {feature}
            </li>
          ))}
        </ul>

        {/* Learn More */}
        <motion.button
          whileHover={{ x: 5 }}
          className="mt-6 text-sm font-medium gradient-text group-hover:underline"
        >
          Learn more →
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[120px]" />
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
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-accent-400 font-medium mb-4">
            Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Our </span>
            <span className="gradient-text">Services</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Tailored GPS tracking solutions for every industry and use case, 
            from individual vehicles to enterprise fleets.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <ServiceCard key={service.title} service={service} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
