import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface LeadershipMember {
  id: number;
  name: string;
  designation: string;
  type: 'current' | 'past';
  image_url: string;
  linkedin_url: string;
  hierarchy_level: number;
  seat: number;
  year_start?: number;
  year_end?: number;
  sort_order?: number;
  status?: 'draft' | 'published';
}

export const AdminLeadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadershipMember | null>(null);
  const [formData, setFormData] = useState<Partial<LeadershipMember>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [leadershipYear, setLeadershipYear] = useState('2023/2024');
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
  
  useEffect(() => {
    loadMembers();
    loadSettings();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchApi('/api/admin/leadership_members');
      if (data) setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await fetchApi('/api/admin/site-settings');
      if (data && data.leadership_year) {
        setLeadershipYear(data.leadership_year);
      }
    } catch (error) {
      console.error('Failed to load settings', error);
    }
  };

  const handleUpdateYear = async () => {
    try {
      await fetchApi('/api/admin/site-settings/leadership-year', {
        method: 'PUT',
        body: JSON.stringify({ leadership_year: leadershipYear }),
      });
      alert('Leadership year updated securely!');
    } catch (error) {
      console.error('Failed to update leadership year', error);
      alert('Failed to update year.');
    }
  };

  const handleOpenModal = (item?: LeadershipMember) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        type: activeTab,
        hierarchy_level: 1,
        seat: 1,
        image_url: '',
        linkedin_url: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const data = new FormData();
    data.append('file', file);

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${baseUrl}/api/admin/upload/leadership`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      setFormData(prev => ({ ...prev, image_url: result.url }));
    } catch (error) {
      console.error('Failed to upload file', error);
      alert('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Ensure empty number fields are sent as null to prevent MySQL errors
      const payload = { ...formData };
      if (payload.year_start === '') payload.year_start = null;
      if (payload.year_end === '') payload.year_end = null;
      if (payload.sort_order === '') payload.sort_order = null;

      if (editingItem) {
        await fetchApi(`/api/admin/leadership_members/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await fetchApi('/api/admin/leadership_members', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      loadMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save member');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetchApi(`/api/admin/leadership_members/${id}`, { method: 'DELETE' });
        loadMembers();
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete member');
      }
    }
  };

  const filteredMembers = members
    .filter(m => m.type === activeTab)
    .sort((a, b) => {
      if (activeTab === 'past') {
        // Higher priority: sort_order if it exists and is not 0
        const orderA = a.sort_order || 0;
        const orderB = b.sort_order || 0;
        
        if (orderA !== orderB) {
           return orderA - orderB; // ASC (1 comes before 2)
        }
        // Fallback: year_end (DESC)
        if (a.year_end !== b.year_end) {
          return (b.year_end || 0) - (a.year_end || 0); // DESC
        }
        // Fallback: year_start (DESC)
        if (a.year_start !== b.year_start) {
          return (b.year_start || 0) - (a.year_start || 0); // DESC
        }
        return 0;
      } else {
        if (a.hierarchy_level !== b.hierarchy_level) {
          return a.hierarchy_level - b.hierarchy_level;
        }
        return a.seat - b.seat;
      }
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leadership Management</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm border border-slate-200">
            <span className="text-sm font-medium text-slate-600">Year:</span>
            <input 
              type="text" 
              value={leadershipYear}
              onChange={(e) => setLeadershipYear(e.target.value)}
              className="border border-slate-300 rounded px-2 py-1 w-28 text-sm focus:outline-none focus:ring-1 focus:ring-fitis-blue"
              placeholder="e.g. 2023/2024"
            />
            <button 
              onClick={handleUpdateYear}
              className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded hover:bg-slate-700 transition"
            >
              Save
            </button>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 shadow-sm"
          >
            <Plus size={20} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['current', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'current' | 'past')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'current' ? 'Current Board' : 'Past Leaders'}
            </button>
          ))}
        </nav>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">Photo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Designation</th>
                {activeTab === 'current' ? (
                  <>
                    <th className="p-4 text-sm font-semibold text-gray-600">Hierarchy</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Seat</th>
                  </>
                ) : (
                  <>
                    <th className="p-4 text-sm font-semibold text-gray-600">Term</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                  </>
                )}
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {item.image_url ? (
                      <img src={getImageUrl(item.image_url)} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'; }} />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {item.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    <div className="flex items-center space-x-2">
                      <span>{item.name}</span>
                      {item.linkedin_url && (
                         <a href={item.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                           <LinkIcon size={14} />
                         </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{item.designation}</td>
                  {activeTab === 'current' ? (
                    <>
                      <td className="p-4 text-gray-600">Level {item.hierarchy_level}</td>
                      <td className="p-4 text-gray-600">{item.seat}</td>
                    </>
                  ) : (
                    <>
                      <td className="p-4 text-gray-600">{item.year_start} - {item.year_end}</td>
                      <td className="p-4 text-gray-600 capitalize">{item.status || 'published'}</td>
                    </>
                  )}
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-fitis-blue bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors mr-2"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No members found. Click "Add New" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full shadow-2xl border border-slate-100 max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-slate-800 block mb-6 border-b border-slate-100 pb-3">
              {editingItem ? 'Edit Member' : 'Add New Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={formData.linkedin_url || ''}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type || 'current'}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  >
                    <option value="current">Current Board</option>
                    <option value="past">Past Leaders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'published'}
                    onChange={handleInputChange}
                    className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {formData.type === 'current' ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hierarchy Level</label>
                      <select
                        name="hierarchy_level"
                        value={formData.hierarchy_level || 1}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                      >
                        {[1, 2, 3, 4, 5].map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Seat Number (1-10)</label>
                      <input
                        type="number"
                        name="seat"
                        min="1"
                        max="10"
                        value={formData.seat || 1}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                        required={formData.type === 'current'}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year Start</label>
                      <input
                        type="number"
                        name="year_start"
                        value={formData.year_start || ''}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                        placeholder="e.g. 2021"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year End</label>
                      <input
                        type="number"
                        name="year_end"
                        value={formData.year_end || ''}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                        placeholder="e.g. 2023"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order (Optional)</label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order || 0}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                      placeholder="e.g. 1"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoading}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={getImageUrl(formData.image_url)} alt="Preview" className="w-16 h-16 rounded-full object-cover border bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'; }} />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all border border-transparent ${isLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-fitis-blue to-blue-700 hover:-translate-y-0.5'}`}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

