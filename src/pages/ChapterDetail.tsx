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

export const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const chapter = chaptersData.find(c => c.slug === slug);

  if (!chapter) {
    return <Navigate to="/Chapter/chapters" replace />;
  }

  const Icon = chapter.icon;

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Page Top Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4 text-sm text-slate-400 font-medium">
            <Link to="/" className="hover:text-fitis-blue transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/Chapter/chapters" className="hover:text-fitis-blue transition-colors">Chapters</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-600">{chapter.name}</span>
          </nav>

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
              {/* About */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                    <Target size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">About the Chapter</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg">
                  {chapter.longDescription}
                </p>
              </div>

              {/* Focus Areas */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                    <CheckCircle2 size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Focus Areas</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {chapter.focusAreas.map((area, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="mt-1 text-fitis-blue">
                        <CheckCircle2 size={18} />
                      </div>
                      <span className="text-slate-700 font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activities */}
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                    <Activity size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Key Activities</h2>
                </div>
                <ul className="space-y-4">
                  {chapter.activities.map((activity, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-slate-600">
                      <div className="w-2 h-2 bg-fitis-blue rounded-full"></div>
                      <span className="text-lg">{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Leadership Placeholder */}
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue">
                    <Users size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Leadership</h3>
                </div>
                <div className="space-y-6">
                  {[1, 2].map((_, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-full"></div>
                      <div>
                        <div className="font-bold text-slate-900">Chapter Leader {idx + 1}</div>
                        <div className="text-sm text-slate-500">Position Title</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Sidebar */}
              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Mail className="text-fitis-blue mt-1" size={20} />
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Email</div>
                      <div className="font-medium">chapters@fitis.lk</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Phone className="text-fitis-blue mt-1" size={20} />
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Phone</div>
                      <div className="font-medium">+94 11 234 5678</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="text-fitis-blue mt-1" size={20} />
                    <div>
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Address</div>
                      <div className="font-medium">No. 123, Galle Road, Colombo 03, Sri Lanka.</div>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-8 py-4 bg-fitis-blue text-white rounded-xl font-bold hover:bg-fitis-blue-light transition-all active:scale-95">
                  Contact Chapter
                </button>
              </div>
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
