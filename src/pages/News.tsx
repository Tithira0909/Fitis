import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  banner_image_url: string;
  category: string;
  publish_date: string;
}

export const News = () => {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/news?t=${new Date().getTime()}`);
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
  }, []);

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            News & Announcements
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Stay up to date with the latest industry updates, FITIS announcements, and technological advancements.
          </motion.p>
        </div>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader className="animate-spin mb-4" size={32} />
            <p>Loading latest news...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && newsList.length === 0 && (
          <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm">
            <p>No published news articles available at the moment.</p>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((news, idx) => (
            <motion.div
              key={news.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group border border-slate-100"
            >
              {/* Banner */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img 
                  src={news.banner_image_url ? (news.banner_image_url.startsWith('http') ? news.banner_image_url : `${baseUrl}${news.banner_image_url}`) : 'https://picsum.photos/800/400'}
                  alt={news.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wide flex items-center gap-1 shadow-sm">
                  <Tag size={12} />
                  {news.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <Calendar size={14} />
                  <span>{news.publish_date ? new Date(news.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  {news.title}
                </h3>

                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                  {news.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    to={`/Home/news/${news.slug}`}
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
