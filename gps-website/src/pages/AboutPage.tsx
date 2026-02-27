import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Target, Eye, Award, TrendingUp, Globe, Users } from 'lucide-react';

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

const team = [
  {
    name: 'Alex Rivera',
    role: 'CEO & Founder',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
    bio: '15+ years in GPS technology and fleet management.',
  },
  {
    name: 'Sarah Chen',
    role: 'CTO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
    bio: 'Former Google engineer, satellite systems expert.',
  },
  {
    name: 'Marcus Johnson',
    role: 'VP of Engineering',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Built tracking systems for Fortune 500 companies.',
  },
  {
    name: 'Emily Park',
    role: 'Head of Product',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
    bio: 'Passionate about intuitive user experiences.',
  },
];

export default function AboutPage() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=600&fit=crop"
            alt="About Us"
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
            <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Who We </span>
              <span className="gradient-text">Are</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              TrackPro GPS is a global leader in GPS tracking and fleet management solutions.
              We empower businesses with real-time location intelligence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section with Image */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=500&fit=crop"
                alt="Our Team Working"
                className="rounded-3xl shadow-2xl shadow-primary-500/10 border border-white/10"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-white">Our </span>
                <span className="gradient-text">Story</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Founded in 2015, TrackPro GPS started with a simple mission: make GPS tracking 
                accessible, accurate, and affordable for everyone. What began as a small startup 
                in Silicon Valley has grown into a global platform serving thousands of businesses 
                across 120+ countries.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Our team of 200+ engineers, designers, and support specialists work around the clock 
                to deliver the best tracking experience. From satellite engineers to customer success 
                managers, every member is dedicated to your success.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">10+</div>
                  <div className="text-sm text-gray-400">Years Experience</div>
                </div>
                <div className="glass rounded-2xl p-5 text-center">
                  <div className="text-3xl font-bold gradient-text mb-1">200+</div>
                  <div className="text-sm text-gray-400">Team Members</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision with Images */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative glass rounded-3xl overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=700&h=300&fit=crop"
                alt="Our Mission"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-8">
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
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative glass rounded-3xl overflow-hidden group"
            >
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=700&h=300&fit=crop"
                alt="Our Vision"
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">Our Vision</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  To become the world's most trusted GPS platform, connecting every vehicle, 
                  asset, and person to a smarter, safer network powered by AI and satellite 
                  technology.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            <span className="text-white">Our Core </span>
            <span className="gradient-text">Values</span>
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-6 text-center group hover:bg-white/[0.08] transition-all"
              >
                <value.icon className="w-10 h-10 text-primary-400 mx-auto mb-4 group-hover:text-accent-400 transition-colors" />
                <h4 className="font-bold text-lg mb-2">{value.title}</h4>
                <p className="text-sm text-gray-400">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-white">Meet Our </span>
              <span className="gradient-text">Team</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              The brilliant minds behind TrackPro GPS.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-3xl overflow-hidden group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                </div>
                <div className="p-5 -mt-8 relative">
                  <h4 className="font-bold text-lg">{member.name}</h4>
                  <p className="text-sm gradient-text font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-16"
          >
            <span className="text-white">Our </span>
            <span className="gradient-text">Journey</span>
          </motion.h2>
          <div className="relative">
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
        </div>
      </section>

      {/* Office Image */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=500&fit=crop"
              alt="TrackPro Office"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-dark-950/20 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-2xl font-bold text-white mb-2">Our Headquarters</h3>
              <p className="text-gray-300">San Francisco, CA — Where innovation meets tracking.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-3xl p-8 lg:p-12">
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
          </div>
        </div>
      </section>
    </div>
  );
}
