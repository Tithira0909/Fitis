import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface CommitteeMember {
  id?: number;
  name: string;
  designation: string;
  company: string;
  role_label: string;
  image_url: string;
  linkedin_url: string;
  display_order: number;
}

interface Chapter {
  id?: number;
  name: string;
  slug: string;
  summary: string;
  about_chapter: string;
  banner_image_url: string;
  chair_name: string;
  chair_title: string;
  chair_message: string;
  chair_image_url: string;
  contact_email: string;
  contact_phone: string;
  has_committee: boolean;
  status: string;
  committee: CommitteeMember[];
}

const emptyChapter: Chapter = {
  name: '',
  slug: '',
  summary: '',
  about_chapter: '',
  banner_image_url: '',
  chair_name: '',
  chair_title: '',
  chair_message: '',
  chair_image_url: '',
  contact_email: '',
  contact_phone: '',
  has_committee: false,
  status: 'active',
  committee: [],
};

const AdminChapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedId, setSelectedId] = useState<number | 'new'>('new');
  const [formData, setFormData] = useState<Chapter>(emptyChapter);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('adminToken');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/admin/chapters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch chapters');
      const data = await res.json();
      setChapters(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChapterDetails = async (id: number) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/admin/chapters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch chapter details');
      const data = await res.json();

      // Ensure has_committee is a boolean for toggle state
      data.has_committee = Boolean(data.has_committee);
      data.committee = data.committee || [];

      setFormData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setError('');
    setSuccess('');
    if (val === 'new') {
      setSelectedId('new');
      setFormData(emptyChapter);
    } else {
      const id = parseInt(val, 10);
      setSelectedId(id);
      fetchChapterDetails(id);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleQuillChange = (value: string) => {
    setFormData(prev => ({ ...prev, about_chapter: value }));
  };

  const handleCommitteeChange = (index: number, field: string, value: any) => {
    const updatedCommittee = [...formData.committee];
    updatedCommittee[index] = { ...updatedCommittee[index], [field]: value };
    setFormData(prev => ({ ...prev, committee: updatedCommittee }));
  };

  const addCommitteeMember = () => {
    setFormData(prev => ({
      ...prev,
      committee: [
        ...prev.committee,
        { name: '', designation: '', company: '', role_label: '', image_url: '', linkedin_url: '', display_order: 0 }
      ]
    }));
  };

  const removeCommitteeMember = (index: number) => {
    const updatedCommittee = [...formData.committee];
    updatedCommittee.splice(index, 1);
    setFormData(prev => ({ ...prev, committee: updatedCommittee }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, committeeIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    formDataUpload.append('folder', 'chapters');

    try {
      const res = await fetch(`${apiUrl}/api/admin/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formDataUpload,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();

      if (committeeIndex !== undefined) {
        handleCommitteeChange(committeeIndex, fieldName, data.imageUrl);
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: data.imageUrl }));
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const isNew = selectedId === 'new';
      const url = isNew ? `${apiUrl}/api/admin/chapters` : `${apiUrl}/api/admin/chapters/${selectedId}`;
      const method = isNew ? 'POST' : 'PUT';

      const payload = { ...formData };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save chapter');
      }

      const result = await res.json();
      setSuccess('Chapter saved successfully!');

      if (isNew && result.id) {
        setSelectedId(result.id);
        fetchChapters();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  const handleDelete = async () => {
    if (selectedId === 'new') return;
    if (!confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) return;

    try {
      setSaving(true);
      const res = await fetch(`${apiUrl}/api/admin/chapters/${selectedId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete chapter');

      setSuccess('Chapter deleted successfully');
      setSelectedId('new');
      setFormData(emptyChapter);
      fetchChapters();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Top Bar for Selection */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b">
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <h2 className="text-xl font-bold text-gray-800">Manage Chapters</h2>
          <select
            className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 pl-3 pr-10"
            value={selectedId}
            onChange={handleSelectChange}
            disabled={loading}
          >
            <option value="new">-- Select a Chapter to Edit --</option>
            {chapters.map(ch => (
              <option key={ch.id} value={ch.id}>{ch.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            setSelectedId('new');
            setFormData(emptyChapter);
            setError('');
            setSuccess('');
          }}
          className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          + Add New
        </button>
      </div>

      {error && <div className="mb-4 bg-red-50 text-red-600 p-4 rounded-md text-sm">{error}</div>}
      {success && <div className="mb-4 bg-green-50 text-green-600 p-4 rounded-md text-sm">{success}</div>}
      {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}

      {!loading && (
        <div className="space-y-8">

          {/* SECTION 1: Basic Info */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">1. Basic Chapter Info</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name *</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug / URL</label>
                <input
                  type="text" name="slug" value={formData.slug} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  placeholder="Leave blank to auto-generate"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description / Summary</label>
              <textarea
                name="summary" value={formData.summary} onChange={handleChange} rows={2}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">About Chapter (Rich Text)</label>
              <div className="bg-white">
                <ReactQuill theme="snow" value={formData.about_chapter || ''} onChange={handleQuillChange} />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image Upload</label>
              <div className="flex items-center space-x-4">
                {formData.banner_image_url && (
                  <img src={`${apiUrl}${formData.banner_image_url}`} alt="Banner Preview" className="h-16 w-32 object-cover rounded border" />
                )}
                <input
                  type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_image_url')}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* SECTION 2: Chairman Details */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-300">2. Chairman / Chapter Head Section</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Name</label>
                <input
                  type="text" name="chair_name" value={formData.chair_name} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Designation</label>
                <input
                  type="text" name="chair_title" value={formData.chair_title} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                  placeholder="e.g. President, Software Chapter"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Message</label>
              <textarea
                name="chair_message" value={formData.chair_message || ''} onChange={handleChange} rows={5}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                placeholder="Enter the chairman's message..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Chairman Image Upload</label>
              <div className="flex items-center space-x-4 bg-white p-4 border rounded-md">
                {formData.chair_image_url ? (
                  <img src={`${apiUrl}${formData.chair_image_url}`} alt="Chairman Preview" className="h-16 w-16 object-cover rounded-full border" />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <input
                  type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'chair_image_url')}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Optional)</label>
                <input
                  type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone (Optional)</label>
                <input
                  type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Executive Committee (Optional) */}
          <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">3. Chapter Executive Committee (Optional)</h3>
                <p className="text-sm text-gray-500">Enable this section if the chapter has a committee to display.</p>
              </div>

              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input type="checkbox" name="has_committee" className="sr-only" checked={formData.has_committee} onChange={handleChange} />
                  <div className={`block w-14 h-8 rounded-full ${formData.has_committee ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.has_committee ? 'translate-x-6' : ''}`}></div>
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                  {formData.has_committee ? 'Enabled' : 'Disabled'}
                </div>
              </label>
            </div>

            {formData.has_committee && (
              <div className="mt-6 space-y-6">
                {formData.committee.length === 0 && (
                  <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-md text-gray-500">
                    No committee members added yet. Click below to add one.
                  </div>
                )}

                {formData.committee.map((member, idx) => (
                  <div key={idx} className="bg-white p-4 rounded border border-gray-200 shadow-sm relative">
                    <button
                      type="button"
                      onClick={() => removeCommitteeMember(idx)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-medium text-sm"
                    >
                      Remove
                    </button>
                    <h4 className="font-medium text-gray-700 mb-4 border-b pb-2 w-3/4">Committee Member #{idx + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                        <input type="text" value={member.name} onChange={(e) => handleCommitteeChange(idx, 'name', e.target.value)} required className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
                        <input type="text" value={member.designation} onChange={(e) => handleCommitteeChange(idx, 'designation', e.target.value)} className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Vice President" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Company/Org</label>
                        <input type="text" value={member.company} onChange={(e) => handleCommitteeChange(idx, 'company', e.target.value)} className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Acme Corp" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Role Label (Optional Badge)</label>
                        <input type="text" value={member.role_label} onChange={(e) => handleCommitteeChange(idx, 'role_label', e.target.value)} className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. EXCO Member" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">LinkedIn URL</label>
                        <input type="url" value={member.linkedin_url} onChange={(e) => handleCommitteeChange(idx, 'linkedin_url', e.target.value)} className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Display Order</label>
                        <input type="number" value={member.display_order} onChange={(e) => handleCommitteeChange(idx, 'display_order', parseInt(e.target.value, 10))} className="w-full border-gray-300 rounded p-2 text-sm border focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {member.image_url ? (
                        <img src={`${apiUrl}${member.image_url}`} alt="Preview" className="h-12 w-12 object-cover rounded-full border" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-xs border">No img</div>
                      )}
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-500 mb-1">Upload Photo</label>
                        <input
                          type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url', idx)}
                          className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addCommitteeMember}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                  Add Committee Member
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
            {selectedId !== 'new' && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="px-6 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-md font-medium transition-colors disabled:opacity-50"
              >
                Delete Chapter
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !formData.name}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 flex items-center"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export { AdminChapters };
