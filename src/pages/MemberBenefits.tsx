import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';
import { ExternalLink, Search } from 'lucide-react';

interface MemberBenefit {
  id: number;
  brand_name: string;
  benefit_title: string;
  category: string;
  offer_text: string;
  description: string;
  terms: string;
  link_url: string;
  logo_url: string;
  sort_order: number;
}

const CATEGORIES = [
  'All',
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

export const MemberBenefits = () => {
  const [benefits, setBenefits] = useState<MemberBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBenefits = async (category = 'All', search = '') => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const params = new URLSearchParams();
      if (category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const response = await fetch(`${baseUrl}/api/member-benefits?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setBenefits(data);
      }
    } catch (error) {
      console.error('Failed to fetch benefits', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBenefits(selectedCategory, searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubHeaderBar
        title="MEMBER BENEFITS"
        breadcrumb={[
          { label: 'HOME', path: '/' },
          { label: 'MEMBERS' },
          { label: 'MEMBER BENEFITS' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Benefit Scheme Categories *
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full md:w-64 border-gray-300 shadow-sm focus:border-fitis-blue focus:ring focus:ring-fitis-blue focus:ring-opacity-50 rounded-md py-2 px-3 text-sm"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-72 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search benefits..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 border-gray-300 shadow-sm focus:border-fitis-blue focus:ring focus:ring-fitis-blue focus:ring-opacity-50 rounded-md py-2 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-blue"></div>
          </div>
        ) : benefits.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">No member benefits found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map(benefit => (
              <div key={benefit.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full group">
                <div className="h-40 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100 relative">
                  <span className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-500 uppercase rounded border border-gray-200 shadow-sm">
                    {benefit.category}
                  </span>
                  <img
                    src={getImageUrl(benefit.logo_url)}
                    alt={benefit.brand_name}
                    className="max-w-full max-h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x150?text=Logo'; }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-xs text-fitis-blue font-bold uppercase tracking-wider mb-1">{benefit.brand_name}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{benefit.benefit_title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{benefit.description}</p>

                  <div className="mt-auto">
                    <div className="bg-blue-50 border border-blue-100 text-fitis-blue rounded-lg p-3 font-bold text-sm mb-4 inline-block">
                      {benefit.offer_text}
                    </div>

                    {benefit.link_url && (
                      <a
                        href={benefit.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-fitis-blue transition-colors"
                      >
                        Redeem / Learn More <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
