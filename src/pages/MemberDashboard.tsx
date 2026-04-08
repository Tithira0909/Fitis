import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare, Image as ImageIcon, Send, Trash2, Building2, User,
  LogOut, Plus, X, Loader2, AlertCircle, Bell, CheckCheck, BellRing,
  Globe, LayoutGrid, ChevronRight, ExternalLink, Home, Settings
} from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

interface MemberPost {
  id: number;
  content: string;
  image_url: string;
  status: 'Pending' | 'Approved' | 'TakenDown';
  created_at: string;
}

interface AdminNotification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// Internal Link helper
const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const navigate = useNavigate();
  return <button onClick={() => navigate(to)} className={className}>{children}</button>;
};

export const MemberDashboard = () => {
  const [posts, setPosts] = useState<MemberPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'wall' | 'profile'>('wall');
  const [memberData, setMemberData] = useState<any>(null);
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [popupQueue, setPopupQueue] = useState<AdminNotification[]>([]);
  const [currentPopup, setCurrentPopup] = useState<AdminNotification | null>(null);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

  const user = React.useMemo(() => {
    const userStr = localStorage.getItem('communityUser');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const token = localStorage.getItem('communityToken');

  useEffect(() => {
    if (!token || !user) { navigate('/login'); return; }
    const loadData = async () => {
      await Promise.all([fetchMemberData(), fetchPosts(), fetchUpdateStatus(), fetchNotifications()]);
    };
    loadData();
  }, []);

  // Close notif panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target as Node)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchMemberData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMemberData(data);
        setEditForm(data);
      }
    } catch (err) { console.error(err); }
  };

  const fetchUpdateStatus = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community/profile-update/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPendingUpdate(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${baseUrl}/api/community/my-posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setPosts(await res.json());
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data: AdminNotification[] = await res.json();
        setNotifications(data);
        const unread = data.filter(n => !n.is_read);
        if (unread.length > 0) { setPopupQueue(unread); setCurrentPopup(unread[0]); }
      }
    } catch (err) { console.error(err); }
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch(`${baseUrl}/api/community/notifications/${id}/read`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) { console.error(err); }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${baseUrl}/api/community/notifications/read-all`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) { console.error(err); }
  };

  const dismissPopup = (notif: AdminNotification) => {
    markAsRead(notif.id);
    const remaining = popupQueue.filter(n => n.id !== notif.id);
    setPopupQueue(remaining);
    setCurrentPopup(remaining.length > 0 ? remaining[0] : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); setSuccess('');
    try {
      const formData = new FormData();
      if (newPostContent) formData.append('content', newPostContent);
      if (selectedFile) formData.append('image', selectedFile);
      const res = await fetch(`${baseUrl}/api/community/posts`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: formData
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to create post'); }
      setNewPostContent(''); setSelectedFile(null);
      setSuccess('Your post has been submitted and is pending admin approval.');
      fetchPosts();
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      const res = await fetch(`${baseUrl}/api/community/posts/${id}`, {
        method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) { alert(err.message); }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); setError(''); setSuccess('');
    try {
      const res = await fetch(`${baseUrl}/api/community/profile-update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(editForm)
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to submit update'); }
      setSuccess('Profile update submitted and is pending admin approval.');
      fetchUpdateStatus();
    } catch (err: any) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('communityToken');
    localStorage.removeItem('communityUser');
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { key: 'wall', label: 'Social Wall', icon: <MessageSquare size={18} /> },
    { key: 'profile', label: 'Profile Settings', icon: <Settings size={18} /> },
  ];

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">

      {/* ── NOTIFICATION POPUP ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {currentPopup && (
          <motion.div
            key={currentPopup.id}
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-[999] w-[360px]"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <BellRing size={18} className="animate-bounce" />
                  <span className="font-black text-sm uppercase tracking-widest">New Message from Admin</span>
                </div>
                <div className="flex items-center gap-2">
                  {popupQueue.length > 1 && (
                    <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">
                      {popupQueue.length} unread
                    </span>
                  )}
                  <button onClick={() => dismissPopup(currentPopup)} className="p-1 hover:bg-white/20 rounded-lg text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-black text-slate-900 mb-2">{currentPopup.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{currentPopup.message}</p>
                <p className="text-xs text-slate-400 mt-3">{new Date(currentPopup.created_at).toLocaleString()}</p>
              </div>
              <div className="px-5 pb-5 flex gap-2">
                <button onClick={() => dismissPopup(currentPopup)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Dismiss
                </button>
                {popupQueue.length > 1 && (
                  <button onClick={() => dismissPopup(currentPopup)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                    Next <ChevronRight size={14} /> ({popupQueue.length - 1})
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ────────────────────────────────────────────────────────── */}
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-[#0d1b3e] flex flex-col
        transform transition-transform duration-300 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo / Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Building2 size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest">Member Portal</p>
              <p className="text-white font-black text-sm truncate">{user?.company_name || 'Member'}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => { setActiveTab(item.key as any); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === item.key
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-white/10 mt-4 space-y-1">
            <Link
              to={`/member/${user?.id}`}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Globe size={18} /> Public Profile
              <ExternalLink size={13} className="ml-auto opacity-50" />
            </Link>
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <Home size={18} /> Back to Site
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:text-white hover:bg-red-600/20 transition-all"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <LayoutGrid size={20} className="text-slate-600" />
            </button>
            <div>
              <h1 className="font-black text-slate-900 text-lg leading-tight">
                {activeTab === 'wall' ? 'Social Wall' : 'Profile Settings'}
              </h1>
              <p className="text-slate-400 text-xs font-medium hidden sm:block">
                {user?.company_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative" ref={notifPanelRef}>
              <button
                onClick={() => setShowNotifPanel(p => !p)}
                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                title="Notifications"
              >
                <Bell size={20} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifPanel && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell size={17} className="text-blue-600" />
                        <span className="font-black text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-100 text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button onClick={markAllAsRead} className="flex items-center gap-1 text-xs text-blue-600 font-bold hover:text-blue-800">
                          <CheckCheck size={13} /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-50">
                      {notifications.length === 0 ? (
                        <div className="py-12 text-center">
                          <Bell size={32} className="mx-auto text-slate-200 mb-3" />
                          <p className="text-slate-400 text-sm font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => !notif.is_read && markAsRead(notif.id)}
                            className={`px-5 py-4 cursor-pointer transition-colors ${!notif.is_read ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-slate-50'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.is_read ? 'bg-blue-500' : 'bg-transparent'}`} />
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${!notif.is_read ? 'text-slate-900' : 'text-slate-500'}`}>{notif.title}</p>
                                <p className="text-sm text-slate-500 leading-relaxed mt-0.5 line-clamp-2">{notif.message}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                              </div>
                              {!notif.is_read && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs font-bold rounded-full shrink-0">New</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
              {user?.company_name?.charAt(0) || 'M'}
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">

          {activeTab === 'wall' ? (
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

              {/* Left: Post Creator */}
              <div className="w-full lg:w-[380px] shrink-0 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Plus size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">Create Update</h2>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2">
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-bold flex items-center gap-2">
                      <Send size={16} /> {success}
                    </div>
                  )}

                  <form onSubmit={handleCreatePost} className="space-y-5">
                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Post Content</label>
                      <textarea
                        required
                        value={newPostContent}
                        onChange={e => setNewPostContent(e.target.value)}
                        placeholder="Share what's happening in your organization..."
                        className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none min-h-[140px] text-slate-800 font-medium resize-none text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Attach Image (Optional)</label>
                      <div className="relative group">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div className="p-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 group-hover:border-blue-400 group-hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center text-center">
                          {selectedFile ? (
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-green-50 text-green-600 rounded-lg"><ImageIcon size={18} /></div>
                              <span className="font-bold text-slate-700 truncate max-w-[160px] text-sm">{selectedFile.name}</span>
                              <button onClick={e => { e.preventDefault(); setSelectedFile(null); }} className="p-1 hover:bg-slate-100 rounded-full"><X size={14} /></button>
                            </div>
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-slate-300 mb-2 group-hover:text-blue-400 transition-colors" />
                              <p className="text-sm font-bold text-slate-400">Click to upload image</p>
                              <p className="text-[10px] text-slate-300 mt-0.5 uppercase tracking-widest font-black">PNG, JPG · Max 5MB</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || (!newPostContent && !selectedFile)}
                      className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-black shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 text-sm"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Post Update</>}
                    </button>
                  </form>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Total', value: posts.length, color: 'bg-blue-50 text-blue-700' },
                    { label: 'Approved', value: posts.filter(p => p.status === 'Approved').length, color: 'bg-green-50 text-green-700' },
                    { label: 'Pending', value: posts.filter(p => p.status === 'Pending').length, color: 'bg-yellow-50 text-yellow-700' },
                  ].map(stat => (
                    <div key={stat.label} className={`${stat.color} rounded-xl p-3 text-center`}>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Posts Feed */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <div className="w-1 h-6 bg-blue-600 rounded-full" />
                    My Wall Posts
                  </h2>
                  <span className="bg-white px-3 py-1 rounded-full border border-slate-200 text-xs font-bold text-slate-500">{posts.length} posts</span>
                </div>

                {isLoading ? (
                  <div className="bg-white rounded-2xl p-16 flex flex-col items-center justify-center shadow-sm border border-slate-100">
                    <Loader2 size={36} className="text-blue-500 animate-spin mb-3" />
                    <p className="font-bold text-slate-400 text-sm">Loading your posts...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="bg-white rounded-2xl p-14 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-5">
                      <MessageSquare size={30} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No posts yet</h3>
                    <p className="text-slate-400 text-sm">Your updates will appear here once you create one.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <AnimatePresence>
                      {posts.map(post => (
                        <motion.article
                          key={post.id}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex gap-5 hover:shadow-md transition-shadow group"
                        >
                          {post.image_url && (
                            <div className="w-28 h-28 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                              <img src={getImageUrl(post.image_url)} alt="post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2 gap-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  post.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                  post.status === 'TakenDown' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {post.status === 'TakenDown' ? 'Taken Down' : post.status}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">{new Date(post.created_at).toLocaleDateString()}</span>
                              </div>
                              <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0">
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed line-clamp-4">{post.content}</p>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

          ) : (
            /* Profile Settings */
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 mb-0.5">Profile Settings</h2>
                    <p className="text-slate-400 text-sm font-medium">Update your organization and representative information</p>
                  </div>
                  {pendingUpdate?.status === 'Pending' && (
                    <div className="px-4 py-2 bg-orange-50 text-orange-600 rounded-xl border border-orange-100 text-xs font-black flex items-center gap-2 animate-pulse">
                      <Loader2 size={14} className="animate-spin" /> Pending Approval
                    </div>
                  )}
                </div>

                <form onSubmit={handleProfileUpdate} className="p-8 space-y-10">
                  {/* Company Section */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <Building2 size={14} /> Company Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { label: 'Company Name', key: 'company_name' },
                        { label: 'Official Email', key: 'official_email' },
                        { label: 'Website Link', key: 'website_link' },
                        { label: 'LinkedIn Profile', key: 'company_linkedin' },
                      ].map(field => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                          <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-800 font-medium text-sm"
                            value={editForm[field.key] || ''}
                            onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2 space-y-1.5">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Services / Description</label>
                        <textarea
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-700 text-sm min-h-[110px] resize-none"
                          value={editForm.services || ''}
                          onChange={e => setEditForm({ ...editForm, services: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Representative Section */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} /> Representative Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        { label: 'Name', key: 'rep_name' },
                        { label: 'Designation', key: 'rep_designation' },
                        { label: 'Email', key: 'rep_email' },
                        { label: 'Mobile', key: 'rep_mobile' },
                      ].map(field => (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                          <input
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-800 font-medium text-sm"
                            value={editForm[field.key] || ''}
                            onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    {error && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2">
                        <AlertCircle size={16} /> {error}
                      </div>
                    )}
                    {success && (
                      <div className="p-3 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-bold flex items-center gap-2">
                        <Send size={16} /> {success}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting || (pendingUpdate?.status === 'Pending')}
                      className="w-full py-4 bg-slate-900 text-white rounded-xl font-black shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Submit for Approval'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

