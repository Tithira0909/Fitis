import React from 'react';
import { Link } from 'react-router-dom';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';
import { getImageUrl } from '../../utils/getImageUrl';

export const AdminChapters: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'name', label: 'Chapter Name' },
    { key: 'slug', label: 'Slug' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${val === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {val}
        </span>
      )
    },
    { key: 'sort_order', label: 'Sort Order' },
  ];

  const fields: FieldDef[] = [
    { name: 'name', label: 'Chapter Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug (auto-generated if blank)', type: 'text' },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' }
      ]
    },
    { name: 'about_html', label: 'About HTML', type: 'textarea' },
    { name: 'objectives_json', label: 'Objectives JSON Array (e.g. ["Obj 1", "Obj 2"])', type: 'textarea' },
    { name: 'chairman_name', label: 'Chairman Name', type: 'text' },
    { name: 'chairman_designation', label: 'Chairman Designation', type: 'text' },
    { name: 'chairman_photo_url', label: 'Chairman Photo', type: 'image', uploadUrl: '/api/admin/upload/chapter-chairman-photo' },
    { name: 'chairman_message_html', label: 'Chairman Message HTML', type: 'textarea' },
  ];

  // Using custom wrapper to append the link button manually because GenericAdminCrud doesn't support adding extra action buttons.
  return (
    <div>
      <div className="flex justify-end mb-4 pr-6 pt-6">
        <Link
          to="/admin/chapter-committees"
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition"
        >
          Manage Chapter Committees
        </Link>
      </div>
      <GenericAdminCrud title="Manage Chapters" tableName="chapters" columns={columns} fields={fields} />
    </div>
  );
};
