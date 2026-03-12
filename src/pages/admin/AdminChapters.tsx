import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminChapters: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'name', label: 'Chapter Name' },
    { key: 'head', label: 'Head' },
    { key: 'member_count', label: 'Members' },
  ];

  const fields: FieldDef[] = [
    { name: 'name', label: 'Chapter Name', type: 'text', required: true },
    { name: 'head', label: 'Chapter Head', type: 'text', required: true },
    { name: 'member_count', label: 'Member Count', type: 'number' },
  ];

  return <GenericAdminCrud title="Manage Chapters" tableName="chapters" columns={columns} fields={fields} />;
};
