import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/getImageUrl';
import { Eye, Trash2, X, Building2, Link as LinkIcon } from 'lucide-react';

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

export const AdminCommunityRequests = () => {
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReq, setSelectedReq] = useState<CommunityRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No requests found.</td></tr>
              ) : (
                requests.map(req => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center">
                      {req.company_logo_url ? (
                        <img src={getImageUrl(req.company_logo_url)} alt="Logo" className="w-8 h-8 rounded-full mr-3 object-cover border" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3"><Building2 size={16} /></div>
                      )}
                      {req.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{req.rep_name} <br/><span className="text-xs text-gray-400">{req.official_email}</span></td>
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
                    <div>
                      <dt className="text-gray-500 font-medium">Primary Chapter</dt>
                      <dd className="text-gray-900 font-semibold">{selectedReq.primary_chapter || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 font-medium">Secondary Chapter</dt>
                      <dd className="text-gray-900">{selectedReq.secondary_chapter || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-500 font-medium">FITIS Membership ID</dt>
                      <dd className="text-gray-900">{selectedReq.fitis_membership_id || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-200">
                  <div className="flex items-center mb-6 border-b pb-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mr-4"><Building2 size={24} /></div>
                    <h4 className="font-bold text-xl text-gray-800">Services Offered</h4>
                  </div>
                  <div className="text-gray-700 leading-relaxed italic whitespace-pre-wrap">
                    {selectedReq.services || "No services listed."}
                  </div>
                </div>

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

            <div className="border-t p-4 flex justify-end bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="bg-slate-100 text-slate-700 font-bold px-6 py-2.5 rounded-xl hover:bg-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
