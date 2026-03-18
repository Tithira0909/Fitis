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
  status?: string;
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
    acc[cat] = partners
      .filter(p => p.category === cat && (p.status === 'published' || p.status == null || p.status === ''))
      .sort((a, b) => a.sort_order - b.sort_order);
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
            <h2 className="text-3xl md:text-4xl font-normal text-[#00529b] mb-4 uppercase tracking-wider">
              PARTNERSHIPS AND AFFILIATIONS
            </h2>
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
                  <div key={catKey} className="relative mb-16 md:mb-20">
                    <h3 className="text-lg md:text-xl font-medium text-slate-800 text-center mb-4 uppercase tracking-widest">
                      {CATEGORY_LABELS[catKey]}
                    </h3>

                    <hr className="w-full border-t border-slate-300 mb-10" />

                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
                      {group.map((partner) => {
                        const isSingle = group.length === 1;
                        const sizeClasses = isSingle ? "h-24 md:h-32" : "h-16 md:h-20 lg:h-24";

                        const content = (
                          <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:opacity-90">
                            {partner.logo_url ? (
                              <img
                                src={getImageUrl(partner.logo_url)}
                                alt={partner.name}
                                className={`w-auto ${sizeClasses} object-contain`}
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLImageElement;
                                  target.style.display = 'none';
                                  if (target.nextElementSibling) {
                                    (target.nextElementSibling as HTMLElement).style.display = 'block';
                                  }
                                }}
                                title={partner.name}
                              />
                            ) : null}
                            <span className="text-center text-sm font-bold text-slate-400" style={{ display: partner.logo_url ? 'none' : 'block' }}>
                              {partner.name}
                            </span>
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
