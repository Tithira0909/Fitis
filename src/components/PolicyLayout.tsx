import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from './SubHeaderBar';
import { motion } from 'motion/react';

export interface PolicySection {
  id: string;
  title: string;
  content: React.ReactNode | string;
}

interface PolicyLayoutProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  lastUpdated?: string;
  sections: PolicySection[];
}

export const PolicyLayout: React.FC<PolicyLayoutProps> = ({
  title,
  breadcrumbs,
  lastUpdated,
  sections
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  // Scroll spy to highlight active TOC item
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section =>
        document.getElementById(section.id)
      ).filter(Boolean) as HTMLElement[];

      let currentActive = sections[0]?.id;

      for (const element of sectionElements) {
        // Calculate position relative to viewport
        const rect = element.getBoundingClientRect();
        // If the top of the section is near the top of the viewport (with offset for header)
        if (rect.top <= 150) {
          currentActive = element.id;
        }
      }

      setActiveSection(currentActive);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={breadcrumbs}
        title={title}
      />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12 relative">

          {/* Main Content Area */}
          <div className="flex-grow lg:w-3/4 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
            {lastUpdated && (
              <p className="text-sm text-slate-500 italic mb-10 font-medium">
                Last updated: {lastUpdated}
              </p>
            )}

            <div className="space-y-16">
              {sections.map((section) => (
                <motion.section
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="scroll-mt-32"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-fitis-blue mb-6 pb-4 border-b border-slate-100 uppercase">
                    {section.title}
                  </h2>
                  <div className="text-slate-700 leading-relaxed space-y-4">
                    {typeof section.content === 'string' ? (
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    ) : (
                      section.content
                    )}
                  </div>
                </motion.section>
              ))}
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-32 bg-slate-100/50 p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-6 pb-4 border-b border-slate-200 text-sm">
                Table of Content
              </h3>
              <nav>
                <ul className="space-y-3">
                  {sections.map((section) => (
                    <li key={section.id} className="relative pl-4">
                      {/* Connection line indicator */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 flex items-center">
                         <div className={`w-1 h-1 rounded-full ${activeSection === section.id ? 'bg-fitis-blue' : 'bg-slate-300'}`}></div>
                         <div className={`h-[1px] w-full ${activeSection === section.id ? 'bg-fitis-blue' : 'bg-slate-300'}`}></div>
                      </div>
                      <a
                        href={`#${section.id}`}
                        onClick={(e) => scrollToSection(e, section.id)}
                        className={`block text-xs md:text-sm font-semibold transition-colors uppercase leading-tight ${
                          activeSection === section.id
                            ? 'text-fitis-blue'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
