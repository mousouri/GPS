import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
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
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-100px' });

  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-primary-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary-400 font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-white">Simple, Transparent </span>
            <span className="gradient-text">Pricing</span>
          </h2>
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
              Yearly
              <span className="ml-2 text-xs text-accent-400 font-medium">Save 20%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
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

              <div className="p-8">
                {/* Plan header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center`}>
                    <plan.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{plan.name}</h3>
                    {plan.popular && (
                      <span className="text-xs font-medium text-primary-400">Most Popular</span>
                    )}
                  </div>
                </div>

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
                      Billed annually (${(isYearly ? plan.price.yearly : plan.price.monthly) * 12}/device/year)
                    </p>
                  )}
                </div>

                {/* CTA */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-lg hover:shadow-primary-500/25'
                      : 'glass text-white hover:bg-white/10'
                  }`}
                >
                  {plan.cta}
                </motion.button>

                {/* Divider */}
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

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-12"
        >
          All plans include SSL encryption, GDPR compliance, and 24/7 monitoring. 
          Volume discounts available for 100+ devices.
        </motion.p>
      </div>
    </section>
  );
}
