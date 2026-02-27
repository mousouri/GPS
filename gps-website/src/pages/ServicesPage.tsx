import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Car, Package, Users, Building2, Ship, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Truck,
    title: 'Fleet Management',
    description: 'Complete fleet tracking with driver management, fuel monitoring, maintenance scheduling, and comprehensive reporting for logistics companies.',
    features: ['Real-time fleet overview', 'Driver performance scoring', 'Fuel consumption tracking', 'Maintenance alerts'],
    image: '/images/fleet-truck.jpg',
    gradient: 'from-primary-500 to-blue-600',
  },
  {
    icon: Car,
    title: 'Vehicle Tracking',
    description: 'Personal and commercial vehicle tracking with anti-theft protection, trip logging, and driving behavior analysis.',
    features: ['Anti-theft alerts', 'Trip history log', 'Speed monitoring', 'Remote immobilization'],
    image: '/images/truck-2.jpg',
    gradient: 'from-accent-500 to-emerald-600',
  },
  {
    icon: Package,
    title: 'Asset Tracking',
    description: 'Track valuable equipment, containers, and cargo across the supply chain with real-time location and condition monitoring.',
    features: ['Container tracking', 'Temperature monitoring', 'Tamper detection', 'Chain of custody'],
    image: '/images/warehouse.jpg',
    gradient: 'from-purple-500 to-violet-600',
  },
  {
    icon: Users,
    title: 'Personnel Tracking',
    description: 'Workforce safety and management with lone worker protection, attendance tracking, and emergency SOS capabilities.',
    features: ['Lone worker safety', 'SOS emergency button', 'Attendance tracking', 'Zone management'],
    image: '/images/team-meeting.jpg',
    gradient: 'from-orange-500 to-amber-600',
  },
  {
    icon: Building2,
    title: 'Enterprise Solutions',
    description: 'Custom GPS solutions for large organizations with dedicated support, API integrations, and white-label options.',
    features: ['Custom integrations', 'White-label platform', 'Dedicated support', 'SLA guarantee'],
    image: '/images/skyscraper.jpg',
    gradient: 'from-cyan-500 to-sky-600',
  },
  {
    icon: Ship,
    title: 'Marine Tracking',
    description: 'Vessel tracking and maritime fleet management with AIS integration, port notifications, and voyage reporting.',
    features: ['AIS integration', 'Port notifications', 'Voyage reports', 'Weather overlay'],
    image: '/images/logistics.jpg',
    gradient: 'from-indigo-500 to-blue-700',
  },
];

export default function ServicesPage() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/woman-laptop.jpg"
            alt="Services Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-950/85" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={headerRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-accent-400 font-medium mb-4">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Tailored </span>
              <span className="gradient-text">Solutions</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              GPS tracking solutions designed for every industry and use case, 
              from individual vehicles to enterprise fleets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services - Alternating Layout */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7 }}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              {/* Image */}
              <div className={idx % 2 === 1 ? 'lg:order-2' : ''}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl group"
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950/60 to-transparent" />
                  <div className={`absolute top-6 left-6 w-12 h-12 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg`}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className={idx % 2 === 1 ? 'lg:order-1' : ''}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 lg:hidden`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{service.title}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{service.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-gray-300">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link to="/contact">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-xl"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-20 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0">
          <img
            src="/images/office-tech.jpg"
            alt="CTA Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-950/90" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-white">Not Sure Which Service </span>
              <span className="gradient-text">Fits You?</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Our experts will help you find the perfect tracking solution for your needs.
            </p>
            <Link to="/contact">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-2xl"
              >
                Talk to an Expert
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
