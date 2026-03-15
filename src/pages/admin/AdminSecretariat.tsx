import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface SecretariatMember {
  id: number;
  name: string;
  role: string;
  photo_url: string;
  linkedin_url: string;
  facebook_url: string;
  sort_order: number;
  status: 'draft' | 'published';
}

export const AdminSecretariat: React.FC = () => {
  const [members, setMembers] = useState<SecretariatMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SecretariatMember | null>(null);
  const [formData, setFormData] = useState<Partial<SecretariatMember>>({
    sort_order: 0,
    status: 'published'
  });
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await fetchApi('/api/admin/secretariat_team');
      if (data) setMembers(data);
    } catch (error) {
      console.error('Failed to load members', error);
    }
  };

  const handleOpenModal = (item?: SecretariatMember) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ sort_order: 0, status: 'published' });
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
      const response = await fetch(`${baseUrl}/api/admin/upload/secretariat-photo`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: uploadData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setFormData(prev => ({ ...prev, photo_url: result.url }));
    } catch (error) {
      console.error('Upload error', error);
      alert('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingItem) {
        await fetchApi(`/api/admin/secretariat_team/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/api/admin/secretariat_team', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      await loadMembers();
      handleCloseModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await fetchApi(`/api/admin/secretariat_team/${id}`, {
          method: 'DELETE',
        });
        await loadMembers();
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete member');
      }
    }
  };

  const sortedMembers = [...members].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Secretariat Team</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">Photo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Sort Order</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedMembers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {item.photo_url ? (
                      <img src={getImageUrl(item.photo_url)} alt={item.name} className="w-10 h-10 rounded-full object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'; }} />
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
                  <td className="p-4 text-gray-600">{item.role}</td>
                  <td className="p-4 text-gray-600">{item.sort_order}</td>
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
              {sortedMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Position / Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role || ''}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  name="facebook_url"
                  value={formData.facebook_url || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={formData.status || 'published'}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={formData.sort_order || 0}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
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
                {formData.photo_url && (
                  <div className="mt-2">
                    <img src={getImageUrl(formData.photo_url)} alt="Preview" className="w-16 h-16 rounded-full object-cover border bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff'; }} />
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
