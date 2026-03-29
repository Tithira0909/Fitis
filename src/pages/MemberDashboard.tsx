import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Image as ImageIcon, Send, Trash2, LayoutDashboard, Building2, User, LogOut, Plus, X, Loader2, AlertCircle } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

interface MemberPost {
  id: number;
  content: string;
  image_url: string;
  created_at: string;
}

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

  
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Memoize user to avoid infinite loops since JSON.parse returns a new object every time
  const user = React.useMemo(() => {
    const userStr = localStorage.getItem('communityUser');
    return userStr ? JSON.parse(userStr) : null;
  }, []);

  const token = localStorage.getItem('communityToken');

  useEffect(() => {
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchMemberData(),
        fetchPosts(),
        fetchUpdateStatus()
      ]);
    };

    loadData();
  }, [token, user?.id, navigate]);


  const fetchMemberData = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community-members/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setMemberData(data);
        setEditForm(data);
      }
    } catch (err) {
      console.error('Failed to fetch member data:', err);
    }
  };

  const fetchUpdateStatus = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/community/profile-update/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingUpdate(data);
      }
    } catch (err) {
      console.error('Failed to fetch update status:', err);
    }
  };


  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${baseUrl}/api/community-members/${user.id}/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent && !selectedFile) return;

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('content', newPostContent);
      if (selectedFile) formData.append('image', selectedFile);

      const res = await fetch(`${baseUrl}/api/community/posts`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create post');
      }

      setNewPostContent('');
      setSelectedFile(null);
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`${baseUrl}/api/community/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${baseUrl}/api/community/profile-update`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(editForm)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit update');
      }

      setSuccess('Profile update submitted and is pending admin approval.');
      fetchUpdateStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('communityToken');
    localStorage.removeItem('communityUser');
    navigate('/login');
    window.location.reload();
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-20 font-sans">
      
      {/* Dashboard Header */}
      <div className="bg-[#0a1128] text-white py-12 md:py-16 px-4 relative overflow-hidden mb-8 md:mb-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center">
              <Building2 className="w-8 h-8 md:w-10 md:h-10 text-blue-400" />
            </div>
            <div>
              <p className="text-blue-400 text-sm font-black uppercase tracking-widest mb-1">Authenticated Member Area</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user?.company_name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
             <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                <button 
                  onClick={() => setActiveTab('wall')}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'wall' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                   <MessageSquare size={18} /> Social Wall
                </button>
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-white text-slate-900 shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                   <User size={18} /> Profile Settings
                </button>
             </div>
             
             <div className="flex gap-4">
                <Link to={`/member/${user?.id}`} className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all flex items-center gap-2">
                   <LayoutDashboard size={18} /> Public Profile
                </Link>
                <button onClick={handleLogout} className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl font-bold transition-all flex items-center gap-2">
                   <LogOut size={18} />
                </button>
             </div>
          </div>
        </div>
      </div>


      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col gap-10">
        
        {activeTab === 'wall' ? (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column: Post Creator */}
            <div className="w-full lg:w-2/5 space-y-8">
               <section className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0"><Plus size={24} /></div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Update</h2>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-3">
                       <AlertCircle size={18} /> {error}
                    </div>
                  )}

                  <form onSubmit={handleCreatePost} className="space-y-6">
                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Post Content</label>
                        <textarea 
                          required
                          value={newPostContent}
                          onChange={e => setNewPostContent(e.target.value)}
                          placeholder="Share what's happening in your organization..."
                          className="w-full p-5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none min-h-[150px] text-slate-800 font-medium"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Attach Image (Optional)</label>
                        <div className="relative group">
                           <input 
                             type="file" 
                             accept="image/*"
                             onChange={handleFileChange}
                             className="absolute inset-0 opacity-0 cursor-pointer z-10"
                           />
                           <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 group-hover:bg-white group-hover:border-blue-400 transition-all flex flex-col items-center justify-center text-center">
                              {selectedFile ? (
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ImageIcon size={24} /></div>
                                   <span className="font-bold text-slate-700 truncate max-w-[200px]">{selectedFile.name}</span>
                                   <button onClick={(e) => { e.preventDefault(); setSelectedFile(null); }} className="p-1 hover:bg-slate-100 rounded-full"><X size={16} /></button>
                                </div>
                              ) : (
                                <>
                                   <ImageIcon className="w-10 h-10 text-slate-300 mb-3 group-hover:text-blue-500 transition-colors" />
                                   <p className="text-sm font-bold text-slate-500">Click to select an image</p>
                                   <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-black">PNG, JPG (MAX 5MB)</p>
                                </>
                              )}
                           </div>
                        </div>
                     </div>

                     <button 
                       type="submit" 
                       disabled={isSubmitting || (!newPostContent && !selectedFile)}
                       className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
                     >
                        {isSubmitting ? (
                          <Loader2 size={24} className="animate-spin" />
                        ) : (
                          <>Post Update <Send size={20} /></>
                        )}
                     </button>
                  </form>
               </section>
            </div>

            {/* Right Column: Existing Posts */}
            <div className="flex-1 space-y-8">
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                     <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                     My Wall Posts
                  </h2>
                  <span className="bg-white px-4 py-1 rounded-full border border-slate-200 text-sm font-bold text-slate-500">{posts.length} Total</span>
               </div>

               {isLoading ? (
                 <div className="bg-white rounded-[2rem] p-20 flex flex-col items-center justify-center shadow-sm border border-slate-100">
                    <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                    <p className="font-bold text-slate-400">Loading your wall...</p>
                 </div>
               ) : posts.length === 0 ? (
                 <div className="bg-white rounded-[2rem] p-16 text-center shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mb-6"><MessageSquare size={40} /></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">You haven't posted anything yet</h3>
                    <p className="text-slate-500">Your updates will appear here and on your public profile wall.</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-6">
                    <AnimatePresence>
                       {posts.map((post) => (
                          <motion.article 
                            key={post.id}
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group"
                          >
                             {post.image_url && (
                               <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shrink-0 border border-slate-50 bg-slate-50">
                                  <img src={getImageUrl(post.image_url)} alt="post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                               </div>
                             )}
                             <div className="flex-1 flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{new Date(post.created_at).toLocaleDateString()}</p>
                                   <button 
                                     onClick={() => handleDeletePost(post.id)}
                                     className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                   >
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed mb-4 line-clamp-3 md:line-clamp-none">
                                   {post.content}
                                </p>
                             </div>
                          </motion.article>
                       ))}
                    </AnimatePresence>
                 </div>
               )}
            </div>
          </div>
        ) : (
          /* Profile Update Section */
          <div className="max-w-4xl mx-auto w-full">
            <section className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
               <div className="p-8 md:p-12 border-b border-slate-50 flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">Profile Settings</h2>
                    <p className="text-slate-500 font-medium">Update organization and representative information</p>
                  </div>
                  {pendingUpdate && pendingUpdate.status === 'Pending' && (
                    <div className="px-5 py-2.5 bg-orange-50 text-orange-600 rounded-2xl border border-orange-100 text-sm font-black flex items-center gap-2 animate-pulse">
                      <Loader2 size={16} className="animate-spin" /> Pending Admin Approval
                    </div>
                  )}
               </div>

               <div className="p-8 md:p-12">
                  <form onSubmit={handleProfileUpdate} className="space-y-12">
                    {/* Company Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-blue-600 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-8 h-1 bg-blue-600 rounded-full" /> Company Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 group-focus-within:bg-white transition-all outline-none"
                            value={editForm.company_name || ''}
                            onChange={e => setEditForm({...editForm, company_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.official_email || ''}
                            onChange={e => setEditForm({...editForm, official_email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Services / Description</label>
                          <textarea 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none min-h-[120px]"
                            value={editForm.services || ''}
                            onChange={e => setEditForm({...editForm, services: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Website Link</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.website_link || ''}
                            onChange={e => setEditForm({...editForm, website_link: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">LinkedIn Profile</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.company_linkedin || ''}
                            onChange={e => setEditForm({...editForm, company_linkedin: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Representative Section */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-black text-indigo-600 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-8 h-1 bg-indigo-600 rounded-full" /> Representative Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Name</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.rep_name || ''}
                            onChange={e => setEditForm({...editForm, rep_name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Designation</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.rep_designation || ''}
                            onChange={e => setEditForm({...editForm, rep_designation: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.rep_email || ''}
                            onChange={e => setEditForm({...editForm, rep_email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mobile</label>
                          <input 
                            className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 transition-all outline-none"
                            value={editForm.rep_mobile || ''}
                            onChange={e => setEditForm({...editForm, rep_mobile: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                       {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-3"><AlertCircle size={18} /> {error}</div>}
                       {success && <div className="p-4 bg-green-50 text-green-600 rounded-xl border border-green-100 text-sm font-bold flex items-center gap-3"><Send size={18} /> {success}</div>}
                       
                       <button 
                         type="submit"
                         disabled={isSubmitting || (pendingUpdate && pendingUpdate.status === 'Pending')}
                         className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0"
                       >
                         {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Submit Request for Approval'}
                       </button>
                    </div>
                  </form>
               </div>
            </section>
          </div>
        )}
      </div>

    </div>
  );
};

// Internal Link helper for consistency
const Link = ({ to, children, className }: { to: string, children: React.ReactNode, className: string }) => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(to)} className={className}>
      {children}
    </button>
  );
};
