import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Loader, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { SectionHeader } from '../components/SectionHeader';
import { getImageUrl } from '../utils/getImageUrl';

interface PressItem {
  id: string;
  title: string;
  excerpt: string;
  image_url: string;
  category: 'Event' | 'Program';
  dateStr: string;
  link: string;
  external: boolean;
  rawDate: number;
}

export const News = () => {
  const [pressList, setPressList] = useState<PressItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(10);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);

    const fetchPressroom = async () => {
      try {
        const [programsRes, eventsRes] = await Promise.all([
          fetch(`${baseUrl}/api/programs?t=${new Date().getTime()}`),
          fetch(`${baseUrl}/api/events?t=${new Date().getTime()}`)
        ]);

        if (!programsRes.ok || !eventsRes.ok) throw new Error('Failed to load pressroom data');

        const programsData = await programsRes.json();
        const eventsData = await eventsRes.json();

        const combined: PressItem[] = [];

        programsData.forEach((p: any) => {
          combined.push({
            id: `prog-${p.id}`,
            title: p.title,
            excerpt: p.description || '',
            image_url: p.banner_image_url || '',
            category: 'Program',
            dateStr: p.updated_at ? new Date(p.updated_at).toLocaleDateString() : 'Recent',
            link: `/Home/programs/${p.slug}`,
            external: false,
            rawDate: p.updated_at ? new Date(p.updated_at).getTime() : 0,
          });
        });

        eventsData.forEach((e: any) => {
          combined.push({
            id: `evt-${e.id}`,
            title: e.title,
            excerpt: e.short_description || '',
            image_url: e.flyer_image_url || '',
            category: 'Event',
            dateStr: e.event_date ? new Date(e.event_date).toLocaleDateString() : 'Upcoming',
            link: e.details_url || '/Home/events',
            external: !!e.details_url,
            rawDate: e.event_date ? new Date(e.event_date).getTime() : 0,
          });
        });

        // Sort by newest
        combined.sort((a, b) => b.rawDate - a.rawDate);
        setPressList(combined);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading press room.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPressroom();
  }, [baseUrl]);

  const categories = ['All', 'Event', 'Program'];

  const filteredPress = pressList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedList = filteredPress.slice(0, visibleCount);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Press Room' }]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="FITIS PRESS ROOM"
        onSearchSubmit={(q) => { window.location.href = `/Home/news?q=${encodeURIComponent(q.trim())}`; }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-12">

        <SectionHeader title="Latest Updates" className="mb-8" />

        <div className="flex flex-col md:flex-row justify-end items-center mb-10 gap-6 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setVisibleCount(10);
              }}
              className="bg-white border border-slate-300 text-slate-700 py-2 px-4 rounded-lg focus:outline-none focus:border-fitis-blue focus:ring-1 focus:ring-fitis-blue shadow-sm font-medium"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader className="animate-spin mb-4 text-fitis-blue" size={32} />
            <p>Loading press room...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && displayedList.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-lg">No items found matching your criteria.</p>
            <button
              onClick={() => { window.location.href = '/Home/news'; }}
              className="mt-4 text-fitis-blue font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {displayedList.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col sm:flex-row group border border-slate-100 min-h-[220px]"
            >
              <div className="sm:w-2/5 relative overflow-hidden bg-slate-100 shrink-0 h-56 sm:h-auto border-r border-slate-100">
                <img 
                  src={item.image_url ? getImageUrl(item.image_url, item.rawDate) : 'https://picsum.photos/400/400'}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/400'; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-fitis-blue uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  {item.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Calendar size={14} />
                  <span>{item.dateStr}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-fitis-blue transition-colors">
                  {item.external ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  ) : (
                    <Link to={item.link}>{item.title}</Link>
                  )}
                </h3>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                  {item.excerpt}
                </p>

                <div className="mt-auto flex justify-end">
                  {item.external ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white bg-fitis-blue hover:bg-blue-800 font-medium text-sm px-5 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md"
                    >
                      Read More <ArrowRight size={16} />
                    </a>
                  ) : (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-2 text-white bg-fitis-blue hover:bg-blue-800 font-medium text-sm px-5 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md"
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && !error && filteredPress.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3 px-8 rounded-xl shadow-sm transition-all"
            >
              Load More
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

