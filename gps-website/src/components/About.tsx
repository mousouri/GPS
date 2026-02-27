import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Award, TrendingUp, Users, Globe } from 'lucide-react';

const milestones = [
  { year: '2015', event: 'Founded in Silicon Valley with a vision for smarter tracking' },
  { year: '2017', event: 'Reached 10,000 active devices globally' },
  { year: '2019', event: 'Launched enterprise fleet management platform' },
  { year: '2021', event: 'Expanded to 80+ countries with multi-language support' },
  { year: '2023', event: 'AI-powered predictive analytics introduced' },
  { year: '2025', event: '50,000+ devices tracked across 120+ countries' },
];

const values = [
  { icon: Target, title: 'Precision', desc: 'Sub-meter accuracy with advanced GNSS technology' },
  { icon: Eye, title: 'Transparency', desc: 'Clear pricing, honest data, no hidden agendas' },
  { icon: Award, title: 'Excellence', desc: 'Award-winning support and continuous innovation' },
  { icon: TrendingUp, title: 'Growth', desc: 'Scaled solutions that grow with your business' },
];

export default function About() {
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
  const isStatsInView = useInView(statsRef, { once: true, margin: '-50px' });

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            About Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Who We </span>
            <span className="gradient-text">Are</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto">
            CRESTECH is a leading provider of GPS tracking and IoT solutions in Tanzania. Simple, Reliable, Local.
            We empower businesses and individuals with real-time location intelligence 
            powered by cutting-edge satellite technology.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
          {/* Mission & Vision */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                To provide the most reliable, accurate, and accessible GPS tracking solutions 
                that help businesses optimize operations, protect assets, and ensure safety — 
                all while delivering an exceptional user experience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">Our Team</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Our team of 200+ engineers, designers, and support specialists work around the clock 
                to deliver the best tracking experience. From satellite engineers to customer success managers, 
                every member is dedicated to your success.
              </p>
            </motion.div>

            {/* Values */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, idx) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl p-5 text-center group hover:bg-white/[0.08] transition-colors"
                >
                  <value.icon className="w-8 h-8 text-primary-400 mx-auto mb-2 group-hover:text-accent-400 transition-colors" />
                  <h4 className="font-semibold text-sm mb-1">{value.title}</h4>
                  <p className="text-xs text-gray-500">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-8">
              Our <span className="gradient-text">Journey</span>
            </h3>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500/20" />

              <div className="space-y-8">
                {milestones.map((milestone, idx) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-start gap-6 pl-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0 z-10">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="glass rounded-2xl p-5 flex-1">
                      <span className="text-sm font-bold gradient-text">{milestone.year}</span>
                      <p className="text-gray-300 text-sm mt-1">{milestone.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 lg:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '10+', label: 'Years of Experience' },
              { value: '50K+', label: 'Devices Deployed' },
              { value: '200+', label: 'Team Members' },
              { value: '98%', label: 'Client Retention' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
