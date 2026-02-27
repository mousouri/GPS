import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Send, MapPin, Phone, Mail, Clock, MessageSquare, CheckCircle } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, label: 'Office', value: 'Plot 42, Sam Nujoma Road, Dar es Salaam, Tanzania' },
  { icon: Phone, label: 'Phone', value: '+255 719 600 648' },
  { icon: Mail, label: 'Email', value: 'hello@crestech.co.tz' },
  { icon: Clock, label: 'Hours', value: '24/7 Support Available' },
];

export default function ContactPage() {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });
  const [formState, setFormState] = useState({
    name: '', email: '', company: '', phone: '', service: '', message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/phone-contact.jpg"
            alt="Contact Us"
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
              Contact Us
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Get In </span>
              <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ready to transform your tracking? Reach out to our team and we'll 
              help you find the perfect solution.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Left: Info + Map Image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Cards */}
              {contactInfo.map((info, idx) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl p-5 flex items-start gap-4 group hover:bg-white/[0.08] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1">{info.label}</div>
                    <div className="text-sm text-gray-400">{info.value}</div>
                  </div>
                </motion.div>
              ))}

              {/* Map Image */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-2xl overflow-hidden border border-white/10"
              >
                <img
                  src="/images/map-aerial.jpg"
                  alt="Office Location Map"
                  className="w-full h-48 object-cover"
                />
              </motion.div>

              {/* Live Chat CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="glass rounded-2xl p-6 text-center"
              >
                <MessageSquare className="w-10 h-10 text-accent-400 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Need Quick Help?</h4>
                <p className="text-sm text-gray-400 mb-4">Our team typically responds within 5 minutes.</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2.5 bg-gradient-to-r from-accent-600 to-accent-500 text-white text-sm font-semibold rounded-xl"
                >
                  Start Live Chat
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8">
                <h3 className="text-xl font-bold mb-6">
                  <span className="gradient-text">Send us a message</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Full Name *</label>
                    <input
                      type="text" name="name" value={formState.name} onChange={handleChange}
                      placeholder="John Doe" required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Email *</label>
                    <input
                      type="email" name="email" value={formState.email} onChange={handleChange}
                      placeholder="john@company.com" required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Company</label>
                    <input
                      type="text" name="company" value={formState.company} onChange={handleChange}
                      placeholder="Your Company"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Phone</label>
                    <input
                      type="tel" name="phone" value={formState.phone} onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-400 mb-1.5">Service Interest</label>
                  <select
                    name="service" value={formState.service} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm appearance-none"
                  >
                    <option value="" className="bg-dark-900">Select a service</option>
                    <option value="fleet" className="bg-dark-900">Fleet Management</option>
                    <option value="vehicle" className="bg-dark-900">Vehicle Tracking</option>
                    <option value="asset" className="bg-dark-900">Asset Tracking</option>
                    <option value="personnel" className="bg-dark-900">Personnel Tracking</option>
                    <option value="enterprise" className="bg-dark-900">Enterprise Solutions</option>
                    <option value="marine" className="bg-dark-900">Marine Tracking</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1.5">Message *</label>
                  <textarea
                    name="message" value={formState.message} onChange={handleChange}
                    placeholder="Tell us about your tracking needs..." rows={5} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm resize-none"
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary-500/25 transition-shadow"
                >
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent Successfully!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Photos */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-center mb-8"
          >
            <span className="text-white">Visit Our </span>
            <span className="gradient-text">Offices</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[ 
              { city: 'Dar es Salaam', country: 'Tanzania — Headquarters', image: '/images/san-francisco.jpg' },
              { city: 'Arusha', country: 'Tanzania', image: '/images/london.jpg' },
              { city: 'Mwanza', country: 'Tanzania', image: '/images/dubai.jpg' },
            ].map((office, idx) => (
              <motion.div
                key={office.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative rounded-2xl overflow-hidden group glass"
              >
                <img
                  src={office.image}
                  alt={office.city}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h4 className="font-bold text-white">{office.city}</h4>
                  <p className="text-sm text-gray-300">{office.country}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
