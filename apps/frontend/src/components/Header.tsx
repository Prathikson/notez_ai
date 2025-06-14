import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, DollarSign } from 'lucide-react';

type UserStatus = 'free' | 'pay-per-conversion' | 'pro';

const statusConfig: Record<UserStatus, { label: string; icon: JSX.Element; color: string }> = {
  free: {
    label: 'Free',
    icon: <DollarSign size={16} />,
    color: '#003934', // gray-400
  },
  'pay-per-conversion': {
    label: 'Pay/Conversion',
    icon: <DollarSign size={16} />,
    color: '#f59e0b', // amber-500
  },
  pro: {
    label: 'Pro',
    icon: <CheckCircle size={16} />,
    color: '#10b981', // emerald-500
  },
};

export default function Header() {
  // Replace this with real user auth state
  const [userStatus] = useState<UserStatus>('free');

  const navLinks = [
    { name: 'Pricing', href: '#pricing' },
    { name: 'Donate', href: '#donate' },
  ];

  const { label, icon, color } = statusConfig[userStatus];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[#003934]/10"
      style={{
        backgroundColor: 'rgba(255, 254, 240, 0.6)', // Semi-transparent background
      }}
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-[#003934] hover:opacity-80 transition-opacity duration-200">
          Notez AI
        </a>

        {/* Nav */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              className="relative group font-medium text-[#003934] transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#003934] transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </nav>

        {/* Right: status + auth */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold select-none"
            style={{ backgroundColor: `${color}22`, color }}
            title={`User status: ${label}`}
          >
            {icon}
            <span>{label}</span>
          </div>

          <motion.button
            className="text-sm font-medium border border-[#003934] text-[#003934] px-4 py-1.5 rounded-full hover:underline transition duration-200"
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button
            className="bg-[#003934] text-white text-sm font-medium px-4 py-2 rounded-full hover:opacity-90 transition duration-200"
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
