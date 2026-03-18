import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Target, 
  Activity, 
  Mail, 
  Phone, 
  MapPin 
} from 'lucide-react';
import { chaptersData } from '../data/chapters';
import { SubHeaderBar } from '../components/SubHeaderBar';

export const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const chapter = chaptersData.find(c => c.slug === slug);

  if (!chapter) {
    return <Navigate to="/Chapter/chapters" replace />;
  }

  const Icon = chapter.icon;

  return (
    <div className="bg-white min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Chapters', href: '/Chapter/chapters' },
          { label: chapter.name }
        ]}
        title={chapter.name.toUpperCase()}
        showSearch={false}
      />

      {/* Page Top Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <Link 
            to="/Chapter/chapters" 
            className="inline-flex items-center gap-2 text-fitis-blue font-bold text-sm mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to Chapters
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-fitis-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-fitis-blue/20">
              <Icon size={32} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{chapter.name}</h1>
              <div className="flex flex-wrap gap-2">
                {chapter.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* Objectives */}
              {objectives.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                      <Target size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">Objectives</h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {objectives.map((obj: string, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3 bg-white p-5 rounded-xl shadow-sm border border-slate-200"
                      >
                        <CheckCircle2 size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: obj }}></span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {chapter.description_html && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                      <Activity size={20} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">About</h2>
                  </div>
                  <div
                    className="text-slate-600 leading-relaxed text-base prose max-w-none bg-white p-8 rounded-xl shadow-sm border border-slate-200"
                    dangerouslySetInnerHTML={{ __html: chapter.description_html }}
                  />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leadership / Contact Card */}
              {(chapter.chair_name || chapter.contact_email || chapter.contact_phone) && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm sticky top-32">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-wide">
                    <Users size={20} className="text-fitis-blue" />
                    Chapter Leadership
                  </h3>

                  {chapter.chair_name && (
                    <div className="mb-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full mb-4 flex items-center justify-center border border-slate-200 shadow-sm">
                        <Users size={24} className="text-slate-400" />
                      </div>
                      <p className="font-bold text-slate-900 text-lg">{chapter.chair_name}</p>
                      {chapter.chair_title && (
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{chapter.chair_title}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-4">
                    {chapter.contact_email && (
                      <a href={`mailto:${chapter.contact_email}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-fitis-blue transition-colors group">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center group-hover:bg-fitis-blue/10 group-hover:border-fitis-blue/20 transition-all shadow-sm">
                          <Mail size={16} className="group-hover:text-fitis-blue" />
                        </div>
                        <span className="font-medium">{chapter.contact_email}</span>
                      </a>
                    )}
                    {chapter.contact_phone && (
                      <a href={`tel:${chapter.contact_phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 text-sm text-slate-600 hover:text-fitis-blue transition-colors group">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center group-hover:bg-fitis-blue/10 group-hover:border-fitis-blue/20 transition-all shadow-sm">
                          <Phone size={16} className="group-hover:text-fitis-blue" />
                        </div>
                        <span className="font-medium">{chapter.contact_phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Join the {chapter.name}</h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto">
            Collaborate with industry leaders and contribute to the growth of Sri Lanka's ICT sector.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-fitis-blue text-white rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-xl active:scale-95">
              Apply for Membership
            </button>
            <Link 
              to="/Chapter/chapters"
              className="w-full sm:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all active:scale-95"
            >
              Explore Other Chapters
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
