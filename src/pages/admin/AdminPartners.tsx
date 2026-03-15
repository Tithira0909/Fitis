import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon, Search, Filter } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface Partner {
  id: number;
  name: string;
  category: 'government' | 'industry' | 'international' | 'premium_corporate' | 'corporate' | 'supporting';
  logo_url: string;
  website_url: string;
  sort_order: number;
  status: 'draft' | 'published';
}

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government Partners',
  industry: 'Industry Partners',
  international: 'International Bodies',
  premium_corporate: 'Premium Corporate Partners',
  corporate: 'Corporate Partners',
  supporting: 'Supporting Partners',
};

export const AdminPartners: React.FC = () => {
  const [members, setMembers] = useState<Partner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<Partial<Partner>>({
    category: 'corporate',
    sort_order: 0,
    status: 'published'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchApi('/api/admin/partners');
      if (data) setMembers(data);
    } catch (error) {
      console.error('Failed to load partners', error);
    }
  };

  const handleOpenModal = (item?: Partner) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ category: 'corporate', sort_order: 0, status: 'published' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const uploadData = new FormData();
    uploadData.append('file', file);

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${baseUrl}/api/admin/upload/partner-logo`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: uploadData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setFormData(prev => ({ ...prev, logo_url: result.url }));
    } catch (error) {
      console.error('Upload error', error);
      alert('Failed to upload logo');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingItem) {
        await fetchApi(`/api/admin/partners/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/api/admin/partners', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      await loadMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save partner');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await fetchApi(`/api/admin/partners/${id}`, {
          method: 'DELETE',
        });
        await loadMembers();
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete partner');
      }
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Partners Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search partners by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-64 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">Logo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Partner Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Sort Order</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredMembers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {item.logo_url ? (
                      <div className="w-16 h-12 flex items-center justify-center bg-gray-50 rounded border border-gray-100 overflow-hidden">
                        <img src={getImageUrl(item.logo_url)} alt={item.name} className="max-w-full max-h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">No Logo</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800">
                    <div className="flex items-center space-x-2">
                      <span>{item.name}</span>
                      {item.website_url && (
                         <a href={item.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                           <LinkIcon size={14} />
                         </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">{CATEGORY_LABELS[item.category] || item.category}</td>
                  <td className="p-4 text-gray-600">{item.sort_order}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenModal(item)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No partners found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {editingItem ? 'Edit Partner' : 'Add New Partner'}
              </h2>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <form id="partnerForm" onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Partner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Category/Group *</label>
                  <select
                    name="category"
                    value={formData.category || 'corporate'}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    required
                  >
                    {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Website URL (Optional)</label>
                  <input
                    type="url"
                    name="website_url"
                    value={formData.website_url || ''}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status || 'published'}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Sort Order</label>
                    <input
                      type="number"
                      name="sort_order"
                      value={formData.sort_order ?? 0}
                      onChange={handleInputChange}
                      className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Partner Logo *</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    disabled={isLoading}
                    required={!formData.logo_url}
                  />
                  {formData.logo_url && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-1 font-semibold">Preview:</p>
                      <div className="bg-white border rounded p-4 inline-block shadow-sm">
                        <img src={getImageUrl(formData.logo_url)} alt="Logo Preview" className="h-16 w-auto object-contain" />
                      </div>
                    </div>
                  )}
                </div>

              </form>
            </div>

            <div className="p-6 border-t bg-gray-50 rounded-b-xl flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="partnerForm"
                disabled={isLoading}
                className={`px-6 py-2.5 text-white font-bold rounded-lg shadow-sm transition-colors ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Saving...' : 'Save Partner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
