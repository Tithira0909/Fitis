import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import Logo from '../assets/images/logo.jpeg';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Introduction', href: '/Home/introduction' },
    { name: 'News', href: '/Home/news' },
    { name: 'Events', href: '/Home/event_homenow' },
    { name: 'Chapters', href: '/Chapter/chapters' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      isScrolled || location.pathname !== '/' ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={Logo}
            alt="MK Event & Media Solutions Logo"
            className="h-10 w-auto rounded-md object-contain bg-slate-900/50 p-1"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled || location.pathname !== '/' 
                  ? (isActive(link.href) ? "text-fitis-blue" : "text-slate-600 hover:text-fitis-blue")
                  : "text-white/80 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          <button className={cn(
            "px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg active:scale-95",
            isScrolled || location.pathname !== '/' ? "bg-fitis-blue text-white hover:bg-fitis-blue-light" : "bg-white text-fitis-blue hover:bg-white/90"
          )}>
            Join Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn(
            "md:hidden",
            isScrolled || location.pathname !== '/' ? "text-fitis-blue" : "text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-lg font-medium transition-colors",
                  isActive(link.href) ? "text-fitis-blue" : "text-slate-600 hover:text-fitis-blue"
                )}
              >
                {link.name}
              </Link>
            ))}
            <button className="w-full bg-fitis-blue text-white py-3 rounded-xl font-semibold">
              Join Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
