import React, { useState, useEffect } from 'react';
import { GenericAdminCrud, ColumnDef, FieldDef } from '../../components/admin/GenericAdminCrud';
import { getImageUrl } from '../../utils/getImageUrl';

const BENEFIT_CATEGORIES = [
  'Accommodation & Travel',
  'Bridal & Gifts',
  'Electronics & Household',
  'Fashion',
  'Fitness and Wellbeing',
  'Food & Beverages',
  'Grooming & Personal Care',
  'Healthcare',
  'Insurance & Car Care',
  'Shopping',
  'Other'
];

export const AdminMemberBenefits: React.FC = () => {
  const columns: ColumnDef[] = [
    { key: 'category', label: 'Category' },
    { key: 'benefit_title', label: 'Benefit' },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${val === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {val}
        </span>
      )
    },
    { key: 'sort_order', label: 'Sort' }
  ];

  const fields: FieldDef[] = [
    { name: 'category', label: 'Category', type: 'text', required: true },
    { name: 'benefit_title', label: 'Benefit Text', type: 'text', required: true },
    { name: 'sort_order', label: 'Sort Order', type: 'number' },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
      ]
    }
  ];

  return (
    <GenericAdminCrud
      title="Member Benefits"
      tableName="member-benefits"
      columns={columns}
      fields={fields}
    />
  );
};
