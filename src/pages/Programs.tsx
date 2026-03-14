import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Loader } from 'lucide-react';
import { PressRoomBar } from '../components/PressRoomBar';
import { getImageUrl } from '../utils/getImageUrl';

interface ProgramItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image_url: string;
  read_more_url: string;
  sort_order: number;
}

export const Programs = () => {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/programs?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error('Failed to load programs');
        const data = await res.json();
        setPrograms(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading programs.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, [baseUrl]);

  const filteredPrograms = programs.filter(program =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* Global Top Bar */}
      <PressRoomBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Projects & Programs' }]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="PROJECTS & PROGRAMS"
        onSearchSubmit={(q) => setSearchQuery(q)}
      />

      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="text-center mb-12 border-b border-slate-200 pb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-extrabold text-fitis-blue tracking-tight uppercase"
          >
            Projects & Programs
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg font-medium max-w-2xl mx-auto"
          >
            Explore our initiatives and projects shaping the future of the industry.
          </motion.p>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader className="animate-spin mb-4 text-fitis-blue" size={32} />
            <p className="font-medium">Loading programs...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100 shadow-sm">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {!isLoading && !error && filteredPrograms.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-200">
            <p className="text-lg font-medium">No programs found matching your search criteria.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-fitis-blue font-bold hover:underline"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Programs Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {filteredPrograms.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col sm:flex-row group border border-slate-100 min-h-[200px]"
            >
              {/* Image Left Side */}
              <div className="sm:w-2/5 relative overflow-hidden bg-slate-100 shrink-0 h-48 sm:h-auto border-r border-slate-100">
                <img
                  src={program.banner_image_url ? getImageUrl(program.banner_image_url) : 'https://picsum.photos/400/400'}
                  alt={program.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/400'; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Content Right Side */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug group-hover:text-fitis-blue transition-colors">
                  {program.title}
                </h3>

                <p className="text-slate-600 text-sm md:text-base mb-6 line-clamp-3 leading-relaxed flex-1">
                  {program.description}
                </p>

                <div className="mt-auto flex justify-end">
                  {program.read_more_url.startsWith('http') ? (
                    <a
                      href={program.read_more_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white bg-fitis-blue hover:bg-blue-800 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm group-hover:shadow-md group-hover:translate-x-1"
                    >
                      READ MORE <ArrowRight size={16} />
                    </a>
                  ) : (
                    <a
                      href={program.read_more_url}
                      className="inline-flex items-center gap-2 text-white bg-fitis-blue hover:bg-blue-800 font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm group-hover:shadow-md group-hover:translate-x-1"
                    >
                      READ MORE <ArrowRight size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
