import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { fetchApi } from '../../lib/api';

interface LeadershipMember {
  id: number;
  name: string;
  designation: string;
  type: 'current' | 'past';
  image_url: string;
  linkedin_url: string;
  hierarchy_level: number;
  seat: number;
}

export const AdminLeadership: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadershipMember | null>(null);
  const [formData, setFormData] = useState<Partial<LeadershipMember>>({});
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      // The generic API endpoint is GET /api/admin/leadership_members
      const data = await fetchApi('/api/admin/leadership_members');
      if (data) setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
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
      if (editingItem) {
        await fetchApi(`/api/admin/leadership_members/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/api/admin/leadership_members', {
          method: 'POST',
          body: JSON.stringify(formData),
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
      if (a.hierarchy_level !== b.hierarchy_level) {
        return a.hierarchy_level - b.hierarchy_level;
      }
      return a.seat - b.seat;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Leadership Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
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
                <th className="p-4 text-sm font-semibold text-gray-600">Hierarchy</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Seat</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {item.image_url ? (
                      <img src={item.image_url.startsWith('http') ? item.image_url : `${baseUrl}${item.image_url}`} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
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
                  <td className="p-4 text-gray-600">Level {item.hierarchy_level}</td>
                  <td className="p-4 text-gray-600">{item.seat}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
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
                  className="w-full border rounded-lg p-2"
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
                  className="w-full border rounded-lg p-2"
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
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type || 'current'}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="current">Current Board</option>
                    <option value="past">Past Leaders</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hierarchy Level</label>
                  <select
                    name="hierarchy_level"
                    value={formData.hierarchy_level || 1}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
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
                  className="w-full border rounded-lg p-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoading}
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img src={formData.image_url.startsWith('http') ? formData.image_url : `${baseUrl}${formData.image_url}`} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
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
