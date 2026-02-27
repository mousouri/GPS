import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Zap, Crown, Building2 } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 19, yearly: 15 },
    description: 'Perfect for individual vehicle tracking',
    features: [
      'Up to 5 devices',
      'Real-time tracking (30s updates)',
      '30-day route history',
      'Basic geofencing (5 zones)',
      'Mobile app access',
      'Email alerts',
      'Standard support',
    ],
    cta: 'Start Free Trial',
    popular: false,
    gradient: 'from-gray-600 to-gray-700',
    image: '/images/truck-2.jpg',
  },
  {
    name: 'Professional',
    icon: Crown,
    price: { monthly: 49, yearly: 39 },
    description: 'Ideal for small to medium fleets',
    features: [
      'Up to 50 devices',
      'Real-time tracking (10s updates)',
      '90-day route history',
      'Advanced geofencing (unlimited)',
      'Mobile + desktop app',
      'SMS & email alerts',
      'Driver behavior scoring',
      'Fuel monitoring',
      'Priority support',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
    gradient: 'from-primary-500 to-accent-500',
    image: '/images/fleet-truck.jpg',
  },
  {
    name: 'Enterprise',
    icon: Building2,
    price: { monthly: 99, yearly: 79 },
    description: 'For large fleets and organizations',
    features: [
      'Unlimited devices',
      'Real-time tracking (5s updates)',
      'Unlimited route history',
      'Advanced geofencing + alerts',
      'All platform access',
      'All notification channels',
      'AI-powered analytics',
      'White-label option',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee (99.9%)',
      'On-premise deployment option',
    ],
    cta: 'Contact Sales',
    popular: false,
    gradient: 'from-purple-500 to-violet-600',
    image: '/images/skyscraper.jpg',
  },
];

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes! All plans include a 14-day free trial with no credit card required.' },
  { q: 'Can I switch plans later?', a: 'Absolutely. You can upgrade or downgrade at any time. Changes take effect immediately.' },
  { q: 'What hardware do I need?', a: 'We offer plug-and-play GPS devices starting at $49. Installation takes under 5 minutes.' },
  { q: 'Is there a long-term contract?', a: 'No. All plans are month-to-month. You can cancel anytime with no penalties.' },
  { q: 'Do you offer volume discounts?', a: 'Yes, we offer custom pricing for 100+ devices. Contact our sales team for details.' },
  { q: 'What about data privacy?', a: 'We\'re GDPR compliant with enterprise-grade encryption. Your data is always protected.' },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <div className="pt-20">
      {/* Hero Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/analytics-screen.jpg"
            alt="Pricing Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark-950/90" />
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
              Pricing
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Simple, Transparent </span>
              <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your tracking needs. All plans include 
              a 14-day free trial with no credit card required.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
              <motion.button
                onClick={() => setIsYearly(!isYearly)}
                className="relative w-14 h-7 rounded-full bg-white/10 border border-white/20 p-0.5"
              >
                <motion.div
                  animate={{ x: isYearly ? 26 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                />
              </motion.button>
              <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
                Yearly <span className="ml-1 text-xs text-accent-400 font-medium">Save 20%</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -10 }}
                className={`relative rounded-3xl overflow-hidden ${
                  plan.popular
                    ? 'glass-strong ring-2 ring-primary-500/50 shadow-lg shadow-primary-500/10'
                    : 'glass'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500" />
                )}

                {/* Plan Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={plan.image}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 to-dark-950/30" />
                  <div className="absolute bottom-4 left-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                        <plan.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{plan.name}</h3>
                        {plan.popular && <span className="text-xs font-medium text-primary-400">Most Popular</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-sm text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold gradient-text">
                        ${isYearly ? plan.price.yearly : plan.price.monthly}
                      </span>
                      <span className="text-gray-400 text-sm">/device/month</span>
                    </div>
                    {isYearly && (
                      <p className="text-xs text-accent-400 mt-1">
                        Billed annually (${plan.price.yearly * 12}/device/year)
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link to="/contact">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-dark-950 hover:shadow-lg hover:shadow-primary-500/25'
                          : 'glass text-white hover:bg-white/10'
                      }`}
                    >
                      {plan.cta}
                    </motion.span>
                  </Link>

                  <div className="border-t border-white/10 my-6" />

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                        <Check className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
          >
            <span className="text-white">Frequently Asked </span>
            <span className="gradient-text">Questions</span>
          </motion.h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-white font-medium hover:bg-white/5 transition-colors"
                >
                  {faq.q}
                  <motion.span
                    animate={{ rotate: openFaq === idx ? 180 : 0 }}
                    className="text-gray-400"
                  >
                    ▾
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-4 text-sm text-gray-400">{faq.a}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 lg:p-12"
          >
            <img
              src="/images/person-testimonial.jpg"
              alt="Satisfaction Guarantee"
              className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-accent-500"
            />
            <h3 className="text-2xl font-bold mb-3">30-Day Money-Back Guarantee</h3>
            <p className="text-gray-400 max-w-xl mx-auto">
              Not satisfied? Get a full refund within 30 days. No questions asked. 
              We're that confident in our platform.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
