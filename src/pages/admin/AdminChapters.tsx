import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';
import { getImageUrl } from '../../utils/getImageUrl';

export const AdminChapters: React.FC = () => {
  const columns: ColumnDef[] = [
    {
      key: 'icon_url',
      label: 'Icon',
      render: (val: any, item: any) => (
        val ? (
          <img src={getImageUrl(val)} alt="Icon" className="w-10 h-10 object-contain bg-gray-50 rounded" />
        ) : (
          <div className="w-10 h-10 bg-fitis-blue text-white flex items-center justify-center rounded text-xs">
            {item.icon_name || 'Icon'}
          </div>
        )
      )
    },
    { key: 'name', label: 'Chapter Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${val === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {val}
        </span>
      )
    },
    { key: 'sort_order', label: 'Sort' }
  ];

  const fields: FieldDef[] = [
    { name: 'name', label: 'Chapter Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug (auto-generated if empty)', type: 'text' },
    {
      name: 'icon_name',
      label: 'Icon Name (Fallback/Set)',
      type: 'select',
      options: [
        { value: '', label: 'None' },
        { value: 'Globe', label: 'Globe' },
        { value: 'Monitor', label: 'Monitor / Software' },
        { value: 'GraduationCap', label: 'Graduation Cap' },
        { value: 'Phone', label: 'Phone' },
        { value: 'Settings', label: 'Settings / Gear' },
        { value: 'Archive', label: 'Archive / Cabinet' },
        { value: 'User', label: 'User / Consultant' },
      ]
    },
    {
      name: 'icon_url',
      label: 'Upload Custom Icon (SVG/PNG)',
      type: 'image',
      uploadUrl: '/api/admin/upload/chapter-icon'
    },
    { name: 'summary', label: 'Short Summary', type: 'textarea' },
    { name: 'objectives_json', label: 'Objectives (JSON Array format: ["Obj 1", "Obj 2"])', type: 'textarea' },
    { name: 'description_html', label: 'Full Description (HTML)', type: 'textarea' },
    { name: 'chair_name', label: 'Chair Name', type: 'text' },
    { name: 'chair_title', label: 'Chair Title', type: 'text' },
    { name: 'contact_email', label: 'Contact Email', type: 'email' },
    { name: 'contact_phone', label: 'Contact Phone', type: 'text' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  return <GenericAdminCrud title="Manage Chapters" tableName="chapters" columns={columns} fields={fields} />;
};
