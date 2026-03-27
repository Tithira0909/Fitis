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
  corporate: 'CORPORATE PARTNERS',
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
            <div className="space-y-20 md:space-y-28">
              {CATEGORY_ORDER.map((catKey, index) => {
                const group = groupedPartners[catKey];
                if (!group || group.length === 0) return null;

                return (
                  <div key={catKey} className="relative">
                    {index > 0 && <hr className="absolute -top-10 md:-top-14 left-0 right-0 border-t border-slate-200" />}

                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-10 md:mb-14 uppercase tracking-widest">
                      {CATEGORY_LABELS[catKey]}
                    </h3>

                    <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 items-center">
                      {group.map((partner) => {
                        const content = (
                          <div className="w-32 md:w-48 h-24 md:h-32 flex items-center justify-center p-4 bg-white hover:bg-slate-50 rounded-xl transition-all duration-300 filter grayscale hover:grayscale-0 hover:scale-105 hover:shadow-lg border border-transparent hover:border-slate-100">
                            {partner.logo_url ? (
                              <img
                                src={getImageUrl(partner.logo_url)}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                title={partner.name}
                              />
                            ) : (
                              <span className="text-center text-sm font-bold text-slate-400">{partner.name}</span>
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
