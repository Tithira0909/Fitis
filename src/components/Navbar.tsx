import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'Introduction',
    href: '/Home/introduction',
    submenu: [
      { name: 'Introduction', href: '/Home/introduction' },
      { name: 'Leadership Team', href: '/Home/leadership-team' },
      { name: 'Chairman\'s Message', href: '/Home/chairman-message' },
      { name: 'Code of Conduct', href: '/Home/code-of-conduct' },
      { name: 'Code of Ethics', href: '/Home/code-of-ethics' },
      { name: 'Past Leaders', href: '/Home/past-leaders' },
      { name: 'Secretariat Team', href: '/Home/secretariat-team' },
    ]
  },
  { name: 'News', href: '/Home/news' },
  { name: 'Events', href: '/Home/events' },
  { name: 'Programs', href: '/Home/programs' },
  {
    name: 'Chapters',
    href: '/Chapter/chapters',
    submenu: [] // Will be populated dynamically
  },
  { name: 'Partnerships', href: '/Home/partnerships' },
  {
    name: 'Members',
    href: '#',
    submenu: [
      { name: 'Become a Member', href: '/Home/become-a-member' },
      { name: 'Member Benefits', href: '/Home/member-benefits' }
    ]
  },
  { name: 'Gallery', href: '/Home/gallery' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [dynamicNavLinks, setDynamicNavLinks] = useState(navLinks);
  const location = useLocation();

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/chapters`);
        if (res.ok) {
          const chaptersData = await res.json();
          const chapterSubmenu = [
            { name: 'Chapters', href: '/Chapter/chapters' },
            ...chaptersData.map((c: any) => ({
              name: c.name,
              href: `/Chapter/${c.slug}`
            }))
          ];

          setDynamicNavLinks(prev => prev.map(link =>
            link.name === 'Chapters' ? { ...link, submenu: chapterSubmenu } : link
          ));
        }
      } catch (err) {
        console.error('Failed to load chapters for nav', err);
      }
    };

    fetchChapters();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Introduction',
      href: '/Home/introduction',
      submenu: [
        { name: 'Introduction', href: '/Home/introduction' },
        { name: 'Leadership Team', href: '/Home/leadership-team' },
        { name: 'Chairman\'s Message', href: '/Home/chairman-message' },
        { name: 'Code of Conduct', href: '/Home/code-of-conduct' },
        { name: 'Code of Ethics', href: '/Home/code-of-ethics' },
        { name: 'Past Leaders', href: '/Home/past-leaders' },
        { name: 'Secretariat Team', href: '/Home/secretariat-team' },
      ]
    },
    { name: 'News', href: '/Home/news' },
    { name: 'Events', href: '/Home/events' },
    { name: 'Programs', href: '/Home/programs' },
    { name: 'Chapters', href: '/Chapter/chapters' },
    { name: 'Partnerships', href: '/Home/partnerships' },
    {
      name: 'Members',
      href: '#',
      submenu: [
        { name: 'Become a Member', href: '/Home/become-a-member' },
        { name: 'Member Benefits', href: '/Home/member-benefits' }
      ]
    },
    { name: 'Gallery', href: '/Home/gallery' },
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
          <img src="/fitis-logo.png" alt="FITIS Logo" className="h-10 w-auto bg-white rounded p-1" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {dynamicNavLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.submenu && setIsIntroOpen(true)}
              onMouseLeave={() => link.submenu && setIsIntroOpen(false)}
            >
              <Link
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center gap-1",
                  isScrolled || location.pathname !== '/'
                    ? (isActive(link.href) ? "text-fitis-blue" : "text-slate-600 hover:text-fitis-blue")
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.name}
                {link.submenu && <ChevronDown size={14} className={cn("transition-transform duration-200", isIntroOpen && "rotate-180")} />}
              </Link>

              {/* Dropdown Menu */}
              {link.submenu && (
                <AnimatePresence>
                  {isIntroOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-4 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 overflow-hidden"
                    >
                      {link.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          to={subItem.href}
                          onClick={() => setIsIntroOpen(false)}
                          className={cn(
                            "block px-5 py-2.5 text-sm transition-colors",
                            location.pathname === subItem.href
                              ? "text-fitis-blue bg-blue-50/50 font-semibold"
                              : "text-slate-600 hover:text-fitis-blue hover:bg-slate-50"
                          )}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
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
            className="absolute top-full left-0 right-0 max-h-[calc(100vh-80px)] overflow-y-auto bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {dynamicNavLinks.map((link) => (
              <div key={link.name} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    to={link.href}
                    onClick={() => {
                      if (!link.submenu) setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "text-lg font-medium transition-colors flex-1",
                      isActive(link.href) ? "text-fitis-blue" : "text-slate-600 hover:text-fitis-blue"
                    )}
                  >
                    {link.name}
                  </Link>
                  {link.submenu && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsIntroOpen(!isIntroOpen);
                      }}
                      className="p-2 text-slate-500"
                    >
                      <ChevronDown size={20} className={cn("transition-transform duration-200", isIntroOpen && "rotate-180")} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu Accordion */}
                {link.submenu && isIntroOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-col gap-3 pl-4 mt-3 border-l-2 border-slate-100 overflow-hidden"
                  >
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "text-base transition-colors py-1",
                          location.pathname === subItem.href
                            ? "text-fitis-blue font-semibold"
                            : "text-slate-500 hover:text-fitis-blue"
                        )}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
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
