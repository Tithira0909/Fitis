import React from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';

export const CodeOfConduct = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Code of Conduct' }]}
        title="CODE OF CONDUCT"
        showSearch={false}
      />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Code of Conduct</h2>
          <p className="text-slate-600 leading-relaxed text-lg text-justify">
            This is a placeholder page for the Code of Conduct.
          </p>
        </div>
      </section>
    </div>
  );
};
