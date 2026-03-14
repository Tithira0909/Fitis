import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';
import { getImageUrl } from '../../utils/getImageUrl';

export const AdminPrograms: React.FC = () => {
  const columns: ColumnDef[] = [
    {
      key: 'banner_image_url',
      label: 'Banner Image',
      render: (val: string) => (
        <img
          src={getImageUrl(val)}
          alt="Banner"
          className="w-16 h-16 object-cover rounded shadow-sm bg-slate-100"
          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/100/100'; }}
        />
      )
    },
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'sort_order', label: 'Sort Order' }
  ];

  const fields: FieldDef[] = [
    {
      name: 'banner_image_url',
      label: 'Banner Image',
      type: 'image',
      required: true,
      uploadUrl: '/api/admin/upload/program-banner'
    },
    { name: 'title', label: 'Title', type: 'text', required: true },
    {
      name: 'slug',
      label: 'Slug (auto-generated if blank)',
      type: 'text',
      required: false
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true
    },
    {
      name: 'read_more_url',
      label: 'Read More Link',
      type: 'text',
      required: true
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
      ]
    },
    { name: 'sort_order', label: 'Sort Order', type: 'number', required: false }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <GenericAdminCrud
        tableName="programs"
        title="Projects & Programs"
        columns={columns}
        fields={fields}
      />
    </div>
  );
};
