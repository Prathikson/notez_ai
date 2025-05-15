import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Facebook, Twitter, Github, Linkedin, X } from 'lucide-react';

const links = [
  { name: 'Terms & Conditions', key: 'terms' },
  { name: 'Privacy Policy', key: 'privacy' },
];

const socialLinks = [
  { icon: <Github />, href: 'https://github.com/prathikson' },
  { icon: <Linkedin />, href: 'https://linkedin.com/in/prathikson' },
  { icon: <Twitter />, href: 'https://twitter.com/' },
  { icon: <Facebook />, href: 'https://facebook.com/' },
];

export default function Footer() {
  const [modal, setModal] = useState<'terms' | 'privacy' | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const closeModal = () => setModal(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    }
    if (modal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [modal]);

  const modalContent = {
    terms: "These Terms & Conditions govern your use of NoteZ AI. By using our service, you agree to our guidelines, limitations of liability, and user responsibilities. This service is for individual and team productivity only.",
    privacy: "Your privacy is important to us. NoteZ AI stores data securely and never shares personal information with third parties. We use industry best practices to ensure the safety of your data."
  };

  return (
    <footer className="bg-[#fffef0] text-[#003934] py-10 mt-20 border-t border-[#003934]/10">
<div className="max-w-[80%] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
        {/* Left - Links */}
    <nav className="flex flex-col md:items-start gap-4">
      {links.map(link => (
        <motion.button
          key={link.key}
          onClick={() => setModal(link.key as 'terms' | 'privacy')}
          className="relative font-medium"
          whileHover={{ scale: 1.05 }}
        >
          {link.name}
          <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#003934] transition-all duration-300 hover:w-full"></span>
        </motion.button>
      ))}
    </nav>

    {/* Center - Copyright */}
    <div className="text-sm space-y-1">
      <p>&copy; {new Date().getFullYear()} Notez AI. All rights reserved.</p>
      <p>
        Developed by <span className="font-semibold underline underline-offset-4">Prathikson Jeyakumar</span>
      </p>
    </div>

        {/* Socials */}
        <div className="flex justify-center md:justify-end gap-4">
          {socialLinks.map(({ icon, href }, i) => (
            <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200">
              <div className="text-[#003934]">{icon}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-[#003934] text-white max-w-lg w-full p-6 rounded-xl relative shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button onClick={closeModal} className="absolute top-4 right-4  text-white hover:text-gray-300">
                <X size={20} />
              </button>
              <h2 className="text-xl font-semibold mb-4 gap-12">
                {modal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
              </h2>
              <p className="text-sm leading-relaxed">{modalContent[modal]}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
