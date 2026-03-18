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
    {
      key: 'logo_url',
      label: 'Logo',
      render: (val: string) => (
        <img src={getImageUrl(val)} alt="Logo" className="w-12 h-12 object-contain bg-gray-50 rounded border" />
      )
    },
    { key: 'brand_name', label: 'Brand Name' },
    { key: 'benefit_title', label: 'Benefit Title' },
    { key: 'category', label: 'Category' },
    { key: 'offer_text', label: 'Offer' },
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
    { name: 'brand_name', label: 'Brand / Partner Name', type: 'text', required: true },
    { name: 'benefit_title', label: 'Benefit Title', type: 'text', required: true },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: BENEFIT_CATEGORIES.map(c => ({ value: c, label: c }))
    },
    { name: 'offer_text', label: 'Offer / Discount Text', type: 'text', required: true },
    { name: 'description', label: 'Short Description', type: 'textarea' },
    { name: 'terms', label: 'Terms & Conditions', type: 'textarea' },
    { name: 'link_url', label: 'Website / Redemption Link', type: 'text' },
    {
      name: 'logo_url',
      label: 'Logo Image',
      type: 'image',
      required: true,
      uploadUrl: '/api/admin/upload/member-benefit-logo'
    },
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
