import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: [
      { label: 'Max 2 minutes per file', included: true },
      { label: '3 conversions / day', included: true },
      { label: 'Basic transcription', included: true },
      { label: 'Downloadable reports', included: false },
    ],
  },
  {
    name: 'Pay-per-Conversion',
    monthly: 1.0,
    yearly: 'N/A',
    features: [
      { label: 'Up to 20 minutes per file', included: true },
      { label: 'High accuracy transcription', included: true },
      { label: 'Downloadable reports', included: true },
      { label: 'No daily limits', included: true },
    ],
  },
  {
    name: 'Pro',
    monthly: 25.99,
    yearly: 259.99,
    features: [
      { label: 'Unlimited minutes', included: true },
      { label: 'Unlimited conversions', included: true },
      { label: 'Downloadable reports', included: true },
      { label: 'Priority processing', included: true },
    ],
    badge: 'Best Value',
  },
];

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  const toggleVariants = {
    off: { x: 0 },
    on: { x: 28 },
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  return (
    <section id='pricing' className="py-20 bg-primaryGreen text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2rem,5vw,2.5rem)] font-bold mb-2">
            Simple Pricing
          </h2>
          <p className="text-white/80">Choose the plan that suits you best</p>

          {/* Toggle Switch */}
          <div className="mt-6 inline-flex items-center gap-4">
            <span className="text-[#fffef0] font-medium">Monthly</span>
            <div
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-7 rounded-full cursor-pointer p-1 bg-[#fffef0] relative"
            >
              <motion.div
                layout
                variants={toggleVariants}
                animate={isAnnual ? 'on' : 'off'}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute w-5 h-5 bg-primaryGreen rounded-full top-1 left-1"
              />
            </div>
            <span className="text-[#fffef0] font-medium">Annual</span>
          </div>

          <p className="mt-2 text-sm text-[#fffef0]/70">
            {isAnnual ? 'Billed annually' : 'Billed monthly'}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const price = isAnnual ? plan.yearly : plan.monthly;
            const isStringPrice = typeof price === 'string';

            return (
              <motion.div
                key={plan.name}
                className="rounded-2xl bg-primaryGreen p-6 shadow-xl flex flex-col items-center justify-between gap-4 border border-white/20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                {plan.badge && (
                  <div className="px-3 py-1 text-sm bg-white text-primaryGreen font-bold rounded-full mb-2">
                    {plan.badge}
                  </div>
                )}

                <h3 className="text-2xl font-semibold">{plan.name}</h3>

                <motion.p
                  key={isAnnual ? 'yearly' : 'monthly'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-4xl font-bold tracking-tight"
                >
                  {isStringPrice ? price : formatPrice(price)}
                </motion.p>

                {!isStringPrice && plan.monthly > 0 && (
                  <p className="text-sm text-white/70">+ tax</p>
                )}

                <ul className="mt-4 space-y-2 w-full">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check size={18} className="text-green-400" />
                      ) : (
                        <X size={18} className="text-red-400" />
                      )}
                      <span className="text-white">{feature.label}</span>
                    </li>
                  ))}
                </ul>

                <button className="mt-6 bg-gradient-to-br from-white to-[#cfeee6] text-primaryGreen px-5 py-2 rounded-full font-medium hover:opacity-90 transition">
                  {plan.name === 'Free' ? 'Get Started' : 'Upgrade'}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
