import React from 'react';
import { PolicyLayout } from '../components/PolicyLayout';
import { codeOfEthicsData } from '../data/codeOfEthics';

export const CodeOfEthics = () => {
  return (
    <PolicyLayout
      title="Code of Ethics and Professional Conduct"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
      lastUpdated="01-June-2021"
      sections={codeOfEthicsData}
    />
  );
};
