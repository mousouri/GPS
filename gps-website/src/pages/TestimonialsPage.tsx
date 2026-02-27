import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Johnson',
    role: 'Fleet Manager',
    company: 'Swift Logistics',
    image: '/images/person-man-1.jpg',
    rating: 5,
    text: 'TrackPro GPS has transformed our fleet operations. We\'ve reduced fuel costs by 23% and improved delivery times by 15%. The real-time tracking is incredibly accurate and the reporting is comprehensive.',
    companyImage: '/images/fleet-truck.jpg',
  },
  {
    name: 'Sarah Chen',
    role: 'Operations Director',
    company: 'Pacific Freight',
    image: '/images/person-woman-1.jpg',
    rating: 5,
    text: 'The best GPS tracking platform we\'ve ever used. The mobile app is intuitive, the alerts are customizable, and the customer support team is phenomenal. We switched from our old provider within a week.',
    companyImage: '/images/warehouse.jpg',
  },
  {
    name: 'David Rodriguez',
    role: 'CEO',
    company: 'Urban Express',
    image: '/images/person-man-2.jpg',
    rating: 5,
    text: 'With over 500 vehicles in our fleet, we needed a robust solution. TrackPro delivered beyond expectations. The API integration with our existing systems was seamless.',
    companyImage: '/images/driving-road.jpg',
  },
  {
    name: 'Emma Williams',
    role: 'Security Manager',
    company: 'Apex Construction',
    image: '/images/person-woman-2.jpg',
    rating: 5,
    text: 'We\'ve recovered 3 stolen vehicles thanks to TrackPro\'s anti-theft features. The instant alerts and real-time tracking made it possible. Worth every penny.',
    companyImage: '/images/construction.jpg',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Logistics Head',
    company: 'Gulf Transport Co.',
    image: '/images/person-businessman.jpg',
    rating: 5,
    text: 'Outstanding platform for international tracking. We track our fleet across 15 countries without any coverage gaps. The geofencing feature has been a game-changer for route compliance.',
    companyImage: '/images/logistics.jpg',
  },
  {
    name: 'Lisa Park',
    role: 'VP Operations',
    company: 'FreshDeliver',
    image: '/images/person-woman-3.jpg',
    rating: 5,
    text: 'The temperature monitoring integration saved us thousands in spoiled goods. Combined with GPS tracking, we have full supply chain visibility. Highly recommended!',
    companyImage: '/images/warehouse-2.jpg',
  },
];

export default function TestimonialsPage() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/team-meeting.jpg"
            alt="Testimonials"
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
              Testimonials
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">What Our Clients </span>
              <span className="gradient-text">Say</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Trusted by thousands of businesses worldwide. Here's what our clients 
              have to say about their experience with TrackPro GPS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '4.9/5', label: 'Average Rating' },
              { value: '2,500+', label: 'Reviews' },
              { value: '98%', label: 'Recommend Us' },
              { value: '95%', label: 'Renewal Rate' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
                className="glass rounded-3xl overflow-hidden group"
              >
                {/* Company Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={testimonial.companyImage}
                    alt={testimonial.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <p className="text-sm font-medium text-primary-400">{testimonial.company}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <Quote className="w-8 h-8 text-primary-500/20 mb-4" />
                  
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-gray-300 leading-relaxed mb-6">
                    "{testimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/30"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}, {testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-3 py-1 rounded-full glass text-xs text-accent-400 font-medium mb-4">
                CASE STUDY
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                <span className="text-white">How Swift Logistics </span>
                <span className="gradient-text">Saved 23% on Fuel</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                By implementing TrackPro's fleet management solution, Swift Logistics optimized 
                routes, reduced idle time, and improved driver behavior — resulting in significant 
                cost savings and faster deliveries.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { value: '23%', label: 'Fuel Saved' },
                  { value: '15%', label: 'Faster Delivery' },
                  { value: '40%', label: 'Less Idle Time' },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <div className="text-xl font-bold gradient-text">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/images/fleet-truck.jpg"
                alt="Swift Logistics Fleet"
                className="rounded-3xl shadow-2xl shadow-primary-500/10 border border-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
