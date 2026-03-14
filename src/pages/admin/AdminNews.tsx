import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  banner_image_url: string;
  pdf_url: string;
  category: 'Announcement' | 'Event' | 'Industry';
  status: 'draft' | 'published';
  publish_date: string;
  author: string;
}

export const AdminNews: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({});
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await fetchApi('/api/admin/news');
      if (data) setItems(data);
    } catch (error) {
      console.error('Failed to load news', error);
    }
  };

  const handleOpenModal = (item?: NewsItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        category: 'Announcement',
        status: 'draft',
        publish_date: new Date().toISOString().split('T')[0],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({});
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'title' && !editingItem) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'pdf') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const data = new FormData();
    data.append('file', file);

    const token = localStorage.getItem('adminToken');
    const endpoint = type === 'banner' ? '/api/admin/upload/news-banner' : '/api/admin/upload/news-pdf';

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();

      if (type === 'banner') {
        setFormData(prev => ({ ...prev, banner_image_url: result.url }));
      } else {
        setFormData(prev => ({ ...prev, pdf_url: result.url }));
      }
    } catch (error) {
      console.error('Failed to upload file', error);
      alert('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetchApi(`/api/admin/news/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await fetchApi('/api/admin/news', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      loadItems();
      handleCloseModal();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save news article');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      try {
        await fetchApi(`/api/admin/news/${id}`, { method: 'DELETE' });
        loadItems();
      } catch (error) {
        console.error('Delete failed', error);
        alert('Failed to delete news article');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">News Articles</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">Banner</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    {item.banner_image_url ? (
                      <img src={getImageUrl(item.banner_image_url)} alt="Banner" className="w-16 h-10 object-cover rounded bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/160/100'; }} />
                    ) : (
                      <div className="w-16 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">None</div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-gray-800">{item.title}</td>
                  <td className="p-4 text-gray-600">{item.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{item.publish_date ? new Date(item.publish_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No news articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit News' : 'Add News'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" name="slug" value={formData.slug || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2 bg-gray-50" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="category" value={formData.category || 'Announcement'} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                    <option value="Announcement">Announcement</option>
                    <option value="Event">Event</option>
                    <option value="Industry">Industry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status || 'draft'} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                  <input type="date" name="publish_date" value={formData.publish_date ? formData.publish_date.split('T')[0] : ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author (optional)</label>
                  <input type="text" name="author" value={formData.author || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Excerpt</label>
                <textarea name="excerpt" value={formData.excerpt || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" rows={2} required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Content</label>
                <textarea name="content" value={formData.content || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" rows={6} required />
              </div>

              <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image (Required)</label>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => handleFileUpload(e, 'banner')} className="w-full text-sm mb-2" disabled={isLoading} />
                {formData.banner_image_url && (
                  <img src={getImageUrl(formData.banner_image_url)} alt="Preview" className="h-20 object-cover rounded border bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/160/100'; }} />
                )}
              </div>

              <div className="border p-4 rounded-lg bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF Document (Optional)</label>
                <input type="file" accept="application/pdf" onChange={(e) => handleFileUpload(e, 'pdf')} className="w-full text-sm mb-2" disabled={isLoading} />
                {formData.pdf_url && (
                  <p className="text-sm text-blue-600 break-all">{formData.pdf_url.split('/').pop()}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" disabled={isLoading} className={`px-4 py-2 text-white rounded-lg ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
