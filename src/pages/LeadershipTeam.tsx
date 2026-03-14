import React from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';

export const LeadershipTeam = () => {
  return (
    <div className="bg-white min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Leadership Team' }]}
        title="LEADERSHIP TEAM"
        showSearch={false}
      />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Leadership Team</h2>
          <p className="text-slate-600 leading-relaxed text-lg">
            This is a placeholder page for the Leadership Team.
          </p>
        </div>
      </section>
    </div>
  );
};
