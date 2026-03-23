import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';
import { Plus, Trash2, GripVertical } from 'lucide-react';

interface PrivacySection {
  id?: number;
  section_title: string;
  section_html: string;
  sort_order: number;
}

interface PrivacyPolicyData {
  page_title: string;
  effective_date: string;
  status: 'draft' | 'published';
  sections: PrivacySection[];
}

interface SiteSettingsData {
  site_email: string;
  site_phone: string;
  site_location: string;
  hero_type: 'image' | 'video';
  hero_url: string;
  favicon_url: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  youtube_url: string;
}

export const AdminSiteSettings: React.FC = () => {
  const [data, setData] = useState<SiteSettingsData>({
    site_email: '',
    site_phone: '',
    site_location: '',
    hero_type: 'image',
    hero_url: '',
    favicon_url: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    twitter_url: '',
    youtube_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'privacy' | 'disclaimer'>('general');
  const [privacyData, setPrivacyData] = useState<PrivacyPolicyData>({
    page_title: 'PRIVACY POLICY',
    effective_date: new Date().toISOString().split('T')[0],
    status: 'published',
    sections: []
  });
  const [disclaimerData, setDisclaimerData] = useState<PrivacyPolicyData>({
    page_title: 'DISCLAIMER',
    effective_date: new Date().toISOString().split('T')[0],
    status: 'published',
    sections: []
  });

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    loadSettings();
    loadPrivacyPolicy();
    loadDisclaimer();
  }, []);

  const loadPrivacyPolicy = async () => {
    try {
      const res = await fetchApi('/api/admin/privacy-policy');
      if (res) {
        setPrivacyData({
          ...res,
          effective_date: res.effective_date ? res.effective_date.split('T')[0] : new Date().toISOString().split('T')[0],
          sections: res.sections || []
        });
      }
    } catch (error) {
      console.error('Failed to load privacy policy', error);
    }
  };

  const loadDisclaimer = async () => {
    try {
      const res = await fetchApi('/api/admin/disclaimer');
      if (res) {
        setDisclaimerData({
          ...res,
          effective_date: res.effective_date ? res.effective_date.split('T')[0] : new Date().toISOString().split('T')[0],
          sections: res.sections || []
        });
      }
    } catch (error) {
      console.error('Failed to load disclaimer', error);
    }
  };

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
      } else if (type === 'favicon') {
        setData(prev => ({ ...prev, favicon_url: result.url }));
      } else if (type === 'header_logo') {
        setData(prev => ({ ...prev, header_logo_url: result.url }));
      } else if (type === 'footer_logo') {
        setData(prev => ({ ...prev, footer_logo_url: result.url }));
      }

      showToast('File uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload file', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrivacyData(prev => ({ ...prev, [name]: value }));
  };

  const addPrivacySection = () => {
    setPrivacyData(prev => ({
      ...prev,
      sections: [...prev.sections, { section_title: '', section_html: '', sort_order: prev.sections.length }]
    }));
  };

  const removePrivacySection = (index: number) => {
    const newSections = privacyData.sections.filter((_, i) => i !== index);
    setPrivacyData(prev => ({ ...prev, sections: newSections }));
  };

  const updatePrivacySection = (index: number, field: keyof PrivacySection, value: string) => {
    const newSections = [...privacyData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setPrivacyData(prev => ({ ...prev, sections: newSections }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === privacyData.sections.length - 1) return;

    const newSections = [...privacyData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update sort orders
    newSections.forEach((sec, i) => sec.sort_order = i);
    setPrivacyData(prev => ({ ...prev, sections: newSections }));
  };

  const handleDisclaimerInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDisclaimerData(prev => ({ ...prev, [name]: value }));
  };

  const addDisclaimerSection = () => {
    setDisclaimerData(prev => ({
      ...prev,
      sections: [...prev.sections, { section_title: '', section_html: '', sort_order: prev.sections.length }]
    }));
  };

  const removeDisclaimerSection = (index: number) => {
    const newSections = disclaimerData.sections.filter((_, i) => i !== index);
    setDisclaimerData(prev => ({ ...prev, sections: newSections }));
  };

  const updateDisclaimerSection = (index: number, field: keyof PrivacySection, value: string) => {
    const newSections = [...disclaimerData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setDisclaimerData(prev => ({ ...prev, sections: newSections }));
  };

  const moveDisclaimerSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === disclaimerData.sections.length - 1) return;

    const newSections = [...disclaimerData.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    newSections.forEach((sec, i) => sec.sort_order = i);
    setDisclaimerData(prev => ({ ...prev, sections: newSections }));
  };

  const handleDisclaimerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi('/api/admin/disclaimer', {
        method: 'PUT',
        body: JSON.stringify(disclaimerData),
      });
      showToast('Disclaimer saved successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast('Failed to save Disclaimer', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi('/api/admin/privacy-policy', {
        method: 'PUT',
        body: JSON.stringify(privacyData),
      });
      showToast('Privacy Policy saved successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      showToast('Failed to save Privacy Policy', 'error');
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

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['general', 'privacy', 'disclaimer'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'general' | 'privacy' | 'disclaimer')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'general' && 'General Settings'}
              {tab === 'privacy' && 'Privacy Policy'}
              {tab === 'disclaimer' && 'Disclaimer'}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'general' ? (
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

            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Social Media Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Facebook URL</label>
                  <input type="url" name="facebook_url" value={data.facebook_url || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="https://facebook.com/..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Instagram URL</label>
                  <input type="url" name="instagram_url" value={data.instagram_url || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="https://instagram.com/..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">LinkedIn URL</label>
                  <input type="url" name="linkedin_url" value={data.linkedin_url || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="https://linkedin.com/..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Twitter/X URL</label>
                  <input type="url" name="twitter_url" value={data.twitter_url || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="https://twitter.com/..." />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">YouTube URL</label>
                  <input type="url" name="youtube_url" value={data.youtube_url || ''} onChange={handleInputChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="https://youtube.com/..." />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <h3 className="text-lg font-semibold mb-4">Media Settings</h3>

            <div className="mb-6 border p-4 rounded-lg bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Branding & Logos</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Header Logo</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, 'header_logo')}
                    className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isLoading}
                  />
                  {data.header_logo_url && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <div className="relative group inline-block">
                        <img src={getImageUrl(data.header_logo_url)} alt="Header Logo" className="h-12 object-contain border rounded shadow-sm bg-slate-100 p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        <button type="button" onClick={() => setData(prev => ({...prev, header_logo_url: ''}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Footer Logo (Optional)</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={(e) => handleFileUpload(e, 'footer_logo')}
                    className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    disabled={isLoading}
                  />
                  {data.footer_logo_url && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Preview:</p>
                      <div className="relative group inline-block">
                        <img src={getImageUrl(data.footer_logo_url)} alt="Footer Logo" className="h-12 object-contain border rounded shadow-sm bg-slate-100 p-1" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        <button type="button" onClick={() => setData(prev => ({...prev, footer_logo_url: ''}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
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
                      <div className="relative group inline-block">
                        <img src={getImageUrl(data.favicon_url)} alt="Favicon" className="w-8 h-8 border rounded shadow-sm bg-slate-100 p-1 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        <button type="button" onClick={() => setData(prev => ({...prev, favicon_url: ''}))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                      <video src={getImageUrl(data.hero_url)} autoPlay muted loop playsInline className="w-full h-full object-cover bg-slate-100" />
                    ) : (
                      <img src={getImageUrl(data.hero_url)} alt="Hero preview" className="w-full h-full object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/1200/600'; }} />
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
      ) : activeTab === 'privacy' ? (
      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handlePrivacySubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Effective Date *</label>
              <input
                type="date"
                name="effective_date"
                value={privacyData.effective_date}
                onChange={handlePrivacyInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Page Title</label>
              <input
                type="text"
                name="page_title"
                value={privacyData.page_title}
                onChange={handlePrivacyInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                name="status"
                value={privacyData.status}
                onChange={handlePrivacyInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Policy Sections</h3>
              <button
                type="button"
                onClick={addPrivacySection}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus size={16} />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {privacyData.sections.length === 0 ? (
                <p className="text-gray-500 italic">No sections added yet. Click 'Add Section' to begin.</p>
              ) : (
                privacyData.sections.map((sec, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                    <div className="flex flex-col items-center justify-center space-y-2 border-r pr-4 text-gray-400">
                      <button type="button" onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="hover:text-blue-600 disabled:opacity-30">▲</button>
                      <GripVertical size={20} />
                      <button type="button" onClick={() => moveSection(idx, 'down')} disabled={idx === privacyData.sections.length - 1} className="hover:text-blue-600 disabled:opacity-30">▼</button>
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-full mr-4">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading *</label>
                          <input
                            type="text"
                            value={sec.section_title}
                            onChange={(e) => updatePrivacySection(idx, 'section_title', e.target.value)}
                            className="w-full text-sm p-2 border rounded shadow-inner"
                            placeholder="e.g. 1. Introduction"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePrivacySection(idx)}
                          className="text-red-500 hover:text-red-700 mt-5"
                          title="Remove Section"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Content (HTML Supported) *</label>
                        <textarea
                          value={sec.section_html}
                          onChange={(e) => updatePrivacySection(idx, 'section_html', e.target.value)}
                          className="w-full text-sm p-2 border rounded shadow-inner"
                          rows={6}
                          placeholder="<p>This is the content...</p>"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded shadow ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isLoading ? 'Saving...' : 'Save Privacy Policy'}
            </button>
          </div>
        </form>
      </div>
      ) : (
      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleDisclaimerSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Effective Date *</label>
              <input
                type="date"
                name="effective_date"
                value={disclaimerData.effective_date}
                onChange={handleDisclaimerInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Page Title</label>
              <input
                type="text"
                name="page_title"
                value={disclaimerData.page_title}
                onChange={handleDisclaimerInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                name="status"
                value={disclaimerData.status}
                onChange={handleDisclaimerInputChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Disclaimer Sections</h3>
              <button
                type="button"
                onClick={addDisclaimerSection}
                className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus size={16} />
                <span>Add Section</span>
              </button>
            </div>

            <div className="space-y-4">
              {disclaimerData.sections.length === 0 ? (
                <p className="text-gray-500 italic">No sections added yet. Click 'Add Section' to begin.</p>
              ) : (
                disclaimerData.sections.map((sec, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex gap-4">
                    <div className="flex flex-col items-center justify-center space-y-2 border-r pr-4 text-gray-400">
                      <button type="button" onClick={() => moveDisclaimerSection(idx, 'up')} disabled={idx === 0} className="hover:text-blue-600 disabled:opacity-30">▲</button>
                      <GripVertical size={20} />
                      <button type="button" onClick={() => moveDisclaimerSection(idx, 'down')} disabled={idx === disclaimerData.sections.length - 1} className="hover:text-blue-600 disabled:opacity-30">▼</button>
                    </div>
                    <div className="flex-grow space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="w-full mr-4">
                          <label className="block text-xs font-bold text-gray-700 mb-1">Section Heading *</label>
                          <input
                            type="text"
                            value={sec.section_title}
                            onChange={(e) => updateDisclaimerSection(idx, 'section_title', e.target.value)}
                            className="w-full text-sm p-2 border rounded shadow-inner"
                            placeholder="e.g. Testimonials Disclaimer"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDisclaimerSection(idx)}
                          className="text-red-500 hover:text-red-700 mt-5"
                          title="Remove Section"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Content (HTML Supported) *</label>
                        <textarea
                          value={sec.section_html}
                          onChange={(e) => updateDisclaimerSection(idx, 'section_html', e.target.value)}
                          className="w-full text-sm p-2 border rounded shadow-inner"
                          rows={6}
                          placeholder="<p>This is the content...</p>"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3 px-8 rounded shadow ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isLoading ? 'Saving...' : 'Save Disclaimer'}
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};
