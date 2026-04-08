import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';
import { Eye, Trash2, X, Building2, Link as LinkIcon, MessageSquarePlus, Bell, Send, Loader2, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface CommunityRequest {
  id: number;
  company_name: string;
  company_logo_url: string;
  company_id: string;
  official_email: string;
  company_linkedin: string;
  website_link: string;
  rep_image_url: string;
  rep_name: string;
  rep_email: string;
  rep_mobile: string;
  rep_designation: string;
  services: string;
  primary_chapter: string;
  secondary_chapter: string;
  fitis_membership_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

interface AdminNotification {
  id: number;
  member_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

// ─── SEND MESSAGE MODAL ──────────────────────────────────────────────────────
const SendMessageModal = ({
  req,
  onClose,
}: {
  req: CommunityRequest;
  onClose: () => void;
}) => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState('');
  const [history, setHistory] = useState<AdminNotification[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [showHistory, setShowHistory] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await fetch(`${baseUrl}/api/admin/notifications/${req.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) setHistory(await res.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [req.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    setSendError('');
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${baseUrl}/api/admin/notifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ member_id: req.id, title: title.trim(), message: message.trim() })
      });
      if (!res.ok) throw new Error('Failed to send notification');
      const newNotif = await res.json();
      setHistory(prev => [newNotif, ...prev]);
      setSent(true);
      setTitle('');
      setMessage('');
      setTimeout(() => setSent(false), 3000);
    } catch (err: any) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotif = async (id: number) => {
    try {
      const token = localStorage.getItem('adminToken');
      await fetch(`${baseUrl}/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setHistory(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              {req.company_logo_url ? (
                <img src={getImageUrl(req.company_logo_url)} alt="" className="w-8 h-8 object-contain rounded-lg" />
              ) : (
                <Bell size={20} />
              )}
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Send Notification</h3>
              <p className="text-blue-100 text-sm truncate max-w-[280px]">{req.company_name} · {req.official_email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors shrink-0">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Compose New Message */}
          <div className="p-6 border-b border-slate-100">
            <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Compose Message</h4>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title / Subject</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Your Account Has Been Approved"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                <textarea
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write your message to this partner..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-700 resize-none"
                />
              </div>

              {sendError && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {sendError}
                </div>
              )}
              {sent && (
                <div className="p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-100">
                  <CheckCircle2 size={16} /> Notification sent! It will appear in the member's dashboard.
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !title.trim() || !message.trim()}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                {sending ? 'Sending...' : 'Send Notification to Member'}
              </button>
            </form>
          </div>

          {/* Message History */}
          <div className="p-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center justify-between w-full mb-4"
            >
              <h4 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Bell size={14} /> Sent Message History
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {history.length}
                </span>
              </h4>
              {showHistory
                ? <ChevronUp size={18} className="text-slate-400" />
                : <ChevronDown size={18} className="text-slate-400" />
              }
            </button>

            {showHistory && (
              loadingHistory ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-slate-300 animate-spin" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">No messages sent to this member yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-xl border ${notif.is_read ? 'bg-slate-50 border-slate-100' : 'bg-blue-50 border-blue-100'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {!notif.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                            <p className="font-bold text-slate-900 text-sm truncate">{notif.title}</p>
                          </div>
                          <p className="text-slate-600 text-sm leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-xs text-slate-400">{new Date(notif.created_at).toLocaleString()}</p>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notif.is_read ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                              {notif.is_read ? '✓ Read' : 'Unread'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                          title="Delete this message"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export const AdminCommunityRequests = () => {
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReq, setSelectedReq] = useState<CommunityRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [msgTarget, setMsgTarget] = useState<CommunityRequest | null>(null);

  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/admin/member_community_requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        alert('Please login again');
        navigate('/admin/login');
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch requests');

      const data = await response.json();
      setRequests(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/admin/member_community_requests/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/admin/member_community_requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');

      setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus as any } : req));
      if (selectedReq && selectedReq.id === id) {
        setSelectedReq({ ...selectedReq, status: newStatus as any });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (req: CommunityRequest) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-6">Loading requests...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Community Requests</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Representative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center gap-2">
                        {req.company_logo_url ? (
                          <img src={getImageUrl(req.company_logo_url)} alt="Logo" className="w-8 h-8 rounded-full object-cover border shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0"><Building2 size={16} /></div>
                        )}
                        {req.company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {req.rep_name}<br/>
                      <span className="text-xs text-gray-400">{req.official_email}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status || 'Pending'}
                      </span>
                    </td>
                    {/* ── Send Message Button ── */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => setMsgTarget(req)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors border border-indigo-100"
                        title="Send a notification / popup message to this member"
                      >
                        <MessageSquarePlus size={14} /> Send Msg
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openModal(req)} className="text-fitis-blue hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors mr-3">
                        <Eye className="w-5 h-5 inline" />
                      </button>
                      <button onClick={() => handleDelete(req.id)} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Community Request Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">
              {/* Status Update */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Current Status</h4>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                        selectedReq.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        selectedReq.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                    {selectedReq.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    value={selectedReq.status || 'Pending'}
                    onChange={(e) => handleUpdateStatus(selectedReq.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center mb-6 border-b pb-4">
                    {selectedReq.company_logo_url && (
                      <img src={getImageUrl(selectedReq.company_logo_url)} alt="Logo" className="w-16 h-16 object-contain border rounded p-1 mr-4 bg-white" />
                    )}
                    <div>
                      <h4 className="font-bold text-xl text-gray-800">{selectedReq.company_name}</h4>
                      <p className="text-sm text-gray-500">ID: {selectedReq.company_id || 'N/A'}</p>
                    </div>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div><dt className="text-gray-500 font-medium">Official Email</dt><dd className="text-gray-900 font-semibold">{selectedReq.official_email}</dd></div>
                    <div>
                      <dt className="text-gray-500 font-medium">Website</dt>
                      <dd className="text-blue-600 truncate">
                        {selectedReq.website_link ? <a href={selectedReq.website_link} target="_blank" rel="noreferrer" className="flex items-center"><LinkIcon size={14} className="mr-1"/>{selectedReq.website_link}</a> : 'N/A'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 font-medium">LinkedIn</dt>
                      <dd className="text-blue-600 truncate">
                        {selectedReq.company_linkedin ? <a href={selectedReq.company_linkedin} target="_blank" rel="noreferrer" className="flex items-center"><LinkIcon size={14} className="mr-1"/>{selectedReq.company_linkedin}</a> : 'N/A'}
                      </dd>
                    </div>
                    <div><dt className="text-gray-500 font-medium">Primary Chapter</dt><dd className="text-gray-900 font-semibold">{selectedReq.primary_chapter || 'N/A'}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Secondary Chapter</dt><dd className="text-gray-900">{selectedReq.secondary_chapter || 'N/A'}</dd></div>
                    <div><dt className="text-gray-500 font-medium">FITIS Membership ID</dt><dd className="text-gray-900">{selectedReq.fitis_membership_id || 'N/A'}</dd></div>
                  </dl>
                </div>

                {/* Services */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center mb-6 border-b pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4"><Building2 size={24} /></div>
                    <h4 className="font-bold text-xl text-gray-800">Services Offered</h4>
                  </div>
                  <div className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                    {selectedReq.services || "No services listed."}
                  </div>
                </div>

                {/* Representative */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center mb-6 border-b pb-4">
                    {selectedReq.rep_image_url ? (
                      <img src={getImageUrl(selectedReq.rep_image_url)} alt="Rep" className="w-16 h-16 object-cover border rounded-full mr-4 shadow-sm" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4 text-blue-500 font-bold text-xl">
                        {selectedReq.rep_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-xl text-gray-800">{selectedReq.rep_name}</h4>
                      <p className="text-sm text-gray-500">{selectedReq.rep_designation}</p>
                    </div>
                  </div>
                  <dl className="space-y-3 text-sm">
                    <div><dt className="text-gray-500 font-medium">Rep Email</dt><dd className="text-gray-900">{selectedReq.rep_email}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Mobile</dt><dd className="text-gray-900">{selectedReq.rep_mobile}</dd></div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="border-t p-4 flex justify-between items-center bg-gray-50 rounded-b-xl">
              <button
                onClick={() => { setIsModalOpen(false); setMsgTarget(selectedReq); }}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
              >
                <MessageSquarePlus size={16} /> Send Message
              </button>
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 text-slate-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Message Modal */}
      {msgTarget && (
        <SendMessageModal req={msgTarget} onClose={() => setMsgTarget(null)} />
      )}
    </div>
  );
};

