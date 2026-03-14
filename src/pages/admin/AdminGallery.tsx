import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, CheckCircle, X } from 'lucide-react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface GalleryImage {
  id: number;
  post_id: number;
  image_url: string;
  sort_order: number;
}

interface GalleryPost {
  id: number;
  title: string;
  description: string;
  event_date: string;
  status: 'draft' | 'published';
  images?: GalleryImage[]; // populated when fetching single post
}

export const AdminGallery: React.FC = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<GalleryPost | null>(null);
  const [formData, setFormData] = useState<Partial<GalleryPost>>({});
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadPosts();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadPosts = async () => {
    try {
      const data = await fetchApi('/api/admin/gallery');
      if (data) setPosts(data);
    } catch (error) {
      console.error('Failed to load gallery posts', error);
    }
  };

  const loadPostDetails = async (id: number) => {
    try {
      const data = await fetchApi(`/api/admin/gallery/${id}`);
      if (data) {
        setEditingPost(data);
        setFormData(data);
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Failed to load post details', error);
    }
  };

  const handleOpenModal = (post?: GalleryPost) => {
    if (post) {
      loadPostDetails(post.id);
    } else {
      setEditingPost(null);
      setFormData({ status: 'draft' });
      setImages([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
    setFormData({});
    setImages([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 1. Save Post Data (Without Images first)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let savedPost;
      if (editingPost) {
        await fetchApi(`/api/admin/gallery/${editingPost.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        savedPost = editingPost;
        showToast('Gallery details updated');
      } else {
        savedPost = await fetchApi('/api/admin/gallery', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        setEditingPost(savedPost); // Transition to edit mode so images can be added
        setFormData(savedPost);
        showToast('Gallery created! Now you can upload images.');
      }
      loadPosts();
    } catch (error) {
      console.error('Save failed', error);
      alert('Failed to save gallery post');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Upload Images (Multiple)
  const handleUploadImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPost) return; // Must have saved post first
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('files', files[i]);
    }

    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${baseUrl}/api/admin/gallery/${editingPost.id}/images`, {
        method: 'POST',
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: data,
      });

      if (!response.ok) throw new Error('Upload failed');
      // Reload images from server to get accurate state
      await loadPostDetails(editingPost.id);
      showToast('Images uploaded successfully');

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Failed to upload images', error);
      alert('Failed to upload images');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Delete Image
  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Delete this image?')) return;
    try {
      await fetchApi(`/api/admin/gallery/images/${imageId}`, { method: 'DELETE' });
      setImages(prev => prev.filter(img => img.id !== imageId));
      showToast('Image deleted');
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  // 4. Reorder Images
  const moveImage = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === images.length - 1) return;

    const newImages = [...images];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap items in array
    const temp = newImages[index];
    newImages[index] = newImages[swapIndex];
    newImages[swapIndex] = temp;

    // Recalculate sort_order (1-based index)
    const reordered = newImages.map((img, idx) => ({ ...img, sort_order: idx + 1 }));
    setImages(reordered);

    // Save to server
    try {
      await fetchApi(`/api/admin/gallery/${editingPost!.id}/images/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ images: reordered.map(i => ({ id: i.id, sort_order: i.sort_order })) }),
      });
      showToast('Images reordered');
    } catch (error) {
      console.error('Reorder failed', error);
      // Rollback
      await loadPostDetails(editingPost!.id);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this gallery entirely?')) return;
    try {
      await fetchApi(`/api/admin/gallery/${id}`, { method: 'DELETE' });
      loadPosts();
      showToast('Gallery deleted');
    } catch (error) {
      console.error('Delete failed', error);
    }
  };

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <CheckCircle size={18} /> {toast}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add New Gallery</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 text-sm font-semibold text-gray-600">ID</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Event Date</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-4 text-gray-600">#{post.id}</td>
                  <td className="p-4 font-medium text-gray-800">{post.title}</td>
                  <td className="p-4 text-gray-600">{post.event_date ? new Date(post.event_date).toLocaleDateString() : 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenModal(post)} className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDeletePost(post.id)} className="text-red-600 hover:bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No gallery posts found. Create one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">{editingPost ? 'Edit Gallery' : 'Create New Gallery'}</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-800">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid md:grid-cols-2 gap-8">
              {/* Left Column: Post Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Gallery Details</h3>
                <form id="gallery-form" onSubmit={handleSavePost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input type="text" name="title" value={formData.title || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" required />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" rows={4} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                      <input type="date" name="event_date" value={formData.event_date ? formData.event_date.split('T')[0] : ''} onChange={handleInputChange} className="w-full border rounded-lg p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select name="status" value={formData.status || 'draft'} onChange={handleInputChange} className="w-full border rounded-lg p-2">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" disabled={isLoading} className={`w-full py-2 text-white rounded-lg font-medium ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {editingPost ? 'Save Details' : 'Create Gallery'}
                  </button>
                </form>
              </div>

              {/* Right Column: Image Management (Only visible after creation) */}
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2 flex items-center gap-2">
                  <ImageIcon size={20} /> Image Management
                </h3>

                {!editingPost ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>Please create the gallery first to upload images.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-xl p-6 text-center">
                      <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={handleUploadImages} className="hidden" id="multi-upload" disabled={isLoading} />
                      <label htmlFor="multi-upload" className="cursor-pointer flex flex-col items-center">
                         <Plus size={32} className="text-blue-500 mb-2" />
                         <span className="font-semibold text-blue-700">Click to upload multiple images</span>
                         <span className="text-xs text-blue-500 mt-1">JPG, PNG, WEBP (Max 10MB each)</span>
                      </label>
                    </div>

                    <div className="space-y-3 mt-6 max-h-[300px] overflow-y-auto pr-2">
                      {images.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center">No images uploaded yet.</p>
                      ) : (
                        images.map((img, index) => (
                          <div key={img.id} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                            <div className="flex flex-col gap-1">
                              <button onClick={() => moveImage(index, 'up')} disabled={index === 0} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"><ArrowUp size={14} /></button>
                              <button onClick={() => moveImage(index, 'down')} disabled={index === images.length - 1} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30"><ArrowDown size={14} /></button>
                            </div>
                            <img src={getImageUrl(img.image_url)} alt="Gallery thumbnail" className="w-16 h-12 object-cover rounded bg-slate-100" />
                            <div className="flex-1 text-xs text-slate-400">Sort: {img.sort_order}</div>
                            <button onClick={() => handleDeleteImage(img.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
