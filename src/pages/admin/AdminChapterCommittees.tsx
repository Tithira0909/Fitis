import React, { useState, useEffect } from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';
import { fetchApi } from '../../lib/api';
import { getImageUrl } from '../../utils/getImageUrl';

export const AdminChapterCommittees: React.FC = () => {
  const [chapters, setChapters] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const data = await fetchApi('/api/chapters?status=published'); // or draft
        setChapters(data);
      } catch (error) {
        console.error('Failed to load chapters for dropdown', error);
      }
    };
    loadChapters();
  }, []);

  const columns: ColumnDef[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'chapter_id',
      label: 'Chapter',
      render: (val) => chapters.find(c => c.id === val)?.name || val
    },
    { key: 'designation', label: 'Designation' },
    { key: 'role_label', label: 'Role Label' },
    { key: 'sort_order', label: 'Sort Order' },
  ];

  const fields: FieldDef[] = [
    {
      name: 'chapter_id',
      label: 'Chapter',
      type: 'select',
      required: true,
      options: chapters.map(c => ({ value: String(c.id), label: c.name }))
    },
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'company', label: 'Company', type: 'text' },
    { name: 'role_label', label: 'Role Label (e.g., President, VP)', type: 'text' },
    { name: 'image_url', label: 'Photo', type: 'image', uploadUrl: '/api/admin/upload/chapter-committee-photo' },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
    { name: 'hierarchy_level', label: 'Hierarchy Level (0=Top, 1=Lower)', type: 'number' },
    { name: 'seat', label: 'Seat (Column position)', type: 'number' },
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
  ];

  return (
    <GenericAdminCrud
      title="Manage Chapter Committees"
      tableName="chapter_committee_members"
      columns={columns}
      fields={fields}
    />
  );
};
