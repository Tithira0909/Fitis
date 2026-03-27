import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/getImageUrl';
import { Eye, Trash2, X, Download, FileText } from 'lucide-react';

interface MemberApplication {
  id: number;
  primary_chapter: string;
  chapters_applied: string | string[]; // comes as stringified JSON from generic crud usually, or parsed
  company_name: string;
  membership_category: string;
  ceo_name: string;
  company_address: string;
  phone: string;
  fax: string;
  website: string;
  email: string;
  br_number: string;
  year_incorporation: string;
  boi_no: string;
  ownership_local: string;
  ownership_foreign: string;
  business_activities: string;
  industry_focus: string | string[];
  revenue_local: string;
  revenue_foreign: string;
  employees_count: string;
  primary_nominee: string | any;
  secondary_nominee: string | any;
  business_registration: string;
  audited_accounts: string;
  company_profile: string;
  other_documents: string;
  declaration_applicant_name: string;
  declaration_applicant_designation: string;
  declaration_date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export const AdminMembers = () => {
  const [applications, setApplications] = useState<MemberApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedApp, setSelectedApp] = useState<MemberApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/member_applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch applications');
      const data = await response.json();
      setApplications(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/member_applications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete');
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/member_applications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');

      setApplications(prev => prev.map(app => app.id === id ? { ...app, status: newStatus as any } : app));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus as any });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const openModal = (app: MemberApplication) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const safeParseJSON = (data: any, fallback: any = []) => {
    if (typeof data === 'string') {
      try { return JSON.parse(data); } catch { return fallback; }
    }
    return data || fallback;
  };

  if (loading) return <div className="p-6">Loading applications...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Member Applications</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chapter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">No applications found.</td></tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.company_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.primary_chapter}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openModal(app)} className="text-blue-600 hover:text-blue-900 mr-4">
                        <Eye className="w-5 h-5 inline" />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="text-red-600 hover:text-red-900">
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

      {isModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black bg-opacity-50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Application Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">

              {/* Status Update */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase mb-1">Current Status</h4>
                  <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${
                        selectedApp.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        selectedApp.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                    {selectedApp.status || 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                  <select
                    value={selectedApp.status || 'Pending'}
                    onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Section A & B */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Company Info</h4>
                  <dl className="space-y-3 text-sm">
                    <div><dt className="text-gray-500 font-medium">Company Name</dt><dd className="text-gray-900 font-semibold">{selectedApp.company_name}</dd></div>
                    <div><dt className="text-gray-500 font-medium">CEO / MD</dt><dd className="text-gray-900">{selectedApp.ceo_name}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Primary Chapter</dt><dd className="text-gray-900">{selectedApp.primary_chapter}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Chapters Applied</dt><dd className="text-gray-900">{safeParseJSON(selectedApp.chapters_applied).join(', ')}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Category</dt><dd className="text-gray-900">{selectedApp.membership_category}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Address</dt><dd className="text-gray-900">{selectedApp.company_address}</dd></div>
                  </dl>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Contact Info</h4>
                  <dl className="space-y-3 text-sm">
                    <div><dt className="text-gray-500 font-medium">Email</dt><dd className="text-gray-900">{selectedApp.email}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Phone</dt><dd className="text-gray-900">{selectedApp.phone}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Fax</dt><dd className="text-gray-900">{selectedApp.fax}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Website</dt><dd className="text-blue-600"><a href={selectedApp.website} target="_blank" rel="noreferrer">{selectedApp.website}</a></dd></div>
                  </dl>
                </div>
              </div>

              {/* Section C */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Organization Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <dl className="space-y-3">
                    <div><dt className="text-gray-500 font-medium">BR Number</dt><dd className="text-gray-900">{selectedApp.br_number}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Year of Incorporation</dt><dd className="text-gray-900">{selectedApp.year_incorporation}</dd></div>
                    <div><dt className="text-gray-500 font-medium">BOI No</dt><dd className="text-gray-900">{selectedApp.boi_no || 'N/A'}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Employees Count</dt><dd className="text-gray-900">{selectedApp.employees_count}</dd></div>
                  </dl>
                  <dl className="space-y-3">
                    <div><dt className="text-gray-500 font-medium">Ownership (Local / Foreign)</dt><dd className="text-gray-900">{selectedApp.ownership_local} / {selectedApp.ownership_foreign}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Revenue Ratio (Local / Foreign)</dt><dd className="text-gray-900">{selectedApp.revenue_local} / {selectedApp.revenue_foreign}</dd></div>
                    <div><dt className="text-gray-500 font-medium">Industry Focus</dt><dd className="text-gray-900">{safeParseJSON(selectedApp.industry_focus).join(', ')}</dd></div>
                  </dl>
                </div>
                <div className="mt-4 text-sm">
                  <dt className="text-gray-500 font-medium mb-1">Business Activities</dt>
                  <dd className="text-gray-900 bg-gray-50 p-3 rounded">{selectedApp.business_activities}</dd>
                </div>
              </div>

              {/* Nominees */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Primary Nominee</h4>
                  {(() => {
                    const nom = safeParseJSON(selectedApp.primary_nominee, {});
                    return (
                      <dl className="space-y-2 text-sm">
                        <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{nom.name}</dd></div>
                        <div><dt className="text-gray-500">Designation</dt><dd className="text-gray-900">{nom.designation}</dd></div>
                        <div><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{nom.phone}</dd></div>
                        <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{nom.email}</dd></div>
                      </dl>
                    )
                  })()}
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Secondary Nominee</h4>
                  {(() => {
                    const nom = safeParseJSON(selectedApp.secondary_nominee, {});
                    return (
                      <dl className="space-y-2 text-sm">
                        <div><dt className="text-gray-500">Name</dt><dd className="font-medium text-gray-900">{nom.name || 'N/A'}</dd></div>
                        <div><dt className="text-gray-500">Designation</dt><dd className="text-gray-900">{nom.designation || 'N/A'}</dd></div>
                        <div><dt className="text-gray-500">Phone</dt><dd className="text-gray-900">{nom.phone || 'N/A'}</dd></div>
                        <div><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{nom.email || 'N/A'}</dd></div>
                      </dl>
                    )
                  })()}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Uploaded Documents</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Business Reg', url: selectedApp.business_registration },
                    { label: 'Audited Accounts', url: selectedApp.audited_accounts },
                    { label: 'Company Profile', url: selectedApp.company_profile },
                    { label: 'Other Docs', url: selectedApp.other_documents },
                  ].map((doc, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-700 mb-2">{doc.label}</span>
                      {doc.url ? (
                        <a href={getImageUrl(doc.url)} target="_blank" rel="noreferrer" className="flex items-center text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full font-semibold">
                          <Download className="w-3 h-3 mr-1" /> Download
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">Not provided</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Declaration */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">Declaration</h4>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div><dt className="text-gray-500">Applicant Name</dt><dd className="font-medium text-gray-900">{selectedApp.declaration_applicant_name}</dd></div>
                  <div><dt className="text-gray-500">Designation</dt><dd className="text-gray-900">{selectedApp.declaration_applicant_designation}</dd></div>
                  <div><dt className="text-gray-500">Date</dt><dd className="text-gray-900">{new Date(selectedApp.declaration_date).toLocaleDateString()}</dd></div>
                </dl>
              </div>

            </div>

            <div className="border-t p-4 flex justify-end bg-gray-50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 font-medium">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
