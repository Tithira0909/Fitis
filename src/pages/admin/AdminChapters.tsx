import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { Edit, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface Chapter {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  hero_title: string;
  breadcrumb_title: string;
  member_count: number;
  members_summary_text: string;
  view_all_link: string;
  president_name: string;
  president_designation: string;
  president_company: string;
  president_image_url: string;
  president_message_body: string;
}

interface Objective {
  id?: number;
  chapter_id?: number;
  objective_text: string;
  sort_order: number;
}

interface ExcoMember {
  id?: number;
  chapter_id?: number;
  name: string;
  designation: string;
  company: string;
  role: string;
  image_url: string;
  linkedin_url: string;
  sort_order: number;
  status: string;
}

export const AdminChapters: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'objectives' | 'president' | 'exco' | 'members'>('basic');
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [basicInfo, setBasicInfo] = useState<Partial<Chapter>>({});
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [excoMembers, setExcoMembers] = useState<ExcoMember[]>([]);

  useEffect(() => {
    loadChapters();
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadChapters = async () => {
    try {
      const result = await fetchApi('/api/admin/chapters');
      setChapters(result);
    } catch (error) {
      showToast('Failed to load chapters', 'error');
    }
  };

  const loadChapterDetails = async (id: number) => {
    try {
      const chapter = await fetchApi(`/api/admin/chapters/${id}`);
      setSelectedChapter(chapter);
      setBasicInfo(chapter);

      const objectivesData = await fetchApi(`/api/admin/chapter_objectives`);
      const filteredObj = objectivesData.filter((o: any) => o.chapter_id === id).sort((a: any, b: any) => a.sort_order - b.sort_order);
      setObjectives(filteredObj);

      const excoData = await fetchApi(`/api/admin/chapter_exco_members`);
      const filteredExco = excoData.filter((e: any) => e.chapter_id === id).sort((a: any, b: any) => a.sort_order - b.sort_order);
      setExcoMembers(filteredExco);

    } catch (error) {
      showToast('Failed to load chapter details', 'error');
    }
  };

  const handleCreateOrSelect = (chapter: Chapter | null) => {
    if (chapter) {
      loadChapterDetails(chapter.id);
      setIsCreating(false);
    } else {
      setSelectedChapter(null);
      setBasicInfo({});
      setObjectives([]);
      setExcoMembers([]);
      setIsCreating(true);
    }
    setActiveTab('basic');
  };

  const handleDeleteChapter = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) return;
    try {
      await fetchApi(`/api/admin/chapters/${id}`, { method: 'DELETE' });
      showToast('Chapter deleted successfully', 'success');
      loadChapters();
      if (selectedChapter?.id === id) {
         setSelectedChapter(null);
      }
    } catch (error) {
      showToast('Failed to delete chapter', 'error');
    }
  };

  const saveBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let savedChapter;
      if (isCreating) {
        savedChapter = await fetchApi('/api/admin/chapters', {
          method: 'POST',
          body: JSON.stringify(basicInfo),
        });
        showToast('Chapter created successfully', 'success');
        setIsCreating(false);
        loadChapters();
        loadChapterDetails(savedChapter.id);
      } else {
        savedChapter = await fetchApi(`/api/admin/chapters/${selectedChapter?.id}`, {
          method: 'PUT',
          body: JSON.stringify(basicInfo),
        });
        showToast('Chapter updated successfully', 'success');
        loadChapters();
        setSelectedChapter(savedChapter);
        setBasicInfo(savedChapter);
      }
    } catch (error) {
      showToast((error as Error).message || 'Failed to save chapter', 'error');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleQuillChange = (value: string) => {
     setBasicInfo(prev => ({ ...prev, president_message_body: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/admin/upload/chapter`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setBasicInfo(prev => ({ ...prev, [fieldName]: data.url }));
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload image', 'error');
    }
  };

  if (!selectedChapter && !isCreating) {
    return (
      <div className="space-y-6 relative">
        {toast && (
          <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50`}>
            {toast.message}
          </div>
        )}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Manage Chapters</h1>
          <button
            onClick={() => handleCreateOrSelect(null)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow inline-flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add New Chapter
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chapters.map((chapter) => (
                <tr key={chapter.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{chapter.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chapter.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{chapter.member_count || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleCreateOrSelect(chapter)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center">
                      <Edit size={16} className="mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDeleteChapter(chapter.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                      <Trash2 size={16} className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No chapters found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => { setSelectedChapter(null); setIsCreating(false); }}
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isCreating ? 'Create New Chapter' : `Edit Chapter: ${selectedChapter?.name}`}
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'basic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Info
            </button>
            <button
              disabled={isCreating}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'objectives' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setActiveTab('objectives')}
            >
              Objectives
            </button>
            <button
              disabled={isCreating}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'president' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setActiveTab('president')}
            >
              President Message
            </button>
            <button
              disabled={isCreating}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'exco' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setActiveTab('exco')}
            >
              Executive Committee
            </button>
            <button
              disabled={isCreating}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${activeTab === 'members' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={() => setActiveTab('members')}
            >
              Members Summary
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'basic' && (
            <form onSubmit={saveBasicInfo} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700">Chapter Name *</label>
                <input type="text" name="name" required value={basicInfo.name || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                <input type="text" name="slug" value={basicInfo.slug || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from name.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                <input type="text" name="hero_title" value={basicInfo.hero_title || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Breadcrumb Title</label>
                <input type="text" name="breadcrumb_title" value={basicInfo.breadcrumb_title || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Short Description</label>
                <textarea name="short_description" rows={4} value={basicInfo.short_description || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div className="pt-4 border-t">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                  {isCreating ? 'Create Chapter' : 'Save Basic Info'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'objectives' && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Chapter Objectives</h2>
              {objectives.map((obj, index) => (
                <div key={obj.id || index} className="flex items-start gap-4 p-4 border rounded bg-gray-50">
                  <div className="flex-1">
                    <textarea
                      value={obj.objective_text}
                      onChange={(e) => {
                        const newObjs = [...objectives];
                        newObjs[index].objective_text = e.target.value;
                        setObjectives(newObjs);
                      }}
                      className="w-full border-gray-300 rounded p-2"
                      rows={2}
                      placeholder="Objective text..."
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={obj.sort_order}
                      onChange={(e) => {
                        const newObjs = [...objectives];
                        newObjs[index].sort_order = parseInt(e.target.value) || 0;
                        setObjectives(newObjs);
                      }}
                      className="w-full border-gray-300 rounded p-2"
                      placeholder="Order"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      if (obj.id) {
                         if (!window.confirm('Delete this objective?')) return;
                         try {
                           await fetchApi(`/api/admin/chapter_objectives/${obj.id}`, { method: 'DELETE' });
                           showToast('Objective deleted', 'success');
                           loadChapterDetails(selectedChapter!.id);
                         } catch (e) {
                           showToast('Failed to delete', 'error');
                         }
                      } else {
                         const newObjs = objectives.filter((_, i) => i !== index);
                         setObjectives(newObjs);
                      }
                    }}
                    className="text-red-600 hover:text-red-900 mt-2"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}

              <button
                onClick={() => setObjectives([...objectives, { chapter_id: selectedChapter!.id, objective_text: '', sort_order: objectives.length }])}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border"
              >
                + Add Objective
              </button>

              <div className="pt-4 border-t mt-6">
                <button
                  onClick={async () => {
                     try {
                        for (const obj of objectives) {
                           if (obj.id) {
                              await fetchApi(`/api/admin/chapter_objectives/${obj.id}`, { method: 'PUT', body: JSON.stringify(obj) });
                           } else {
                              await fetchApi(`/api/admin/chapter_objectives`, { method: 'POST', body: JSON.stringify(obj) });
                           }
                        }
                        showToast('Objectives saved', 'success');
                        loadChapterDetails(selectedChapter!.id);
                     } catch (error) {
                        showToast('Failed to save objectives', 'error');
                     }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Save Objectives
                </button>
              </div>
            </div>
          )}

          {activeTab === 'president' && (
            <form onSubmit={saveBasicInfo} className="space-y-4 max-w-2xl">
              <h2 className="text-lg font-medium text-gray-900 mb-4">President Message</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">President Name</label>
                <input type="text" name="president_name" value={basicInfo.president_name || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">President Designation</label>
                <input type="text" name="president_designation" value={basicInfo.president_designation || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">President Company</label>
                <input type="text" name="president_company" value={basicInfo.president_company || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">President Photo</label>
                {basicInfo.president_image_url && (
                  <img src={getImageUrl(basicInfo.president_image_url)} alt="Preview" className="h-32 object-cover rounded mb-2 border" />
                )}
                <input type="file" onChange={(e) => handleImageUpload(e, 'president_image_url')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message Body</label>
                <ReactQuill
                  theme="snow"
                  value={basicInfo.president_message_body || ''}
                  onChange={handleQuillChange}
                  className="h-64 mb-12"
                />
              </div>

              <div className="pt-4 border-t mt-8">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                  Save President Details
                </button>
              </div>
            </form>
          )}

          {activeTab === 'exco' && (
            <div className="space-y-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Executive Committee</h2>
              {excoMembers.map((member, index) => (
                <div key={member.id || index} className="p-4 border rounded bg-gray-50 space-y-4 relative">
                  <button
                    onClick={async () => {
                      if (member.id) {
                         if (!window.confirm('Delete this member?')) return;
                         try {
                           await fetchApi(`/api/admin/chapter_exco_members/${member.id}`, { method: 'DELETE' });
                           showToast('Member deleted', 'success');
                           loadChapterDetails(selectedChapter!.id);
                         } catch (e) {
                           showToast('Failed to delete', 'error');
                         }
                      } else {
                         const newExco = excoMembers.filter((_, i) => i !== index);
                         setExcoMembers(newExco);
                      }
                    }}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={20} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const newExco = [...excoMembers];
                          newExco[index].name = e.target.value;
                          setExcoMembers(newExco);
                        }}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Designation</label>
                      <input
                        type="text"
                        value={member.designation}
                        onChange={(e) => {
                          const newExco = [...excoMembers];
                          newExco[index].designation = e.target.value;
                          setExcoMembers(newExco);
                        }}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={member.company || ''}
                        onChange={(e) => {
                          const newExco = [...excoMembers];
                          newExco[index].company = e.target.value;
                          setExcoMembers(newExco);
                        }}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Committee Role (e.g., President, Member)</label>
                      <input
                        type="text"
                        value={member.role || ''}
                        onChange={(e) => {
                          const newExco = [...excoMembers];
                          newExco[index].role = e.target.value;
                          setExcoMembers(newExco);
                        }}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">LinkedIn URL</label>
                      <input
                        type="text"
                        value={member.linkedin_url || ''}
                        onChange={(e) => {
                          const newExco = [...excoMembers];
                          newExco[index].linkedin_url = e.target.value;
                          setExcoMembers(newExco);
                        }}
                        className="w-full border-gray-300 rounded p-2 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div>
                          <label className="block text-xs font-medium text-gray-700">Sort Order</label>
                          <input
                            type="number"
                            value={member.sort_order}
                            onChange={(e) => {
                              const newExco = [...excoMembers];
                              newExco[index].sort_order = parseInt(e.target.value) || 0;
                              setExcoMembers(newExco);
                            }}
                            className="w-full border-gray-300 rounded p-2 text-sm"
                          />
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-gray-700">Status</label>
                          <select
                            value={member.status}
                            onChange={(e) => {
                              const newExco = [...excoMembers];
                              newExco[index].status = e.target.value;
                              setExcoMembers(newExco);
                            }}
                            className="w-full border-gray-300 rounded p-2 text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                       </div>
                    </div>
                    <div className="md:col-span-2 flex items-center gap-4">
                       {member.image_url && (
                          <img src={getImageUrl(member.image_url)} alt="Preview" className="w-16 h-16 object-cover rounded-full border" />
                       )}
                       <div className="flex-1">
                          <label className="block text-xs font-medium text-gray-700">Member Photo</label>
                          <input
                            type="file"
                            onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               const formDataUpload = new FormData();
                               formDataUpload.append('file', file);
                               try {
                                 const token = localStorage.getItem('adminToken');
                                 const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                                 const res = await fetch(`${baseUrl}/api/admin/upload/chapter`, {
                                   method: 'POST',
                                   headers: { 'Authorization': `Bearer ${token}` },
                                   body: formDataUpload
                                 });
                                 if (!res.ok) throw new Error('Upload failed');
                                 const data = await res.json();
                                 const newExco = [...excoMembers];
                                 newExco[index].image_url = data.url;
                                 setExcoMembers(newExco);
                               } catch (err) {
                                 showToast('Image upload failed', 'error');
                               }
                            }}
                            className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700"
                          />
                       </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => setExcoMembers([...excoMembers, { chapter_id: selectedChapter!.id, name: '', designation: '', company: '', role: '', image_url: '', linkedin_url: '', sort_order: excoMembers.length, status: 'active' }])}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded border"
              >
                + Add Committee Member
              </button>

              <div className="pt-4 border-t mt-6">
                <button
                  onClick={async () => {
                     try {
                        for (const member of excoMembers) {
                           if (member.id) {
                              await fetchApi(`/api/admin/chapter_exco_members/${member.id}`, { method: 'PUT', body: JSON.stringify(member) });
                           } else {
                              await fetchApi(`/api/admin/chapter_exco_members`, { method: 'POST', body: JSON.stringify(member) });
                           }
                        }
                        showToast('Committee members saved', 'success');
                        loadChapterDetails(selectedChapter!.id);
                     } catch (error) {
                        showToast('Failed to save committee members', 'error');
                     }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700"
                >
                  Save Executive Committee
                </button>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
             <form onSubmit={saveBasicInfo} className="space-y-4 max-w-2xl">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Members Section Summary</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Member Count</label>
                <input type="number" name="member_count" value={basicInfo.member_count || 0} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Summary Text</label>
                <textarea name="members_summary_text" rows={3} value={basicInfo.members_summary_text || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">"View All" Button Link (URL Path)</label>
                <input type="text" name="view_all_link" placeholder="/Chapter/chapters/slug/members" value={basicInfo.view_all_link || ''} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div className="pt-4 border-t mt-8">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                  Save Members Summary
                </button>
              </div>
             </form>
          )}
        </div>
      </div>
    </div>
  );
};
