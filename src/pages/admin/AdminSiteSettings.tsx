import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

interface SiteSettingsData {
  site_email: string;
  site_phone: string;
  site_location: string;
  hero_type: 'image' | 'video';
  hero_url: string;
  favicon_url: string;
}

export const AdminSiteSettings: React.FC = () => {
  const [data, setData] = useState<SiteSettingsData>({
    site_email: '',
    site_phone: '',
    site_location: '',
    hero_type: 'image',
    hero_url: '',
    favicon_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadSettings = async () => {
    try {
      const res = await fetchApi('/api/admin/site-settings');
      if (res) setData(res);
    } catch (error) {
      showToast('Failed to load settings', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${baseUrl}/api/admin/upload/${type}`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      if (type === 'hero') {
        // Auto-detect type based on mimetype
        const heroType = file.type.startsWith('video/') ? 'video' : 'image';
        setData(prev => ({ ...prev, hero_url: result.url, hero_type: heroType }));
      } else {
        setData(prev => ({ ...prev, favicon_url: result.url }));
      }

      showToast('File uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi('/api/admin/site-settings', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      showToast('Settings saved successfully', 'success');
      // Refresh the page to ensure the UI instantly reflects changes since it's an SPA
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast('Failed to save settings', 'error');
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

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contact Email</label>
              <input
                type="email"
                name="site_email"
                value={data.site_email}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Contact Phone</label>
              <input
                type="text"
                name="site_phone"
                value={data.site_phone}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">Office Location</label>
              <input
                type="text"
                name="site_location"
                value={data.site_location}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4">Media Settings</h3>

            <div className="mb-6 border p-4 rounded-lg bg-gray-50">
              <label className="block text-gray-700 text-sm font-bold mb-2">Favicon (ICO, PNG, SVG)</label>
              <input
                type="file"
                accept=".ico,.png,.svg"
                onChange={(e) => handleFileUpload(e, 'favicon')}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isLoading}
              />
              {data.favicon_url && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview:</p>
                  <img src={getImageUrl(data.favicon_url)} alt="Favicon preview" className="w-8 h-8 border rounded shadow-sm bg-white" />
                </div>
              )}
            </div>

            <div className="mb-6 border p-4 rounded-lg bg-gray-50">
              <label className="block text-gray-700 text-sm font-bold mb-2">Hero Media (JPG, PNG, WEBP, MP4, WEBM)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
                onChange={(e) => handleFileUpload(e, 'hero')}
                className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                disabled={isLoading}
              />

              {data.hero_url && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">Preview ({data.hero_type}):</p>
                  <div className="relative w-full max-w-md aspect-video bg-black rounded-lg overflow-hidden shadow-sm">
                    {data.hero_type === 'video' ? (
                      <video src={getImageUrl(data.hero_url)} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                    ) : (
                      <img src={getImageUrl(data.hero_url)} alt="Hero preview" className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded shadow ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
