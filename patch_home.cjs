const fs = require('fs');

const path = 'src/pages/Home.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldPartnerInterface = `interface Partner {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
}`;

const newPartnerInterface = `interface Partner {
  id: number;
  name: string;
  category: 'government' | 'industry' | 'international' | 'premium_corporate' | 'corporate' | 'supporting';
  logo_url: string;
  website_url: string;
  sort_order: number;
}

const CATEGORY_ORDER = [
  'government',
  'corporate',
  'industry',
  'international',
  'premium_corporate',
];

const CATEGORY_LABELS: Record<string, string> = {
  government: 'Government Partners',
  corporate: 'FITIS Corporate Partners',
  industry: 'Industry Partners',
  international: 'International Bodies',
  premium_corporate: 'Premium Corporate Partners',
};`;

content = content.replace(oldPartnerInterface, newPartnerInterface);


const oldPartnersSectionStart = `const PartnersSection = () => {`;
const oldPartnersSectionRegex = /const PartnersSection = \(\) => \{[\s\S]*?return \(\s*<section id="partners" className="py-24 bg-white">[\s\S]*?<\/section>\s*\);\s*\};/;

const newPartnersSection = `const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(\`\${baseUrl}/api/partners\`);
        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (error) {
        console.error('Failed to load partners', error);
      }
    };
    fetchPartners();
  }, []);

  const groupedPartners = CATEGORY_ORDER.reduce((acc, cat) => {
    acc[cat] = partners.filter(p => p.category === cat);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <section id="partners" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16 md:mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 uppercase">
            PARTNERSHIPS AND AFFILIATIONS
          </h2>
          <div className="w-24 h-1 bg-fitis-gold mx-auto mb-6"></div>
        </div>

        {partners.length > 0 ? (
          <div className="space-y-16">
            {CATEGORY_ORDER.map((catKey) => {
              const group = groupedPartners[catKey];
              if (!group || group.length === 0) return null;

              return (
                <div key={catKey} className="relative">
                  <div className="flex items-center justify-center mb-10">
                    <div className="h-px bg-slate-200 flex-grow max-w-[100px] md:max-w-[300px]"></div>
                    <h3 className="px-6 text-xl md:text-2xl font-bold text-slate-800 text-center">
                      {CATEGORY_LABELS[catKey]}
                    </h3>
                    <div className="h-px bg-slate-200 flex-grow max-w-[100px] md:max-w-[300px]"></div>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                    {group.map((partner) => {
                      const content = (
                        <div className="flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:opacity-90 w-40 h-24 md:w-56 md:h-32 p-4">
                          {partner.logo_url ? (
                            <img
                              src={getImageUrl(partner.logo_url)}
                              alt={partner.name}
                              className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
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
                          href={partner.website_url.startsWith('http') ? partner.website_url : \`https://\${partner.website_url}\`}
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
          <div className="text-center py-10 text-slate-500">
            <p>No partners found.</p>
          </div>
        )}
      </div>
    </section>
  );
};`;

content = content.replace(oldPartnersSectionRegex, newPartnersSection);

fs.writeFileSync(path, content, 'utf8');
console.log('Patched Home.tsx successfully.');
