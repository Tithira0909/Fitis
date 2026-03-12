import React from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Code, 
  Smartphone, 
  Radio, 
  GraduationCap, 
  Cpu, 
  Briefcase, 
  ArrowRight, 
  Users, 
  Layers, 
  Calendar,
  LucideIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { chaptersData } from '../data/chapters';

const stats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Total Chapters", value: "7+", icon: Layers },
  { label: "Working Groups", value: "15+", icon: Users },
  { label: "Programs/Year", value: "50+", icon: Calendar }
];

export const Chapters = () => {
  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Page Top Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4 text-sm text-slate-400 font-medium">
            <Link to="/" className="hover:text-fitis-blue transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-600">Chapters</span>
          </nav>

          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-5xl font-bold text-fitis-blue mb-4">Chapters</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Specialised chapters representing every facet of Sri Lanka’s ICT ecosystem.
          </p>
        </div>
      </section>

      {/* Chapters Overview Section */}
      <section className="py-16 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Driving Industry Growth</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                FITIS operates through specialised chapters to drive industry growth, collaboration, standards, and national digital priorities. Each chapter serves as a dedicated forum for stakeholders within a specific sector to address challenges, share knowledge, and influence policy decisions that shape the future of technology in Sri Lanka.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center"
                >
                  <div className="w-12 h-12 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue mx-auto mb-4">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chaptersData.map((chapter, idx) => (
              <motion.div
                key={chapter.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full"
              >
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-fitis-blue mb-6 group-hover:bg-fitis-blue group-hover:text-white transition-colors">
                  <chapter.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-fitis-blue transition-colors">
                  {chapter.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                  {chapter.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {chapter.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider border border-slate-100">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  to={`/Chapter/chapters/${chapter.slug}`}
                  className="w-full py-3 bg-slate-50 text-fitis-blue rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-fitis-blue hover:text-white transition-all group/btn"
                >
                  View Chapter <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-fitis-blue rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-fitis-blue/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitis-gold rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Want to contribute to a chapter?</h2>
              <p className="text-white/80 text-lg mb-10">
                Join our specialized chapters and play a key role in driving Sri Lanka's digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-10 py-4 bg-white text-fitis-blue rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                  Become a Member
                </button>
                <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                  Contact FITIS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
