import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../../lib/auth';
import { LayoutDashboard, Newspaper, Calendar, Users, Briefcase, Handshake, Mail, Settings, LogOut, Image as ImageIcon, FolderGit2, UserSquare, Contact, Layers, ChevronDown, ChevronRight, UserPlus } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);


  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (!isAuthenticated()) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/programs', label: 'Projects & Programs', icon: <FolderGit2 size={20} /> },
    { path: '/admin/events', label: 'Events', icon: <Calendar size={20} /> },
    { path: '/admin/chapters', label: 'Chapters', icon: <Users size={20} /> },
    { path: '/admin/leadership', label: 'Leadership', icon: <Briefcase size={20} /> },
    { path: '/admin/secretariat-team', label: 'Secretariat Team', icon: <Contact size={20} /> },
    { path: '/admin/chairman-message', label: 'Chairman Message', icon: <UserSquare size={20} /> },
    { path: '/admin/partners', label: 'Partners', icon: <Handshake size={20} /> },
    { path: '/admin/newsletter-publications', label: 'Newsletter Publications', icon: <Mail size={20} /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },
    { path: '/admin/site-settings', label: 'Site Settings', icon: <Settings size={20} /> },
    { path: '/admin/members', label: 'Member Apps', icon: <Contact size={20} /> },
    { path: '/admin/member-benefits', label: 'Member Benefits', icon: <Briefcase size={20} /> },
  ];

  const communitySubItems = [
    { path: '/admin/community-requests', label: 'Community Requests', icon: <Contact size={18} /> },
    { path: '/admin/wall-posts', label: 'Wall Posts', icon: <Layers size={18} /> },
    { path: '/admin/profile-updates', label: 'Profile Updates', icon: <UserSquare size={18} /> },
    { path: '/admin/community-member-creation', label: 'Member Creation', icon: <UserPlus size={18} /> },
  ];

  // Auto open community dropdown if active
  useEffect(() => {
    if (communitySubItems.some(item => location.pathname.startsWith(item.path))) {
      setIsCommunityOpen(true);
    }
  }, [location.pathname]);


  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
          <img src="/fitis_logo.png" alt="FITIS Logo" className="h-8 object-contain bg-white rounded p-1" />
          <h1 className="text-xl font-bold">FITIS Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {/* Standard Items */}
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(`${item.path}/`));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Community Members Nested Dropdown */}
          <div>
            <button
              onClick={() => setIsCommunityOpen(!isCommunityOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800"
            >
              <div className="flex items-center space-x-3">
                <Users size={20} />
                <span>Community Members</span>
              </div>
              {isCommunityOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
            
            {isCommunityOpen && (
              <div className="ml-4 pl-4 border-l border-gray-700 mt-2 space-y-2">
                {communitySubItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors text-sm ${
                        isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-gray-300 hover:text-white w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {location.pathname === '/admin' ? 'Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-medium">FITIS Admin</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                F
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
