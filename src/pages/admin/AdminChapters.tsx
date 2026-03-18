import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Save, X, ImageIcon, Upload, Users } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${import.meta.env.VITE_API_URL}${url}`;
};

interface CommitteeMember {
  id?: number;
  name: string;
  designation: string;
  company: string;
  role_badge: string;
  photo_url: string;
  linkedin_url: string;
  sort_order: number;
}

interface Chapter {
  id?: number;
  name: string;
  slug: string;
  icon_name: string;
  icon_url: string;
  banner_image_url: string;
  summary: string;
  objectives_json: string;
  description_html: string;
  about_html: string;
  chair_name: string;
  chair_title: string;
  contact_email: string;
  contact_phone: string;
  chairman_name: string;
  chairman_designation: string;
  chairman_message_html: string;
  chairman_photo_url: string;
  has_committee: boolean;
  sort_order: number;
  status: string;
  committee?: CommitteeMember[];
}

export const AdminChapters: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<Partial<Chapter>>({});
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/custom-chapters`, {
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

  useEffect(() => {
    fetchChapters();
  }, []);

  const handleEdit = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/custom-chapters/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch chapter details');
      const data = await res.json();
      // Ensure has_committee is a boolean
      data.has_committee = Boolean(data.has_committee);
      if (!data.committee) data.committee = [];
      setCurrentChapter(data);
      setIsEditing(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/custom-chapters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete chapter');
      fetchChapters();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateNew = () => {
    setCurrentChapter({
      status: 'published',
      sort_order: 0,
      has_committee: false,
      committee: []
    });
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, memberIndex?: number) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    let uploadUrl = '/api/admin/upload/chapter-icon';
    if (fieldName === 'banner_image_url') uploadUrl = '/api/admin/upload/chapter-banner';
    else if (fieldName === 'committee_photo') uploadUrl = '/api/admin/upload/committee-photo';
    else if (fieldName === 'chairman_photo_url') uploadUrl = '/api/admin/upload/chairman-photo';

    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`${import.meta.env.VITE_API_URL}${uploadUrl}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      if (memberIndex !== undefined) {
         const newCommittee = [...(currentChapter.committee || [])];
         newCommittee[memberIndex].photo_url = data.url;
         setCurrentChapter({ ...currentChapter, committee: newCommittee });
      } else {
         setCurrentChapter({ ...currentChapter, [fieldName]: data.url });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const isNew = !currentChapter.id;
      const url = isNew
        ? `${import.meta.env.VITE_API_URL}/api/admin/custom-chapters`
        : `${import.meta.env.VITE_API_URL}/api/admin/custom-chapters/${currentChapter.id}`;

      const method = isNew ? 'POST' : 'PUT';

      const payload = { ...currentChapter };
      payload.has_committee = payload.has_committee ? 1 : 0 as any;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Save failed');
      }

      setIsEditing(false);
      fetchChapters();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const addCommitteeMember = () => {
    const newMember: CommitteeMember = {
      name: '',
      designation: '',
      company: '',
      role_badge: '',
      photo_url: '',
      linkedin_url: '',
      sort_order: (currentChapter.committee?.length || 0)
    };
    setCurrentChapter({
      ...currentChapter,
      committee: [...(currentChapter.committee || []), newMember]
    });
  };

  const updateCommitteeMember = (index: number, field: string, value: any) => {
    const newCommittee = [...(currentChapter.committee || [])];
    newCommittee[index] = { ...newCommittee[index], [field]: value };
    setCurrentChapter({ ...currentChapter, committee: newCommittee });
  };

  const removeCommitteeMember = (index: number) => {
    const newCommittee = [...(currentChapter.committee || [])];
    newCommittee.splice(index, 1);
    setCurrentChapter({ ...currentChapter, committee: newCommittee });
  };

  if (loading && !isEditing) return <div className="p-8 text-center text-slate-500">Loading chapters...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manage Chapters</h1>
        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-fitis-blue text-white rounded hover:bg-fitis-blue-light transition-colors"
          >
            <Plus size={20} /> Add Chapter
          </button>
        )}
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}

      {!isEditing ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Chapter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Sort Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {chapters.map((chapter) => (
                <tr key={chapter.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {chapter.icon_url ? (
                        <img src={getImageUrl(chapter.icon_url)} alt="icon" className="w-10 h-10 object-contain" />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 flex items-center justify-center text-xs text-slate-500">No Icon</div>
                      )}
                      <div>
                        <div className="font-medium text-slate-900">{chapter.name}</div>
                        <div className="text-xs text-slate-500">{chapter.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${chapter.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {chapter.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{chapter.sort_order}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEdit(chapter.id!)} className="text-blue-600 hover:text-blue-800 mr-3">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(chapter.id!)} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No chapters found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-8 bg-slate-50 p-6 rounded-lg border border-slate-200">

          <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200 sticky top-0 z-10">
             <h2 className="text-xl font-bold text-slate-800">{currentChapter.id ? 'Edit Chapter' : 'Add New Chapter'}</h2>
             <div className="flex gap-3">
               <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50">
                 Cancel
               </button>
               <button type="submit" className="px-4 py-2 bg-fitis-blue text-white rounded hover:bg-fitis-blue-light flex items-center gap-2 shadow">
                 <Save size={18} /> Save Chapter
               </button>
             </div>
          </div>

          {/* BASIC INFO SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-slate-800">1. Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Name *</label>
                <input required type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.name || ''} onChange={e => setCurrentChapter({...currentChapter, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug (auto-generated if empty)</label>
                <input type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.slug || ''} onChange={e => setCurrentChapter({...currentChapter, slug: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Summary</label>
                <textarea className="w-full p-2 border border-slate-300 rounded h-24 focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.summary || ''} onChange={e => setCurrentChapter({...currentChapter, summary: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.status || 'published'} onChange={e => setCurrentChapter({...currentChapter, status: e.target.value})}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <label className="block text-sm font-medium text-slate-700 mt-4 mb-1">Sort Order</label>
                <input type="number" className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.sort_order || 0} onChange={e => setCurrentChapter({...currentChapter, sort_order: parseInt(e.target.value)})} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chapter Icon</label>
                  <div className="flex items-center gap-4">
                    {currentChapter.icon_url && <img src={getImageUrl(currentChapter.icon_url)} alt="icon" className="w-16 h-16 object-contain border p-1 rounded" />}
                    <label className="cursor-pointer bg-slate-50 border border-slate-300 px-4 py-2 rounded text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                      Upload Icon
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'icon_url')} className="hidden" />
                    </label>
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Banner/Hero Image (Optional)</label>
                  <div className="flex items-center gap-4">
                    {currentChapter.banner_image_url && <img src={getImageUrl(currentChapter.banner_image_url)} alt="banner" className="w-32 h-16 object-cover border p-1 rounded" />}
                    <label className="cursor-pointer bg-slate-50 border border-slate-300 px-4 py-2 rounded text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                      Upload Banner
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'banner_image_url')} className="hidden" />
                    </label>
                  </div>
               </div>
            </div>
          </div>

          {/* ABOUT SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-slate-800">2. About Chapter</h3>
            <div className="mb-6">
               <label className="block text-sm font-medium text-slate-700 mb-2">About Content</label>
               <div className="h-64 mb-12">
                 <ReactQuill theme="snow" value={currentChapter.about_html || currentChapter.description_html || ''} onChange={(val) => setCurrentChapter({...currentChapter, about_html: val})} className="h-full" />
               </div>
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-2">Objectives (JSON Array format: ["Obj 1", "Obj 2"])</label>
               <textarea className="w-full p-3 border border-slate-300 rounded h-24 font-mono text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.objectives_json || ''} onChange={e => setCurrentChapter({...currentChapter, objectives_json: e.target.value})} placeholder='["To promote ICT", "To support industry"]' />
            </div>
          </div>

          {/* CHAIRMAN SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold border-b pb-2 mb-4 text-slate-800">3. Chairman / Chapter Head Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chairman Name</label>
                <input type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.chairman_name || currentChapter.chair_name || ''} onChange={e => setCurrentChapter({...currentChapter, chairman_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chairman Designation</label>
                <input type="text" className="w-full p-2 border border-slate-300 rounded focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={currentChapter.chairman_designation || currentChapter.chair_title || ''} onChange={e => setCurrentChapter({...currentChapter, chairman_designation: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Chairman Photo</label>
                 <div className="flex items-center gap-4">
                    {currentChapter.chairman_photo_url ? (
                      <img src={getImageUrl(currentChapter.chairman_photo_url)} alt="chairman" className="w-20 h-20 object-cover border-2 border-slate-200 rounded-full shadow-sm" />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200"><ImageIcon size={24} /></div>
                    )}
                    <label className="cursor-pointer bg-slate-50 border border-slate-300 px-4 py-2 rounded text-sm text-slate-700 hover:bg-slate-100 transition-colors">
                      Upload Photo
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'chairman_photo_url')} className="hidden" />
                    </label>
                  </div>
              </div>
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-slate-700 mb-2">Chairman Message</label>
                 <div className="h-48 mb-12">
                   <ReactQuill theme="snow" value={currentChapter.chairman_message_html || ''} onChange={(val) => setCurrentChapter({...currentChapter, chairman_message_html: val})} className="h-full" />
                 </div>
              </div>
            </div>
          </div>

          {/* COMMITTEE SECTION */}
          <div className="bg-white p-6 rounded-lg shadow-sm border-2 border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 mb-6 gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800"><Users size={20} className="text-fitis-blue" /> 4. Executive Committee (Optional)</h3>
              <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors shadow-sm">
                <input
                  type="checkbox"
                  checked={currentChapter.has_committee || false}
                  onChange={(e) => setCurrentChapter({...currentChapter, has_committee: e.target.checked})}
                  className="w-5 h-5 text-fitis-blue rounded border-gray-300 focus:ring-fitis-blue"
                />
                <span className="text-sm font-bold text-slate-700 select-none">Enable Committee Section</span>
              </label>
            </div>

            {currentChapter.has_committee ? (
              <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                <div className="space-y-4">
                  {currentChapter.committee?.map((member, index) => (
                    <div key={index} className="flex flex-col md:flex-row gap-5 p-5 border border-slate-200 rounded-xl bg-white relative shadow-sm hover:shadow-md transition-shadow">
                      <button type="button" onClick={() => removeCommitteeMember(index)} className="absolute top-3 right-3 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-full p-1.5 transition-colors" title="Remove Member">
                        <X size={16} />
                      </button>

                      <div className="flex-shrink-0 flex flex-col items-center gap-3 pt-2">
                        {member.photo_url ? (
                           <img src={getImageUrl(member.photo_url)} alt="member" className="w-20 h-20 object-cover rounded-full border-4 border-slate-50 shadow-sm" />
                        ) : (
                           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-4 border-slate-50 shadow-sm"><ImageIcon size={28} /></div>
                        )}
                        <label className="text-xs font-semibold text-fitis-blue cursor-pointer hover:underline text-center bg-blue-50 px-3 py-1 rounded-full">
                          Upload Photo
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'committee_photo', index)} />
                        </label>
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pr-8">
                        <div className="col-span-1 md:col-span-2 lg:col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Name *</label>
                          <input type="text" required className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.name} onChange={e => updateCommitteeMember(index, 'name', e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Designation</label>
                          <input type="text" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.designation} onChange={e => updateCommitteeMember(index, 'designation', e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Company / Org</label>
                          <input type="text" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.company} onChange={e => updateCommitteeMember(index, 'company', e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Role Label (e.g. Member)</label>
                          <input type="text" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.role_badge} onChange={e => updateCommitteeMember(index, 'role_badge', e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">LinkedIn URL</label>
                          <input type="url" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.linkedin_url} onChange={e => updateCommitteeMember(index, 'linkedin_url', e.target.value)} />
                        </div>
                        <div className="col-span-1">
                          <label className="block text-xs font-medium text-slate-500 mb-1">Sort Order</label>
                          <input type="number" className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-fitis-blue focus:border-fitis-blue outline-none" value={member.sort_order} onChange={e => updateCommitteeMember(index, 'sort_order', parseInt(e.target.value))} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentChapter.committee?.length === 0 && (
                     <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
                        No committee members added yet. Click the button below to add one.
                     </div>
                  )}
                </div>
                <button type="button" onClick={addCommitteeMember} className="mt-6 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 text-slate-600 font-medium rounded-xl hover:bg-white hover:border-fitis-blue hover:text-fitis-blue transition-colors w-full shadow-sm">
                  <Plus size={20} /> Add Committee Member
                </button>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg border border-slate-200">
                <Users size={32} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-600">Executive Committee section is currently hidden.</p>
                <p className="text-sm mt-1">Toggle the switch above to enable and add members.</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-200">
               <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-white hover:shadow-sm font-bold transition-all">
                 Cancel
               </button>
               <button type="submit" className="px-8 py-3 bg-fitis-blue text-white rounded-lg hover:bg-fitis-blue-light font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5">
                 <Save size={20} /> Save Chapter Details
               </button>
          </div>
        </form>
      )}
    </div>
  );
};
