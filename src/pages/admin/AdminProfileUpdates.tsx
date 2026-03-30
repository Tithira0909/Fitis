import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Eye, Building2, User, AlertCircle, ArrowRight } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

interface ProfileUpdate {
  id: number;
  member_id: number;
  company_name: string;
  official_email: string;
  updated_data: any;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export const AdminProfileUpdates = () => {
  const [updates, setUpdates] = useState<ProfileUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedUpdate, setSelectedUpdate] = useState<ProfileUpdate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('adminToken');

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/admin/profile-updates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch profile updates');
      const data = await res.json();
      setUpdates(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchUpdates();
  }, [token, navigate]);

  const handleAction = async (id: number, action: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/admin/profile-updates/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to ${action} update`);
      
      setUpdates(prev => prev.filter(u => u.id !== id));
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (update: ProfileUpdate) => {
    // Parse JSON if it's a string
    const parsedData = typeof update.updated_data === 'string' ? JSON.parse(update.updated_data) : update.updated_data;
    setSelectedUpdate({ ...update, updated_data: parsedData });
    setIsModalOpen(true);
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Profile Update Requests</h1>
          <p className="text-slate-500 font-medium">Review and approve changes submitted by community members</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle size={20} /> {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Member</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Email</th>
              <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Date Submitted</th>
              <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 italic font-medium">
            {updates.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-bold">No pending update requests found.</td>
              </tr>
            ) : (
              updates.map(update => (
                <tr key={update.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                        {update.company_name.charAt(0)}
                      </div>
                      <span className="text-slate-900 font-bold">{update.company_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-slate-600">{update.official_email}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-slate-500">{new Date(update.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button 
                      onClick={() => openModal(update)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                    >
                      <Eye size={16} /> Review Changes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Comparison Modal */}
      {isModalOpen && selectedUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Review Updates: {selectedUpdate.company_name}</h2>
                <p className="text-slate-500 text-sm font-medium">Comparing proposed changes with current database fields</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="p-8 overflow-y-auto bg-slate-50/50 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(selectedUpdate.updated_data).map(([key, value]) => (
                    <div key={key} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{key.replace(/_/g, ' ')}</p>
                       <p className="text-slate-900 font-bold break-words">{String(value)}</p>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white flex justify-end gap-4">
               <button 
                 disabled={actionLoading}
                 onClick={() => handleAction(selectedUpdate.id, 'reject')}
                 className="px-8 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center gap-2"
               >
                 <X size={20} /> Reject Update
               </button>
               <button 
                 disabled={actionLoading}
                 onClick={() => handleAction(selectedUpdate.id, 'approve')}
                 className="px-8 py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all flex items-center gap-2 shadow-xl shadow-green-600/20"
               >
                 <Check size={20} /> Approve & Apply Changes
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
