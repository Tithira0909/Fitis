import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminEvents: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'name', label: 'Event Name' },
    { key: 'event_date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'location', label: 'Location' },
  ];

  const fields: FieldDef[] = [
    { name: 'name', label: 'Event Name', type: 'text', required: true },
    { name: 'event_date', label: 'Date', type: 'date', required: true },
    { name: 'location', label: 'Location', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
  ];

  return <GenericAdminCrud title="Manage Events" tableName="events" columns={columns} fields={fields} />;
};
