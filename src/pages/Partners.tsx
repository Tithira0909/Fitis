import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';

interface Partner {
  id: number;
  name: string;
  category: 'government' | 'industry' | 'international' | 'premium_corporate' | 'corporate' | 'supporting';
  logo_url: string;
  website_url: string;
  sort_order: number;
}

const CATEGORY_ORDER = [
  'government',
  'industry',
  'international',
  'premium_corporate',
  'corporate',
  'supporting',
];

const CATEGORY_LABELS: Record<string, string> = {
  government: 'GOVERNMENT PARTNERS',
  industry: 'INDUSTRY PARTNERS',
  international: 'INTERNATIONAL BODIES',
  premium_corporate: 'PREMIUM CORPORATE PARTNERS',
  corporate: 'FITIS CORPORATE PARTNERS',
  supporting: 'SUPPORTING PARTNERS',
};

export const Partners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/partners`);
        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (error) {
        console.error('Failed to load partners', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPartners();
  }, []);

  const groupedPartners = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = partners.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Partnerships & Affiliations' }]}
        title="PARTNERSHIPS & AFFILIATIONS"
        showSearch={false}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-4xl mx-auto mb-16 md:mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-fitis-blue mb-4 uppercase tracking-wider">
              PARTNERSHIPS AND AFFILIATIONS
            </h2>
            <div className="w-24 h-1 bg-fitis-gold mx-auto mb-6"></div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-blue"></div>
            </div>
          ) : partners.length > 0 ? (
            <div className="space-y-16 md:space-y-20">
              {CATEGORY_ORDER.map((catKey) => {
                const group = groupedPartners[catKey];
                if (!group || group.length === 0) return null;

                // Adjust spacing for single items (like EDB)
                const isSingle = group.length === 1;

                return (
                  <div key={catKey} className="relative">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center uppercase tracking-widest mb-4">
                      {CATEGORY_LABELS[catKey]}
                    </h3>
                    <div className="w-full h-px bg-slate-200 mb-8 md:mb-12"></div>

                    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14 items-center justify-items-center ${isSingle ? '!flex !justify-center' : ''}`}>
                      {group.map((partner) => {
                        const content = (
                          <div className={`flex items-center justify-center p-2 transition-transform duration-300 hover:scale-105 hover:opacity-90 ${isSingle ? 'w-48 h-32 md:w-64 md:h-40 lg:h-48 lg:w-72' : 'w-32 h-20 sm:w-36 sm:h-24 md:w-40 md:h-28 lg:w-48 lg:h-32'}`}>
                            {partner.logo_url ? (
                              <img
                                src={getImageUrl(partner.logo_url)}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                title={partner.name}
                              />
                            ) : (
                              <span className="text-center text-sm font-bold text-slate-400 uppercase tracking-wide">{partner.name}</span>
                            )}
                          </div>
                        );

                        return partner.website_url ? (
                          <a
                            key={partner.id}
                            href={partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
                          >
                            {content}
                          </a>
                        ) : (
                          <div key={partner.id}>
                            {content}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>No partners found.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
