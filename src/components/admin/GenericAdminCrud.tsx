import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../lib/api';
import { Trash2, Edit } from 'lucide-react';
import { getImageUrl } from '../../utils/getImageUrl';

export interface ColumnDef {
  key: string;
  label: string;
  render?: (value: any, item?: any) => React.ReactNode;
}

export interface FieldDef {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number' | 'email' | 'checkbox' | 'image' | 'time' | 'file';
  options?: { value: string; label: string }[];
  required?: boolean;
  uploadUrl?: string; // e.g. /api/admin/upload/event-flyer
  accept?: string;
}

interface GenericAdminCrudProps {
  title: string;
  tableName: string;
  columns: ColumnDef[];
  fields: FieldDef[];
}

export const GenericAdminCrud: React.FC<GenericAdminCrudProps> = ({ title, tableName, columns, fields }) => {
  const [data, setData] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadData();
  }, [tableName]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      const result = await fetchApi(`/api/admin/${tableName}`);
      setData(result);
    } catch (error) {
      showToast('Failed to load data', 'error');
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await fetchApi(`/api/admin/${tableName}/${id}`, { method: 'DELETE' });
      showToast('Item deleted successfully', 'success');
      loadData();
    } catch (error) {
      showToast('Failed to delete item', 'error');
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingItem(item);
      // Format dates for input type="date"
      const initialData = { ...item };
      fields.forEach(f => {
        if (f.type === 'date' && initialData[f.name]) {
            initialData[f.name] = new Date(initialData[f.name]).toISOString().split('T')[0];
        }
      });
      setFormData(initialData);
    } else {
      setEditingItem(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, uploadUrl: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const fullUrl = uploadUrl.startsWith('http') ? uploadUrl : `${baseUrl}${uploadUrl}`;
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      setFormData(prev => ({ ...prev, [fieldName]: data.url }));
      showToast('Image uploaded successfully', 'success');
    } catch (error) {
      showToast('Failed to upload image', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await fetchApi(`/api/admin/${tableName}/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        showToast('Item updated successfully', 'success');
      } else {
        await fetchApi(`/api/admin/${tableName}`, {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        showToast('Item created successfully', 'success');
      }
      setIsModalOpen(false);
      loadData();
    } catch (error) {
       showToast((error as Error).message || 'Failed to save item', 'error');
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} z-50 transition-opacity`}>
          {toast.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Add New
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={item.id || idx}>
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                     {col.render ? col.render(item[col.key]) : item[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center">
                    <Edit size={16} className="mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 inline-flex items-center">
                    <Trash2 size={16} className="mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
                <tr>
                    <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-gray-500">No data found</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-40">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
            <form onSubmit={handleSubmit}>
              {fields.map(field => (
                <div key={field.name} className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={field.required}
                      rows={3}
                    />
                  ) : field.type === 'select' ? (
                    <select
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={field.required}
                    >
                      <option value="">Select an option</option>
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name={field.name}
                        checked={formData[field.name] ? true : false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">Enabled / Open</span>
                    </div>
                  ) : field.type === 'image' ? (
                    <div className="space-y-2">
                      {formData[field.name] && (
                        <img src={getImageUrl(formData[field.name])} alt="Preview" className="w-32 h-32 object-cover border rounded" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.uploadUrl && handleImageUpload(e, field.name, field.uploadUrl)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={field.required && !formData[field.name]}
                      />
                    </div>
                  ) : field.type === 'file' ? (
                    <div className="space-y-2">
                       {formData[field.name] && (
                        <a href={getImageUrl(formData[field.name])} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm font-medium hover:text-blue-800">
                          View Current File
                        </a>
                      )}
                      <input
                        type="file"
                        accept={field.accept || "*/*"}
                        onChange={(e) => field.uploadUrl && handleImageUpload(e, field.name, field.uploadUrl)}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required={field.required && !formData[field.name]}
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ''}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required={field.required}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
