import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/getImageUrl';
import { CheckCircle2, XCircle, Trash2, Eye, Image as ImageIcon, Building2, Clock } from 'lucide-react';

interface WallPost {
  id: number;
  member_id: number;
  content: string;
  image_url: string | null;
  status: 'Pending' | 'Approved' | 'TakenDown';
  created_at: string;
  company_name: string;
  company_logo_url: string | null;
  official_email: string;
}

const StatusBadge = ({ status }: { status: WallPost['status'] }) => {
  const styles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    TakenDown: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${styles[status]}`}>
      {status === 'TakenDown' ? 'Taken Down' : status}
    </span>
  );
};

export const AdminWallPosts = () => {
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'Pending' | 'Approved' | 'TakenDown'>('all');
  const [previewPost, setPreviewPost] = useState<WallPost | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${baseUrl}/api/admin/wall-posts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch wall posts');
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleStatusUpdate = async (id: number, status: 'Approved' | 'TakenDown' | 'Pending') => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${baseUrl}/api/admin/wall-posts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('Failed to update status');
      setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      if (previewPost && previewPost.id === id) {
        setPreviewPost({ ...previewPost, status });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Permanently delete this post? This cannot be undone.')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${baseUrl}/api/admin/wall-posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== id));
      if (previewPost?.id === id) setPreviewPost(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredPosts = filter === 'all' ? posts : posts.filter(p => p.status === filter);

  const counts = {
    all: posts.length,
    Pending: posts.filter(p => p.status === 'Pending').length,
    Approved: posts.filter(p => p.status === 'Approved').length,
    TakenDown: posts.filter(p => p.status === 'TakenDown').length,
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Partner Wall Posts</h1>
          <p className="text-slate-500 mt-1 text-sm">Review and moderate posts submitted by partner organizations</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'Pending', 'Approved', 'TakenDown'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              filter === f
                ? f === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300'
                : f === 'Approved' ? 'bg-green-100 text-green-800 border-2 border-green-300'
                : f === 'TakenDown' ? 'bg-red-100 text-red-800 border-2 border-red-300'
                : 'bg-blue-600 text-white border-2 border-blue-600'
                : 'bg-white text-slate-600 border-2 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'TakenDown' ? 'Taken Down' : f}
            <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
              {counts[f]}
            </span>
          </button>
        ))}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center text-slate-400">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="font-bold text-lg">No posts found</p>
          <p className="text-sm mt-1">There are no {filter !== 'all' ? filter.toLowerCase() : ''} posts to display.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow"
            >
              {/* Company Info */}
              <div className="flex items-center gap-3 md:w-56 shrink-0">
                <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                  {post.company_logo_url ? (
                    <img src={getImageUrl(post.company_logo_url)} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-6 h-6 text-slate-300" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-sm truncate">{post.company_name}</p>
                  <p className="text-xs text-slate-400 truncate">{post.official_email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Post Image (if any) */}
              {post.image_url && (
                <div className="w-full md:w-32 h-24 rounded-xl overflow-hidden border border-slate-50 bg-slate-50 shrink-0">
                  <img src={getImageUrl(post.image_url)} alt="post" className="w-full h-full object-cover" />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">{post.content}</p>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <StatusBadge status={post.status} />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewPost(post)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Preview post"
                  >
                    <Eye size={18} />
                  </button>
                  {post.status !== 'Approved' && (
                    <button
                      onClick={() => handleStatusUpdate(post.id, 'Approved')}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                      title="Approve post"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  {post.status !== 'TakenDown' && (
                    <button
                      onClick={() => handleStatusUpdate(post.id, 'TakenDown')}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all"
                      title="Take down post"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete post permanently"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreviewPost(null)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {previewPost.company_logo_url ? (
                      <img src={getImageUrl(previewPost.company_logo_url)} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{previewPost.company_name}</p>
                    <p className="text-xs text-slate-400">{new Date(previewPost.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <StatusBadge status={previewPost.status} />
              </div>

              {previewPost.image_url && (
                <div className="rounded-2xl overflow-hidden mb-6 border border-slate-100">
                  <img src={getImageUrl(previewPost.image_url)} alt="post" className="w-full object-cover max-h-[350px]" />
                </div>
              )}

              <p className="text-slate-700 leading-relaxed mb-8">{previewPost.content}</p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                {previewPost.status !== 'Approved' && (
                  <button
                    onClick={() => handleStatusUpdate(previewPost.id, 'Approved')}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle2 size={18} /> Approve Post
                  </button>
                )}
                {previewPost.status !== 'TakenDown' && (
                  <button
                    onClick={() => handleStatusUpdate(previewPost.id, 'TakenDown')}
                    className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                  >
                    <XCircle size={18} /> Take Down
                  </button>
                )}
                {previewPost.status === 'TakenDown' && (
                  <button
                    onClick={() => handleStatusUpdate(previewPost.id, 'Pending')}
                    className="flex-1 py-3 bg-yellow-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-600 transition-colors"
                  >
                    <Clock size={18} /> Set to Pending
                  </button>
                )}
                <button
                  onClick={() => { handleDelete(previewPost.id); setPreviewPost(null); }}
                  className="py-3 px-6 bg-red-50 text-red-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors border border-red-100"
                >
                  <Trash2 size={18} /> Delete
                </button>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="py-3 px-6 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

