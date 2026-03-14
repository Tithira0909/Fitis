import React, { useState, useEffect, useRef } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';

interface CodeOfConductSection {
  id: number;
  section_slug: string;
  section_title: string;
  section_html: string;
  sort_order: number;
}

interface CodeOfConductData {
  page_title: string;
  last_updated: string;
  sections: CodeOfConductSection[];
}

export const CodeOfConduct = () => {
  const [data, setData] = useState<CodeOfConductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');

  // Ref for the main container to observe sections
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/code-of-conduct`);
      if (!response.ok) {
        throw new Error('Failed to load code of conduct');
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to load code of conduct');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data || data.sections.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Adjust these values to trigger earlier/later
      threshold: 0
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all section elements
    if (contentRef.current) {
      const sectionElements = contentRef.current.querySelectorAll('.coc-section');
      sectionElements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, [data]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(slug);
    if (element) {
      // Offset for fixed header if needed
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Code of Conduct' }]} title="CODE OF CONDUCT" showSearch={false} />
        <div className="py-20 text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white min-h-screen">
        <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Code of Conduct' }]} title="CODE OF CONDUCT" showSearch={false} />
        <div className="py-20 text-center text-red-500">{error || 'Failed to load content'}</div>
      </div>
    );
  }

  // Format date correctly
  let formattedDate = data.last_updated;
  if (formattedDate) {
    const d = new Date(formattedDate);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    formattedDate = `${d.getDate().toString().padStart(2, '0')}-${months[d.getMonth()]}-${d.getFullYear()}`;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Code of Conduct' }]}
        title={data.page_title || "CODE OF ETHICS AND PROFESSIONAL CONDUCT"}
        showSearch={false}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 relative">

          {/* Main Content Area (~70%) */}
          <div className="lg:w-8/12 bg-white p-8 md:p-12 rounded-xl shadow-sm" ref={contentRef}>
            {formattedDate && (
              <p className="text-gray-500 italic mb-8 pb-8 border-b border-gray-100">
                Last updated: {formattedDate}
              </p>
            )}

            <div className="space-y-12">
              {data.sections.map((section) => (
                <div
                  key={section.id}
                  id={section.section_slug}
                  className="coc-section scroll-mt-24"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-6 uppercase tracking-wide">
                    {section.section_title}
                  </h2>
                  <div
                    className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600 prose-headings:text-slate-800"
                    dangerouslySetInnerHTML={{ __html: section.section_html }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Sidebar (Table of Contents ~30%) */}
          <div className="lg:w-4/12 hidden lg:block">
            <div className="sticky top-24 bg-gray-100 rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6 px-2">
                Table of Content
              </h3>
              <ul className="space-y-1">
                {data.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.section_slug}`}
                      onClick={(e) => scrollToSection(e, section.section_slug)}
                      className={`group flex items-start py-2 px-2 rounded-lg transition-colors text-sm ${
                        activeSection === section.section_slug
                          ? 'text-fitis-blue font-bold bg-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                      }`}
                    >
                      <span className="mr-3 mt-1 text-gray-400 group-hover:text-fitis-blue">
                        <div className={`w-3 h-3 rounded-full border-2 ${activeSection === section.section_slug ? 'border-fitis-blue bg-fitis-blue' : 'border-gray-400 bg-transparent'}`} />
                      </span>
                      <span className="flex-1 uppercase leading-snug tracking-wide text-xs">
                        {section.section_title.replace(/^\d+\.\s*/, '')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
