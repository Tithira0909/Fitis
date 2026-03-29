import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Users, ArrowLeft, Image as ImageIcon, UserCircle as UserSquare, X } from 'lucide-react';
import { cn } from '../../lib/utils';

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
  const [view, setView] = useState<'list' | 'form'>('list');

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
      setView('form');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    setSelectedId(id);
    fetchChapterDetails(id);
  };

  const handleAddNew = () => {
    setSelectedId('new');
    setFormData(emptyChapter);
    setView('form');
    setError('');
    setSuccess('');
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

      setSuccess('Chapter saved successfully!');
      fetchChapters();
      setView('list');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this chapter? This action cannot be undone.')) return;

    try {
      setSaving(true);
      const res = await fetch(`${apiUrl}/api/admin/chapters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete chapter');

      setSuccess('Chapter deleted successfully');
      fetchChapters();
      setView('list');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow min-h-[600px]">
      {/* List View */}
      {view === 'list' && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 pb-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Chapters Management</h2>
              <p className="text-sm text-gray-500 mt-1">Manage specialized industry chapters and their presidents.</p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-200"
            >
              + Create New Chapter
            </button>
          </div>

          {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">{error}</div>}
          {success && <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-xl text-sm border border-green-100">{success}</div>}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-32 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-gray-400 mb-4 flex justify-center"><Users size={48} /></div>
              <p className="text-gray-600 text-lg font-medium">No chapters created yet.</p>
              <button onClick={handleAddNew} className="text-blue-600 font-bold hover:underline mt-2">Create your first chapter</button>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-100 rounded-2xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 uppercase text-[10px] font-bold tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 text-left">Chapter Info</th>
                    <th className="px-6 py-4 text-left">President</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {chapters.map((ch) => (
                    <tr key={ch.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center font-bold mr-3">
                            {ch.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{ch.name}</div>
                            <div className="text-xs text-gray-500 font-mono">/{ch.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {ch.chair_name || <span className="text-gray-300">Not set</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                          ch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {ch.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleEdit(ch.id!)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ch.id!)}
                          className="text-red-600 hover:text-red-800 font-bold text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Form View */}
      {view === 'form' && (
        <div className="p-8">
          <div className="flex justify-between items-center mb-10 pb-4 border-b">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('list')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedId === 'new' ? 'Create New Chapter' : `Edit Chapter: ${formData.name}`}
              </h2>
            </div>
          </div>

          <div className="space-y-12 max-w-5xl mx-auto">
            {/* SECTION 1: Basic Info */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                Basic Chapter Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Chapter Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    placeholder="e.g. Software Chapter"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Slug / URL Identifier</label>
                  <input
                    type="text" name="slug" value={formData.slug} onChange={handleChange}
                    className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    placeholder="e.g. software-chapter"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">Short Summary</label>
                <textarea
                  name="summary" value={formData.summary} onChange={handleChange} rows={2}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-4">About the Chapter (Detailed)</label>
                <div className="bg-white rounded-xl border border-slate-300 overflow-hidden">
                  <ReactQuill theme="snow" value={formData.about_chapter || ''} onChange={handleQuillChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">Banner Image</label>
                  <div className="flex items-center space-x-6 bg-white p-6 rounded-2xl border border-slate-300">
                    <div className="w-32 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      {formData.banner_image_url ? (
                        <img src={`${apiUrl}${formData.banner_image_url}`} alt="Banner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={24} /></div>
                      )}
                    </div>
                    <input
                      type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_image_url')}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Chapter Status</label>
                  <select
                    name="status" value={formData.status} onChange={handleChange}
                    className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: President's Message */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                Chapter President's Message
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">President Name</label>
                  <input
                    type="text" name="chair_name" value={formData.chair_name} onChange={handleChange}
                    className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    placeholder="e.g. Mr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">President Designation</label>
                  <input
                    type="text" name="chair_title" value={formData.chair_title} onChange={handleChange}
                    className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    placeholder="e.g. President - Software Chapter"
                  />
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2">President's Message</label>
                <textarea
                  name="chair_message" value={formData.chair_message || ''} onChange={handleChange} rows={5}
                  className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                  placeholder="Enter the official message from the Chapter President..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-4">President's Image</label>
                  <div className="flex items-center space-x-6 bg-white p-6 rounded-2xl border border-slate-300">
                    <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden border border-slate-200 flex-shrink-0">
                      {formData.chair_image_url ? (
                        <img src={`${apiUrl}${formData.chair_image_url}`} alt="President" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform"><UserSquare size={32} /></div>
                      )}
                    </div>
                    <input
                      type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'chair_image_url')}
                      className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Email</label>
                    <input
                      type="email" name="contact_email" value={formData.contact_email} onChange={handleChange}
                      className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact Phone</label>
                    <input
                      type="text" name="contact_phone" value={formData.contact_phone} onChange={handleChange}
                      className="w-full border-slate-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: Executive Committee */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Executive Committee (Optional)
                </h3>

                <label className="flex items-center cursor-pointer group">
                  <span className="mr-3 text-sm font-bold text-slate-600 group-hover:text-blue-600 transition-colors">Enable Section</span>
                  <div className="relative">
                    <input type="checkbox" name="has_committee" className="sr-only" checked={formData.has_committee} onChange={handleChange} />
                    <div className={cn("block w-14 h-8 rounded-full transition-colors", formData.has_committee ? "bg-blue-600" : "bg-slate-300")}></div>
                    <div className={cn("absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform", formData.has_committee && "translate-x-6")}></div>
                  </div>
                </label>
              </div>

              {formData.has_committee && (
                <div className="space-y-8">
                  {formData.committee.map((member, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative group">
                      <button
                        type="button"
                        onClick={() => removeCommitteeMember(idx)}
                        className="absolute top-6 right-6 text-slate-400 hover:text-red-500 p-2 transition-colors"
                      >
                        <X size={20} />
                      </button>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Full Name</label>
                          <input type="text" value={member.name} onChange={(e) => handleCommitteeChange(idx, 'name', e.target.value)} required className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Designation</label>
                          <input type="text" value={member.designation} onChange={(e) => handleCommitteeChange(idx, 'designation', e.target.value)} className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Company</label>
                          <input type="text" value={member.company} onChange={(e) => handleCommitteeChange(idx, 'company', e.target.value)} className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">LinkedIn URL</label>
                          <input type="url" value={member.linkedin_url} onChange={(e) => handleCommitteeChange(idx, 'linkedin_url', e.target.value)} className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Display Order</label>
                          <input type="number" value={member.display_order} onChange={(e) => handleCommitteeChange(idx, 'display_order', parseInt(e.target.value, 10))} className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Role Label</label>
                          <input type="text" value={member.role_label} onChange={(e) => handleCommitteeChange(idx, 'role_label', e.target.value)} className="w-full border-slate-200 rounded-xl p-3 text-sm bg-slate-50 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. EXCO Member" />
                        </div>
                      </div>

                      <div className="flex items-center space-x-8">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                          {member.image_url ? (
                            <img src={`${apiUrl}${member.image_url}`} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>
                          )}
                        </div>
                        <input
                          type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url', idx)}
                          className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-600 hover:file:bg-slate-200"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCommitteeMember}
                    className="w-full py-5 border-2 border-dashed border-slate-300 rounded-3xl text-slate-500 font-bold hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-3"
                  >
                    <Users size={20} />
                    Add Committee Member
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end items-center gap-4 pt-10 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-8 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !formData.name}
                className="px-10 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Chapter Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { AdminChapters };
