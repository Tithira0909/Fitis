import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react';

import { cn } from '../lib/utils';
import { getImageUrl } from '../utils/getImageUrl';

const navLinks = [
  { name: 'Home', href: '/' },
  {
    name: 'Introduction',
    href: '/Home/introduction',
    submenu: [
      { name: 'Introduction', href: '/Home/introduction' },
      { name: 'Leadership Team', href: '/Home/leadership-team' },
      { name: 'Chairman\'s Message', href: '/Home/chairman-message' },
      { name: 'Code of Conduct', href: '/Home/code-of-ethics' },
      { name: 'Past Leaders', href: '/Home/past-leaders' },
      { name: 'Secretariat Team', href: '/Home/secretariat-team' },
    ]
  },
  {
    name: 'News',
    href: '#',
    submenu: [
      { name: 'Press Room', href: '/Home/news' },
      { name: 'Newsletters', href: '/Home/newsletters' }
    ]
  },
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
      { name: 'Member Community', href: '/Home/member-community' },
      { name: 'Member Benefits', href: '/Home/member-benefits' }
    ]
  },
  { name: 'Gallery', href: '/Home/gallery' },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dynamicNavLinks, setDynamicNavLinks] = useState<any[]>(navLinks);
  const [headerLogo, setHeaderLogo] = useState('/fitis-logo.png');
  const [hoveredAuth, setHoveredAuth] = useState<'login' | 'register' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('communityToken');
    localStorage.removeItem('communityUser');
    navigate('/');
    window.location.reload();
  };

  const communityToken = localStorage.getItem('communityToken');
  const communityUser = JSON.parse(localStorage.getItem('communityUser') || 'null');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/site-settings?t=${new Date().getTime()}`;
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.header_logo_url) {
            setHeaderLogo(getImageUrl(data.header_logo_url));
          }
        }
      } catch (err) {
        console.error('Failed to fetch site settings', err);
      }
    };
    fetchSettings();
  }, []);

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
            src={(!isScrolled && location.pathname === '/') ? '/fitis-logo-white.png' : headerLogo} 
            alt="FITIS Logo" 
            className="h-16 md:h-20 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {dynamicNavLinks.map((link) => (
            <div
              key={link.name}
              className="relative group"
              onMouseEnter={() => link.submenu && setActiveDropdown(link.name)}
              onMouseLeave={() => link.submenu && setActiveDropdown(null)}
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
                {link.submenu && <ChevronDown size={14} className={cn("transition-transform duration-200", activeDropdown === link.name && "rotate-180")} />}
              </Link>

              {/* Dropdown Menu */}
              {link.submenu && (
                <AnimatePresence>
                  {activeDropdown === link.name && (
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
                          onClick={() => setActiveDropdown(null)}
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
          {communityToken && communityUser ? (
            <div className="flex items-center gap-4 ml-2">
              <Link 
                to="/member-dashboard"
                className={cn(
                  "hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                  isScrolled || location.pathname !== '/' 
                    ? "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100" 
                    : "bg-white/10 border-white/20 backdrop-blur-md text-white hover:bg-white/20"
                )}
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button 
                onClick={handleLogout} 
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-sm border",
                  isScrolled || location.pathname !== '/' 
                    ? "bg-white border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200" 
                    : "bg-white/10 border-white/20 backdrop-blur-md text-white hover:bg-white/20"
                )}
              >
                Sign Out
              </button>
            </div>
          ) : (

            <div 
              className={cn(
                "relative flex items-center rounded-full p-1 shadow-sm border transition-colors duration-300 gap-1",
                isScrolled || location.pathname !== '/' 
                  ? "bg-slate-50 border-slate-200" 
                  : "bg-white/10 border-white/20 backdrop-blur-md"
              )}
              onMouseLeave={() => setHoveredAuth(null)}
            >
              {/* Sliding Background */}
              <div
                className="absolute top-1 bottom-1 w-28 rounded-full transition-all duration-300 animate-in ease-out shadow-md bg-fitis-blue"
                style={{
                  left: '4px',
                  transform: hoveredAuth === 'login' ? 'translateX(0)' : 'translateX(116px)'
                }}
              />

              <Link 
                to="/login" 
                className={cn(
                  "relative z-10 px-6 py-2 w-28 text-center rounded-full text-sm font-bold transition-colors duration-300",
                  hoveredAuth === 'login' ? "text-white" :
                  (isScrolled || location.pathname !== '/') ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
                )}
                onMouseEnter={() => setHoveredAuth('login')}
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className={cn(
                  "relative z-10 px-6 py-2 w-28 text-center rounded-full text-sm font-bold transition-colors duration-300",
                  (hoveredAuth === 'register' || hoveredAuth === null) ? "text-white" :
                  (isScrolled || location.pathname !== '/') ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
                )}
                onMouseEnter={() => setHoveredAuth('register')}
              >
                Sign Up
              </Link>
            </div>
          )}
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
                        setActiveDropdown(activeDropdown === link.name ? null : link.name);
                      }}
                      className="p-2 text-slate-500"
                    >
                      <ChevronDown size={20} className={cn("transition-transform duration-200", activeDropdown === link.name && "rotate-180")} />
                    </button>
                  )}
                </div>

                {/* Mobile Submenu Accordion */}
                {link.submenu && activeDropdown === link.name && (
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
            {communityToken && communityUser ? (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/member-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-center border border-blue-100 flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} /> Member Dashboard
                </Link>
                <button onClick={handleLogout} className="bg-red-50 text-red-600 py-3 rounded-xl font-bold text-center border border-red-100">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-center hover:bg-slate-200 shadow-sm transition-colors border border-slate-200">
                  Sign In
                </Link>
                <Link to="/signup" className="flex-1 bg-fitis-blue text-white py-3 rounded-xl font-bold text-center shadow-lg shadow-fitis-blue/20 hover:bg-blue-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
