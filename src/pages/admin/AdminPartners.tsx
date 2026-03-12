import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminPartners: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'company_name', label: 'Company Name' },
    { key: 'tier', label: 'Tier' },
    { key: 'contact_person', label: 'Contact Person' },
  ];

  const fields: FieldDef[] = [
    { name: 'company_name', label: 'Company Name', type: 'text', required: true },
    { name: 'tier', label: 'Tier', type: 'select', options: [
      { value: 'Platinum', label: 'Platinum' },
      { value: 'Gold', label: 'Gold' },
      { value: 'Silver', label: 'Silver' },
      { value: 'Bronze', label: 'Bronze' },
    ], required: true },
    { name: 'contact_person', label: 'Contact Person', type: 'text', required: true },
  ];

  return <GenericAdminCrud title="Manage Partners" tableName="partners" columns={columns} fields={fields} />;
};
