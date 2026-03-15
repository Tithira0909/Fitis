import React, { useEffect, useState, useRef } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';

interface PrivacySection {
  id: number;
  section_slug: string;
  section_title: string;
  section_html: string;
  sort_order: number;
}

interface PrivacyPolicyData {
  page_title: string;
  effective_date: string;
  sections: PrivacySection[];
}

export const PrivacyPolicy = () => {
  const [data, setData] = useState<PrivacyPolicyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/privacy-policy`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error('Failed to load privacy policy', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isLoading || !data?.sections) return;

    const options = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    data.sections.forEach((sec) => {
      const el = document.getElementById(sec.section_slug);
      if (el) observer.current?.observe(el);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [data, isLoading]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      // Adjusted scroll position to account for a fixed header if there is one
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toISOString().split('T')[0];
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
        title={data?.page_title || "PRIVACY POLICY"}
        showSearch={false}
      />

      {isLoading ? (
        <section className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </section>
      ) : data ? (
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">

              {/* Left Column: Main Content */}
              <div className="lg:w-2/3">
                <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm border border-slate-100">
                  <p className="text-slate-500 mb-8 border-b pb-4">
                    Effective date: <span className="font-semibold text-slate-800">{formatDate(data.effective_date)}</span>
                  </p>

                  <div className="space-y-12">
                    {data.sections && data.sections.map((sec) => (
                      <div key={sec.id} id={sec.section_slug} className="scroll-mt-24">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                          {sec.section_title}
                        </h2>
                        <div
                          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: sec.section_html }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Sidebar */}
              <div className="lg:w-1/3 relative hidden md:block">
                <div className="sticky top-24 bg-slate-100/50 rounded-lg p-6 border border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6 pb-2 border-b border-slate-300">
                    Table of Content
                  </h3>
                  <nav className="flex flex-col space-y-3">
                    {data.sections && data.sections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.section_slug}`}
                        onClick={(e) => scrollToSection(e, sec.section_slug)}
                        className={`text-sm transition-colors border-l-2 pl-3 ${
                          activeSection === sec.section_slug
                            ? 'border-blue-600 text-blue-700 font-semibold bg-blue-50/50 py-1'
                            : 'border-transparent text-slate-600 hover:text-blue-600 hover:border-slate-300'
                        }`}
                      >
                        {sec.section_title}
                      </a>
                    ))}
                  </nav>
                </div>
              </div>

            </div>
          </div>
        </section>
      ) : (
        <section className="py-20 text-center">
          <p className="text-slate-500 text-lg">Privacy Policy not available.</p>
        </section>
      )}
    </div>
  );
};
