import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminNews: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'title', label: 'Title' },
    { key: 'created_at', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'author', label: 'Author' },
  ];

  const fields: FieldDef[] = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true },
    { name: 'author', label: 'Author', type: 'text', required: true },
  ];

  return <GenericAdminCrud title="Manage News" tableName="news" columns={columns} fields={fields} />;
};
