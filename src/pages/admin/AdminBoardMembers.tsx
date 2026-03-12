import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminBoardMembers: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'name', label: 'Name' },
    { key: 'position', label: 'Position' },
    { key: 'company', label: 'Company' },
  ];

  const fields: FieldDef[] = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'company', label: 'Company', type: 'text', required: true },
  ];

  return <GenericAdminCrud title="Manage Board Members" tableName="board_members" columns={columns} fields={fields} />;
};
