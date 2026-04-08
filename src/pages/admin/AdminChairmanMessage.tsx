import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';
import { Plus, Trash2 } from 'lucide-react';

interface FocusCard {
  icon: string;
  title: string;
}

interface ChairmanMessageData {
  name: string;
  designation: string;
  subtitle: string;
  photo_url: string;
  message_title: string;
  message_body: string;
  focus_cards: FocusCard[];
  status: 'draft' | 'published';
}

const AVAILABLE_ICONS = [
  { value: 'Lightbulb', label: 'Lightbulb' },
  { value: 'Target', label: 'Target' },
  { value: 'Users', label: 'Users' },
  { value: 'Globe', label: 'Globe' },
  { value: 'TrendingUp', label: 'Trending Up' },
  { value: 'Eye', label: 'Eye' },
  { value: 'Shield', label: 'Shield' }
];

export const AdminChairmanMessage: React.FC = () => {
  const [data, setData] = useState<ChairmanMessageData>({
    name: '',
    designation: '',
    subtitle: '',
    photo_url: '',
    message_title: '',
    message_body: '',
    focus_cards: [],
    status: 'published'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const res = await fetchApi('/api/admin/chairman-message');
      if (res) {
        setData({
          ...res,
          subtitle: res.subtitle || '',
          focus_cards: typeof res.focus_cards === 'string' ? JSON.parse(res.focus_cards) : (res.focus_cards || [])
        });
      }
    } catch (error) {
      showToast('Failed to load chairman message', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch(`${baseUrl}/api/admin/upload/chairman-photo`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setData(prev => ({ ...prev, photo_url: result.url }));
      showToast('Photo uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload photo', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const addFocusCard = () => {
    if (data.focus_cards.length >= 4) {
      showToast('Maximum 4 focus cards allowed', 'error');
      return;
    }
    setData(prev => ({
      ...prev,
      focus_cards: [...prev.focus_cards, { icon: 'Eye', title: '' }]
    }));
  };

  const updateFocusCard = (index: number, field: keyof FocusCard, value: string) => {
    const newCards = [...data.focus_cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setData(prev => ({ ...prev, focus_cards: newCards }));
  };

  const removeFocusCard = (index: number) => {
    const newCards = data.focus_cards.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, focus_cards: newCards }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchApi('/api/admin/chairman-message', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      showToast('Settings saved successfully', 'success');
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
    <div className="max-w-5xl mx-auto space-y-6 relative pb-10">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50 transition-opacity`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chairman's Message</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Column: Profile Info & Photo */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Profile Details</h3>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Chairman Name *</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Designation / Title *</label>
                <input
                  type="text"
                  name="designation"
                  value={data.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Chairman, FITIS"
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Subtitle (Optional)</label>
                <input
                  type="text"
                  name="subtitle"
                  value={data.subtitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Strategic Adviser / Vice President Huawei Technologies"
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                />
              </div>

              <div className="border-2 border-slate-100 p-6 rounded-2xl bg-slate-50/50">
                <label className="block text-gray-700 text-sm font-bold mb-2">Chairman Photo * (Portrait recommended)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  disabled={isLoading}
                />

                {data.photo_url && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    <img src={getImageUrl(data.photo_url)} alt="Chairman preview" className="w-32 h-auto rounded shadow-sm object-cover bg-slate-100" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x500'; }} />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Message Content & Status */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold border-b pb-2">Message Content</h3>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Message Title *</label>
                <input
                  type="text"
                  name="message_title"
                  value={data.message_title}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Message Body *</label>
                <textarea
                  name="message_body"
                  value={data.message_body}
                  onChange={handleInputChange}
                  rows={10}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                <select
                  name="status"
                  value={data.status}
                  onChange={handleInputChange}
                  className="w-full border border-slate-200 rounded-xl p-3 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all outline-none shadow-sm text-slate-800"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Focus Cards Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Focus Cards (Max 4)</h3>
              <button
                type="button"
                onClick={addFocusCard}
                disabled={data.focus_cards.length >= 4}
                className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                <Plus size={16} />
                <span>Add Card</span>
              </button>
            </div>

            {data.focus_cards.length === 0 ? (
              <p className="text-gray-500 italic">No focus cards added. Click 'Add Card' to create one.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.focus_cards.map((card, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-gray-50 relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeFocusCard(idx)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Icon</label>
                      <select
                        value={card.icon}
                        onChange={(e) => updateFocusCard(idx, 'icon', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                      >
                        {AVAILABLE_ICONS.map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateFocusCard(idx, 'title', e.target.value)}
                        className="w-full text-sm p-1 border rounded"
                        placeholder="e.g. Digital Transformation"
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isLoading}
              className={`font-bold py-3.5 px-10 rounded-xl shadow-lg transition-all border border-transparent ${isLoading ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-gradient-to-r from-fitis-blue to-blue-700 text-white hover:shadow-xl hover:-translate-y-0.5'}`}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

