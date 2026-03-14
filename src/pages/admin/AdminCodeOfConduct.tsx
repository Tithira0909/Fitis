import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CodeOfConductSection {
  id?: number;
  section_slug: string;
  section_title: string;
  section_html: string;
  sort_order: number;
}

interface CodeOfConductData {
  page_title: string;
  last_updated: string;
  status: 'Draft' | 'Published';
  sections: CodeOfConductSection[];
}

export const AdminCodeOfConduct = () => {
  const [data, setData] = useState<CodeOfConductData>({
    page_title: 'CODE OF ETHICS AND PROFESSIONAL CONDUCT',
    last_updated: new Date().toISOString().split('T')[0],
    status: 'Draft',
    sections: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/admin/code-of-conduct`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch code of conduct data');
      }

      const result = await response.json();

      // Format date for input type="date"
      let formattedDate = result.last_updated;
      if (formattedDate) {
         formattedDate = new Date(formattedDate).toISOString().split('T')[0];
      }

      setData({
        page_title: result.page_title || 'CODE OF ETHICS AND PROFESSIONAL CONDUCT',
        last_updated: formattedDate || new Date().toISOString().split('T')[0],
        status: result.status || 'Draft',
        sections: result.sections || [],
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${baseUrl}/api/admin/code-of-conduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save code of conduct');
      }

      setSuccess('Code of conduct saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const addSection = () => {
    setData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          section_title: '',
          section_slug: '',
          section_html: '',
          sort_order: prev.sections.length
        }
      ]
    }));
  };

  const removeSection = (index: number) => {
    setData(prev => {
      const newSections = [...prev.sections];
      newSections.splice(index, 1);
      // Update sort orders
      return {
        ...prev,
        sections: newSections.map((s, i) => ({ ...s, sort_order: i }))
      };
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) ||
        (direction === 'down' && index === data.sections.length - 1)) {
      return;
    }

    setData(prev => {
      const newSections = [...prev.sections];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;

      // Swap
      const temp = newSections[index];
      newSections[index] = newSections[targetIndex];
      newSections[targetIndex] = temp;

      // Update sort orders
      return {
        ...prev,
        sections: newSections.map((s, i) => ({ ...s, sort_order: i }))
      };
    });
  };

  const updateSection = (index: number, field: keyof CodeOfConductSection, value: string) => {
    setData(prev => {
      const newSections = [...prev.sections];
      newSections[index] = { ...newSections[index], [field]: value };

      // Auto-generate slug if title changes and slug is empty or matches old title
      if (field === 'section_title') {
         newSections[index].section_slug = generateSlug(value);
      }

      return { ...prev, sections: newSections };
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Code of Conduct Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-fitis-blue text-white px-6 py-2 rounded-lg hover:bg-fitis-blue-light disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Page Configuration</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={data.page_title}
                onChange={(e) => setData({ ...data, page_title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated Date
              </label>
              <input
                type="date"
                value={data.last_updated}
                onChange={(e) => setData({ ...data, last_updated: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as 'Draft' | 'Published' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Sections</h2>
          <button
            onClick={addSection}
            className="flex items-center gap-2 text-sm text-fitis-blue font-medium hover:text-fitis-blue-light"
          >
            <Plus size={16} /> Add Section
          </button>
        </div>

        <div className="p-6 space-y-6">
          {data.sections.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No sections added yet. Click 'Add Section' to start.</p>
          ) : (
            data.sections.map((section, index) => (
              <div key={index} className="border border-gray-200 rounded-xl p-6 relative group bg-gray-50/30">
                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => moveSection(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-fitis-blue hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Up"
                  >
                    <ArrowUp size={18} />
                  </button>
                  <button
                    onClick={() => moveSection(index, 'down')}
                    disabled={index === data.sections.length - 1}
                    className="p-1 text-gray-500 hover:text-fitis-blue hover:bg-blue-50 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                    title="Move Down"
                  >
                    <ArrowDown size={18} />
                  </button>
                  <button
                    onClick={() => removeSection(index)}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded ml-2"
                    title="Remove Section"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-32">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.section_title}
                      onChange={(e) => updateSection(index, 'section_title', e.target.value)}
                      placeholder="e.g. 1. ADOPTION, SCOPE AND APPLICATION"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-fitis-blue focus:border-fitis-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                      Section ID / Slug (Auto)
                    </label>
                    <input
                      type="text"
                      value={section.section_slug}
                      onChange={(e) => updateSection(index, 'section_slug', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-fitis-blue focus:border-fitis-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    Content (HTML supported)
                  </label>
                  <textarea
                    value={section.section_html}
                    onChange={(e) => updateSection(index, 'section_html', e.target.value)}
                    rows={6}
                    placeholder="<p>Enter section content here...</p>"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-fitis-blue focus:border-fitis-blue font-mono text-sm"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
