import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Marcus Johnson',
    role: 'Fleet Manager',
    company: 'Swift Logistics',
    image: 'MJ',
    rating: 5,
    text: 'TrackPro GPS has transformed our fleet operations. We\'ve reduced fuel costs by 23% and improved delivery times by 15%. The real-time tracking is incredibly accurate and the reporting is comprehensive.',
  },
  {
    name: 'Sarah Chen',
    role: 'Operations Director',
    company: 'Pacific Freight',
    image: 'SC',
    rating: 5,
    text: 'The best GPS tracking platform we\'ve ever used. The mobile app is intuitive, the alerts are customizable, and the customer support team is phenomenal. We switched from our old provider within a week.',
  },
  {
    name: 'David Rodriguez',
    role: 'CEO',
    company: 'Urban Express',
    image: 'DR',
    rating: 5,
    text: 'With over 500 vehicles in our fleet, we needed a robust solution. TrackPro delivered beyond expectations. The API integration with our existing systems was seamless.',
  },
  {
    name: 'Emma Williams',
    role: 'Security Manager',
    company: 'Apex Construction',
    image: 'EW',
    rating: 5,
    text: 'We\'ve recovered 3 stolen vehicles thanks to TrackPro\'s anti-theft features. The instant alerts and real-time tracking made it possible. Worth every penny.',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Logistics Head',
    company: 'Gulf Transport Co.',
    image: 'AH',
    rating: 5,
    text: 'Outstanding platform for international tracking. We track our fleet across 15 countries without any coverage gaps. The geofencing feature has been a game-changer for route compliance.',
  },
  {
    name: 'Lisa Park',
    role: 'VP Operations',
    company: 'FreshDeliver',
    image: 'LP',
    rating: 5,
    text: 'The temperature monitoring integration saved us thousands in spoiled goods. Combined with GPS tracking, we have full supply chain visibility. Highly recommended!',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  const visibleCount = 3;
  const maxIndex = testimonials.length - visibleCount;

  const next = () => setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  const prev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <section id="testimonials" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-accent-400 font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">What Our Clients </span>
            <span className="gradient-text">Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Trusted by thousands of businesses worldwide. Here's what our clients 
            have to say about their experience with TrackPro GPS.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * (100 / visibleCount + 2)}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="min-w-[calc(33.333%-16px)] max-w-[calc(33.333%-16px)] flex-shrink-0 hidden lg:block"
                >
                  <div className="glass rounded-3xl p-8 h-full group hover:bg-white/[0.08] transition-all duration-300">
                    <Quote className="w-8 h-8 text-primary-500/30 mb-4" />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-dark-950 font-bold text-sm">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                        <div className="text-xs text-gray-400">{testimonial.role}, {testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Mobile: Show all as stack */}
          <div className="lg:hidden space-y-4">
            {testimonials.slice(0, 3).map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass rounded-3xl p-6"
              >
                <Quote className="w-6 h-6 text-primary-500/30 mb-3" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-dark-950 font-bold text-xs">
                    {testimonial.image}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-400">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Arrows (desktop only) */}
          <div className="hidden lg:flex justify-center gap-3 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              disabled={currentIndex === 0}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
