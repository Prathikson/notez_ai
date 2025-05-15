import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    monthly: 0,
    yearly: 0,
    features: [
      { label: 'Up to 60 mins / mo', included: true },
      { label: 'Basic transcription', included: true },
      { label: 'Downloadable reports', included: false },
      { label: 'Priority processing', included: false },
    ],
  },
  {
    name: 'Pro',
    monthly: 20.99,
    yearly: 199.99,
    features: [
      { label: 'Up to 500 mins / mo', included: true },
      { label: 'High accuracy transcription', included: true },
      { label: 'Downloadable reports', included: true },
      { label: 'Priority processing', included: true },
    ],
    badge: 'Best Value',
  },
  {
    name: 'NoteZ AI',
    monthly: 89.99,
    yearly: 899.99,
    features: [
      { label: 'Unlimited minutes', included: true },
      { label: 'All Pro features', included: true },
      { label: 'Team dashboard', included: true },
      { label: 'Enterprise support', included: true },
    ],
  },
];

function AnimatedCounter({ value }: { value: number }) {
  const controls = useAnimation();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    controls.start({ count: value });
  }, [value]);

  useEffect(() => {
    controls.start(i => ({
      count: value,
      transition: { duration: 0.6, ease: 'easeOut' },
    })).then(() => setDisplay(value));
  }, [value]);

  return <motion.span>{`$${display.toFixed(2)}`}</motion.span>;
}

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [prices, setPrices] = useState(plans.map(p => p.monthly));

  useEffect(() => {
    const targetPrices = plans.map(p => (isAnnual ? p.yearly : p.monthly));
    const duration = 600;
    const frameRate = 30;
    const totalFrames = duration / (1000 / frameRate);

    let frame = 0;
    const interval = setInterval(() => {
      setPrices(prev =>
        prev.map((curr, i) => {
          const diff = targetPrices[i] - curr;
          if (Math.abs(diff) < 0.01) return targetPrices[i];
          return curr + diff / (totalFrames - frame);
        })
      );
      frame++;
      if (frame >= totalFrames) clearInterval(interval);
    }, 1000 / frameRate);
  }, [isAnnual]);

  return (
    <section id='pricing' className="py-20 bg-primaryGreen text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(2rem,5vw,2.5rem)] font-bold text-white mb-2">Pricing</h2>
          <p className="text-white/80">Choose the plan that suits you best</p>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center gap-4">
            <span className="text-[#fffef0] font-medium">Monthly</span>
            <div
              onClick={() => setIsAnnual(!isAnnual)}
              className={`w-14 h-7 rounded-full cursor-pointer p-1 bg-[#fffef0] transition duration-300 flex ${
                isAnnual ? 'justify-end' : 'justify-start'
              }`}
            >
              <motion.div
                layout
                className="w-5 h-5 bg-primaryGreen rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ type: 'spring', stiffness: 300, duration: 0.5 }}
              />
            </div>
            <span className="text-[#fffef0] font-medium">Annual</span>
          </div>
          <p className="mt-2 text-sm text-[#fffef0]/70">
            {isAnnual ? 'Billed annually' : 'Billed monthly'}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className="rounded-2xl bg-primaryGreen p-6 shadow-xl flex flex-col items-center justify-between gap-4 border border-white/20"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.005 }}
            >
              {plan.badge && (
                <motion.div
                  className="px-3 py-1 text-sm bg-white text-primaryGreen font-bold rounded-full mb-2 animate-pulse"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {plan.badge}
                </motion.div>
              )}

              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <motion.p className="text-4xl font-bold tracking-tight">
                {prices[i] === 0 ? 'Free' : <AnimatedCounter value={prices[i]} />}
              </motion.p>
              {plan.monthly > 0 && (
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
          ))}
        </div>
      </div>
    </section>
  );
}
