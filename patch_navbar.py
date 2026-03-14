import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

nav_links_search = """
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Introduction', href: '/Home/introduction' },
    { name: 'News', href: '/Home/news' },
    { name: 'Events', href: '/Home/events' },
    { name: 'Programs', href: '/Home/programs' },
    { name: 'Chapters', href: '/Chapter/chapters' },
    { name: 'Gallery', href: '/Home/gallery' },
  ];
"""

nav_links_replace = """
  const navLinks = [
    { name: 'Home', href: '/' },
    {
      name: 'Introduction',
      href: '/Home/introduction',
      submenu: [
        { name: 'Introduction', href: '/Home/introduction' },
        { name: 'Leadership Team', href: '/Home/leadership-team' },
        { name: 'Chairman\\'s Message', href: '/Home/chairman-message' },
        { name: 'Code of Conduct', href: '/Home/code-of-conduct' },
        { name: 'Past Leaders', href: '/Home/past-leaders' },
      ]
    },
    { name: 'News', href: '/Home/news' },
    { name: 'Events', href: '/Home/events' },
    { name: 'Programs', href: '/Home/programs' },
    { name: 'Chapters', href: '/Chapter/chapters' },
    { name: 'Gallery', href: '/Home/gallery' },
  ];
"""

content = content.replace(nav_links_search.strip(), nav_links_replace.strip())

# Need to add state for introduction dropdown
state_imports_search = """import { Menu, X } from 'lucide-react';"""
state_imports_replace = """import { Menu, X, ChevronDown } from 'lucide-react';"""
content = content.replace(state_imports_search, state_imports_replace)

states_search = """
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
"""
states_replace = """
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
"""
content = content.replace(states_search.strip(), states_replace.strip())

# Replace the mapping in desktop nav
desktop_nav_search = """
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
"""

desktop_nav_replace = """
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
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
"""

content = content.replace(desktop_nav_search.strip(), desktop_nav_replace.strip())

# Replace the mapping in mobile nav
mobile_nav_search = """
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
"""

mobile_nav_replace = """
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 max-h-[calc(100vh-80px)] overflow-y-auto bg-white shadow-xl border-t border-slate-100 p-6 flex flex-col gap-4 md:hidden"
          >
            {navLinks.map((link) => (
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
"""

content = content.replace(mobile_nav_search.strip(), mobile_nav_replace.strip())

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)

print("Navbar updated")
