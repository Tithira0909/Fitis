import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminNewsletterPublications: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'title', label: 'Title' },
    { key: 'published_date', label: 'Published Date', render: (val) => val ? new Date(val).toLocaleDateString() : '-' },
    { 
      key: 'status', 
      label: 'Status',
      render: (val) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${val === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {val?.toUpperCase()}
        </span>
      )
    },
  ];

  const fields: FieldDef[] = [
    { name: 'title', label: 'Newsletter Title', type: 'text', required: true },
    { 
      name: 'pdf_url', 
      label: 'Newsletter PDF', 
      type: 'file', 
      accept: 'application/pdf', 
      uploadUrl: '/api/admin/upload/newsletter-pdf', 
      required: true 
    },
    { 
      name: 'cover_image_url', 
      label: 'Cover Image Thumbnail', 
      type: 'image', 
      uploadUrl: '/api/admin/upload/newsletter-cover', 
      required: true 
    },
    { name: 'published_date', label: 'Publish Date', type: 'date', required: true },
    { 
      name: 'status', 
      label: 'Status', 
      type: 'select', 
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' }
      ],
      required: true
    },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
  ];

  return <GenericAdminCrud title="Manage Newsletter Publications" tableName="newsletters" columns={columns} fields={fields} />;
};
