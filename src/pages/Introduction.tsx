import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, Info, Target, Eye, Activity, Globe, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import { SubHeaderBar } from '../components/SubHeaderBar';

export const Introduction = () => {
  return (
    <div className="bg-white min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Introduction' }]}
        title="INTRODUCTION"
        showSearch={false}
      />

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Left Side: Content Blocks */}
            <div className="lg:col-span-8 space-y-12">

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-fitis-blue mb-2">
                  <Info size={24} />
                  <h2 className="text-2xl font-bold">Who We Are</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  The Federation of Information Technology Industry Sri Lanka (FITIS) is the apex body of the ICT industry in Sri Lanka. Established in 1996 with the purpose of providing a unified voice for the technology sector, FITIS represents a diverse range of stakeholders including hardware vendors, software developers, education providers, and digital service companies.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  With over 25 years of experience, we have been at the forefront of driving digital transformation across the nation. We serve as the primary interface between the industry and the government, working closely with the Ministry of Technology, ICTA, and other key agencies to foster a robust and inclusive digital economy.
                </p>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  Our membership comprises over 200 leading technology firms, providing us with the collective expertise and influence to shape the future of Sri Lanka's digital landscape.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-fitis-blue mb-2">
                  <Target size={24} />
                  <h2 className="text-2xl font-bold">Our Mission</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  To make Sri Lanka the leading innovation and digital economic hub in Asia by fostering emerging technologies, enabling a future-ready workforce, and driving sustainable digital transformation that enhances global competitiveness and inclusive prosperity.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-fitis-blue mb-2">
                  <Eye size={24} />
                  <h2 className="text-2xl font-bold">Our Vision</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  To be the trusted and unified voice of the ICT industry in Sri Lanka.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-fitis-blue mb-2">
                  <Activity size={24} />
                  <h2 className="text-2xl font-bold">What We Do</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-lg text-justify">
                  FITIS operates through several specialized chapters, each focusing on a key area of the ICT landscape. Our activities include:
                </p>
                <ul className="grid md:grid-cols-2 gap-4 mt-6">
                  {[
                    "Policy Advocacy & Government Relations",
                    "Industry Capacity Building & Training",
                    "Global Trade Delegations & Exhibitions",
                    "National ICT Awards & Recognition",
                    "Startup Mentorship & Ecosystem Support",
                    "Digital Transformation Consultancy"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <CheckCircle2 className="text-fitis-blue shrink-0 mt-1" size={18} />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Right Side: Info Card Panel */}
            <div className="lg:col-span-4 sticky top-32">
              <div className="relative">
                {/* Subtle Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                  <Globe size={400} className="text-fitis-blue" />
                </div>

                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Quick Facts</h3>

                  <div className="space-y-6 mb-10">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                        <History size={14} className="text-fitis-blue" /> Founded
                      </p>
                      <p className="text-lg font-bold text-slate-900">1996</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Chapters</p>
                      <p className="text-lg font-bold text-slate-900">7 Specialized Chapters</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Focus Areas</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["ICT", "Digital Policy", "Skills", "Innovation", "Industry Growth"].map((area, i) => (
                          <span key={i} className="px-3 py-1 bg-fitis-blue/5 text-fitis-blue text-xs font-bold rounded-full border border-fitis-blue/10">
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Link to="/Home/become-a-member" className="w-full bg-fitis-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-lg shadow-fitis-blue/20 active:scale-95 flex items-center justify-center gap-2 border-2 border-transparent">
                    Become a Member <ArrowRight size={20} />
                  </Link>
                </div>

                {/* Additional small card */}
                <div className="mt-6 bg-fitis-gold/10 p-6 rounded-2xl border border-fitis-gold/20">
                  <p className="text-fitis-blue font-bold text-sm leading-relaxed">
                    "Join the apex body and be a part of Sri Lanka's digital future."
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};
