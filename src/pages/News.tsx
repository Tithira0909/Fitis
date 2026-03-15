import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowRight, Loader, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { SectionHeader } from '../components/SectionHeader';
import { getImageUrl } from '../utils/getImageUrl';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  banner_image_url: string;
  category: string;
  publish_date: string;
  updated_at?: string;
}

export const News = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(10);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Parse query param on mount
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setSearchQuery(q);

    const fetchNews = async () => {
      try {
        let url = `${baseUrl}/api/news?t=${new Date().getTime()}`;
        if (q) url += `&q=${encodeURIComponent(q)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to load news');
        const data = await res.json();
        setNewsList(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading news articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [baseUrl]);

  const categories = ['All', 'Announcement', 'Event', 'Industry'];

  // Only filter by category client-side if a search query was used, as the backend handled the text search.
  // If user starts typing locally, filter the already fetched results.
  const filteredNews = newsList.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (news.excerpt && news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedNews = filteredNews.slice(0, visibleCount);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      {/* Global Top Bar */}
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Latest News' }]}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        title="FITIS PRESS ROOM"
        onSearchSubmit={(q) => { window.location.href = `/Home/news?q=${encodeURIComponent(q.trim())}`; }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-12">

        <SectionHeader title="Latest News" className="mb-8" />

        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 border-b border-slate-200 pb-6">
          {/* Replaced heading with SectionHeader above, but leaving filter layout intact. If needed, can keep h1 visually hidden for SEO or remove it. Let's just remove the h1 text as SectionHeader handles it. */}
          <div className="w-full md:w-auto text-3xl md:text-4xl font-display font-bold text-slate-900 hidden"></div>

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

        {/* Loading / Error States */}
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

        {!isLoading && !error && displayedNews.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-lg">No news articles found matching your criteria.</p>
            <button
              onClick={() => { window.location.href = '/Home/news'; }}
              className="mt-4 text-fitis-blue font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* News Grid (2-column horizontal cards) */}
        <div className="grid md:grid-cols-2 gap-8">
          {displayedNews.map((news, idx) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 flex flex-col sm:flex-row group border border-slate-100 min-h-[220px]"
            >
              {/* Image Left Side */}
              <div className="sm:w-2/5 relative overflow-hidden bg-slate-100 shrink-0 h-56 sm:h-auto">
                <img 
                  src={news.banner_image_url ? getImageUrl(news.banner_image_url, news.updated_at ? new Date(news.updated_at).getTime() : undefined) : 'https://picsum.photos/400/400'}
                  alt={news.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/400'; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-fitis-blue uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  {news.category}
                </div>
              </div>

              {/* Content Right Side */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Calendar size={14} />
                  <span>{news.publish_date ? new Date(news.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-fitis-blue transition-colors">
                  <Link to={`/Home/news/${news.slug}`}>
                    {news.title}
                  </Link>
                </h3>

                <p className="text-slate-600 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                  {news.excerpt}
                </p>

                <div className="mt-auto flex justify-end">
                  <Link
                    to={`/Home/news/${news.slug}`}
                    className="inline-flex items-center gap-2 text-white bg-fitis-blue hover:bg-blue-800 font-medium text-sm px-5 py-2 rounded-lg transition-all shadow-sm group-hover:shadow-md"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination / Load More */}
        {!isLoading && !error && filteredNews.length > visibleCount && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 10)}
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold py-3 px-8 rounded-xl shadow-sm transition-all"
            >
              Load More News
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
