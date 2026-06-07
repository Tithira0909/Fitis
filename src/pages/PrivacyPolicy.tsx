import React, { useState, useEffect } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { Calendar, Loader } from 'lucide-react';

interface PolicySection {
  id: number;
  section_title: string;
  section_html: string;
}

interface PrivacyPolicyData {
  page_title: string;
  effective_date: string;
  sections: PolicySection[];
}

export const PrivacyPolicy = () => {
  const [data, setData] = useState<PrivacyPolicyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res = await fetch(`${baseUrl}/api/privacy-policy`);
        if (!res.ok) throw new Error('Failed to load privacy policy');
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error(err);
        setError('Privacy Policy is currently unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: data?.page_title || 'Privacy Policy' }]}
        title={data?.page_title || 'PRIVACY POLICY'}
        showSearch={false}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader className="animate-spin mb-4" size={32} />
              <p>Loading document...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p>{error}</p>
            </div>
          ) : data ? (
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
              <div className="mb-10 text-center border-b border-slate-100 pb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{data.page_title}</h1>
                {data.effective_date && (
                  <div className="flex items-center justify-center text-slate-500 gap-2 font-medium">
                    <Calendar size={18} className="text-fitis-blue" />
                    <span>Effective Date: {new Date(data.effective_date).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}</span>
                  </div>
                )}
              </div>
              <div className="space-y-8">
                {data.sections && data.sections.map((section, idx) => (
                  <div key={idx} className="prose prose-slate max-w-none">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-50">
                      {section.section_title}
                    </h2>
                    <div 
                      className="text-slate-600 leading-relaxed text-sm md:text-base tinymce-content" 
                      dangerouslySetInnerHTML={{ __html: section.section_html }} 
                    />
                  </div>
                ))}
                {(!data.sections || data.sections.length === 0) && (
                  <p className="text-slate-500 italic text-center">Content is currently being updated.</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};
