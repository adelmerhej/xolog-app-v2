'use client'
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginButton } from '@/components/auth/login-button';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "services" },
    { name: "Our Vision", href: "visions" },
    { name: "Contact", href: "contact" },
  ];

  return (
    <motion.header 
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md py-2 shadow-lg' : 'bg-transparent py-4'}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" id="logo">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Image
              src="/logo@2x.png"
              alt="Spectrum logo"
              width={480}
              height={148}
              className="h-15 w-auto"
              priority
            />
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <motion.div
              key={link.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href={link.href} 
                className="relative text-gray-700 hover:text-blue-800 font-medium transition-colors"
              >
                {link.name}
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-800"
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
          
          <LoginButton>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size='lg' className="bg-blue-800 text-white hover:bg-blue-900 cursor-pointer">
                Sign in
              </Button>
            </motion.div>
          </LoginButton>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 flex flex-col space-y-1">
            <motion.span 
              animate={mobileMenuOpen ? { rotate: 45, y: 7 } : {}}
              className="h-0.5 bg-gray-700"
            />
            <motion.span 
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="h-0.5 bg-gray-700"
            />
            <motion.span 
              animate={mobileMenuOpen ? { rotate: -45, y: -7 } : {}}
              className="h-0.5 bg-gray-700"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-6 py-4 flex flex-col space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link 
                    href={link.href} 
                    className="block py-2 text-gray-700 hover:text-blue-800 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <LoginButton>
                <Button size='lg' className="w-full bg-blue-800 text-white hover:bg-blue-900 cursor-pointer">
                  Sign in
                </Button>
              </LoginButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}