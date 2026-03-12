import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminNewsletter: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'email', label: 'Email' },
    { key: 'subscribed_at', label: 'Subscribed At', render: (val) => new Date(val).toLocaleDateString() },
  ];

  const fields: FieldDef[] = [
    { name: 'email', label: 'Email Address', type: 'email', required: true },
  ];

  return <GenericAdminCrud title="Manage Newsletter Subscribers" tableName="newsletter_subscribers" columns={columns} fields={fields} />;
};
