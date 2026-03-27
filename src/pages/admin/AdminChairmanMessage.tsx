import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

export const AdminChairmanMessage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [chairmanData, setChairmanData] = useState({
    name: '',
    designation: '',
    company: '',
    photo_url: '',
    message_title: '',
    message_body: '',
    status: 'published'
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSettings = async () => {
    try {
      const chairmanRes = await fetchApi('/api/admin/chairman-message');
      if (chairmanRes && !chairmanRes.error) {
         setChairmanData(chairmanRes);
      }
    } catch (error) {
      showToast('Failed to load chairman message', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi('/api/admin/chairman-message', {
        method: 'PUT',
        body: JSON.stringify(chairmanData),
      });
      showToast('Chairman message saved successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast('Failed to save chairman message', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 relative">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50 transition-opacity`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Chairman's Message</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Chairman Name</label>
                <input
                  type="text"
                  value={chairmanData.name || ''}
                  onChange={(e) => setChairmanData({ ...chairmanData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Designation</label>
                <input
                  type="text"
                  value={chairmanData.designation || ''}
                  onChange={(e) => setChairmanData({ ...chairmanData, designation: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Company / Organization</label>
                <input
                  type="text"
                  value={chairmanData.company || ''}
                  onChange={(e) => setChairmanData({ ...chairmanData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={chairmanData.status || 'draft'}
                  onChange={(e) => setChairmanData({ ...chairmanData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Chairman Photo</label>
                {chairmanData.photo_url && (
                   <div className="mb-4">
                      <img src={getImageUrl(chairmanData.photo_url)} alt="Chairman" className="h-40 rounded-lg object-cover" />
                   </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      try {
                        const token = localStorage.getItem('adminToken');
                        const formData = new FormData();
                        formData.append('file', e.target.files[0]);
                        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/upload/chairman-photo`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${token}` },
                          body: formData
                        });
                        if (!res.ok) throw new Error('Upload failed');
                        const data = await res.json();
                        setChairmanData({ ...chairmanData, photo_url: data.url });
                      } catch (err) {
                        alert('Failed to upload image');
                      }
                    }
                  }}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fitis-blue/10 file:text-fitis-blue hover:file:bg-fitis-blue/20 cursor-pointer"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Message Title</label>
                <input
                  type="text"
                  value={chairmanData.message_title || ''}
                  onChange={(e) => setChairmanData({ ...chairmanData, message_title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Message Body</label>
                <textarea
                  rows={8}
                  value={chairmanData.message_body || ''}
                  onChange={(e) => setChairmanData({ ...chairmanData, message_body: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-fitis-blue focus:border-fitis-blue"
                />
              </div>
            </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded shadow ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isLoading ? 'Saving...' : 'Save Chairman Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
