import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { CheckCircle2 } from 'lucide-react';

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

export const MemberBenefits = () => {
  const [benefits, setBenefits] = useState<MemberBenefit[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBenefits = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/member-benefits`);
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
    fetchBenefits();
  }, []);

  // Group benefits by category
  const groupedBenefits = benefits.reduce((acc, benefit) => {
    const cat = benefit.category || 'Other Services';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(benefit);
    return acc;
  }, {} as Record<string, MemberBenefit[]>);

  const categories = Object.keys(groupedBenefits).sort();

  return (
    <div className="bg-white min-h-screen pb-20">
      <SubHeaderBar
        title="MEMBER BENEFITS"
        breadcrumbs={[
          { label: 'HOME', href: '/' },
          { label: 'MEMBERS' },
          { label: 'MEMBER BENEFITS' }
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Exclusive Member Advantages</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Discover the premium benefits and specialized services available exclusively to FITIS members.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : benefits.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-lg">No member benefits found at this time.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map(category => (
              <motion.div 
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-5">
                  <h3 className="text-white font-bold text-xl uppercase tracking-wider">{category}</h3>
                </div>
                <div className="p-8">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    {groupedBenefits[category].sort((a,b) => (a.sort_order || 0) - (b.sort_order || 0)).map((benefit) => (
                      <li key={benefit.id} className="flex items-start gap-4 group">
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="w-6 h-6 text-blue-600 fill-blue-50 group-hover:fill-blue-100 transition-colors" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
                            {benefit.benefit_title}
                          </h4>
                          {benefit.description && (
                            <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                              {benefit.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
