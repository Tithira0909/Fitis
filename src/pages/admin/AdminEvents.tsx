import React from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';

export const AdminEvents: React.FC = () => {
  const columns: ColumnDef[] = [
    {
      key: 'flyer_image_url',
      label: 'Flyer',
      render: (val) => val ? <img src={val} alt="flyer" className="w-16 h-16 object-cover rounded" /> : 'No image'
    },
    { key: 'title', label: 'Event Title' },
    { key: 'event_date', label: 'Date', render: (val) => new Date(val).toLocaleDateString() },
    { key: 'venue', label: 'Venue' },
    {
      key: 'rsvp_open',
      label: 'RSVP Status',
      render: (val) => val ? <span className="text-green-600 font-bold">Open</span> : <span className="text-red-600 font-bold">Closed</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => val === 'published' ? <span className="text-green-600 font-bold uppercase">{val}</span> : <span className="text-gray-500 uppercase">{val}</span>
    },
  ];

  const fields: FieldDef[] = [
    { name: 'title', label: 'Event Title', type: 'text', required: true },
    { name: 'flyer_image_url', label: 'Flyer Image', type: 'image', required: true, uploadUrl: '/api/admin/upload/event-flyer' },
    { name: 'venue', label: 'Venue', type: 'text', required: true },
    { name: 'event_date', label: 'Date', type: 'date', required: true },
    { name: 'start_time', label: 'Start Time', type: 'time', required: true },
    { name: 'end_time', label: 'End Time', type: 'time', required: true },
    { name: 'timezone', label: 'Timezone', type: 'text' },
    { name: 'rsvp_open', label: 'RSVP Open', type: 'checkbox' },
    { name: 'short_description', label: 'Short Description', type: 'textarea' },
    { name: 'details_url', label: 'Details Link', type: 'text', required: true },
    { name: 'facebook_url', label: 'Facebook URL', type: 'text' },
    { name: 'twitter_url', label: 'Twitter URL', type: 'text' },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
    { name: 'status', label: 'Status', type: 'select', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] },
  ];

  return <GenericAdminCrud title="Manage Events" tableName="events" columns={columns} fields={fields} />;
};
