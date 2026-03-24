import React, { useEffect, useState } from 'react';
import { fetchApi } from '../../lib/api';

interface Stats {
  totalChapters: number;
  upcomingEvents: number;
  activeMembers: number;
  totalPartners: number;
  recentActivity: { activity: string; date: string; status: string }[];
}

export const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchApi('/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    };
    loadStats();
  }, []);

  if (!stats) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
        <button className="bg-gradient-to-r from-fitis-blue to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all shadow">
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Chapters', value: stats.totalChapters },
          { label: 'Upcoming Events', value: stats.upcomingEvents },
          { label: 'Active Members', value: stats.activeMembers },
          { label: 'Partners', value: stats.totalPartners },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</h3>
            <div className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentActivity.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.activity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{item.status}</td>
                </tr>
              ))}
              {stats.recentActivity.length === 0 && (
                <tr>
                   <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No recent activity</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
