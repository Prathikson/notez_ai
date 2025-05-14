import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  const height = useTransform(scrollY, [0, 80], [88, 64]);
  const shadow = useTransform(scrollY, [0, 80], ["0px 0px 0px rgba(0,0,0,0)", "0px 4px 20px rgba(0,0,0,0.05)"]);
  const scale = useTransform(scrollY, [0, 80], [1, 0.97]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrolled(latest > 10);
    });
  }, [scrollY]);

  const navLinks = [
    { name: 'Pricing', href: '#pricing' },
    { name: 'Donate', href: '#donate' }
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height,
        backgroundColor: '#fffef0',
        boxShadow: shadow,
        scale
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold" style={{ color: '#003934' }}>
          <a href='/'><span className="cursor-pointer">Notez AI</span></a>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8">
          {navLinks.map(link => (
            <motion.a
              key={link.name}
              href={link.href}
              className="relative group font-medium transition-colors duration-200"
              style={{ color: '#003934' }}
              whileHover={{ scale: 1.05 }}
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primaryGreen transition-all duration-300 group-hover:w-full"></span>
            </motion.a>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <motion.button
            className="text-sm font-medium transition duration-200 border border-primaryGreen text-primaryGreen px-4 py-1.5 rounded-full hover:underline"
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
          <motion.button
            className="bg-primaryGreen text-white text-sm font-medium px-4 py-2 rounded-full transition duration-200 hover:opacity-90"
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
