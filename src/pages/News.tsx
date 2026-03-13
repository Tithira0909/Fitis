import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Calendar, ArrowRight, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

interface NewsItem {
  id: number;
  title: string;
  category: 'Announcement' | 'Event' | 'Industry';
  date: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    title: "FITIS Digital Excellence Awards 2024: Nominations Now Open",
    category: "Event",
    date: "March 10, 2024",
    excerpt: "The most prestigious awards ceremony in Sri Lanka's tech calendar is back. We invite organizations to showcase their digital innovations and compete for national recognition.",
    image: "https://picsum.photos/seed/awards/1200/600",
    featured: true
  },
  {
    id: 2,
    title: "National ICT Policy Framework: FITIS Submits Recommendations",
    category: "Announcement",
    date: "March 05, 2024",
    excerpt: "FITIS has formally submitted a comprehensive set of recommendations to the Ministry of Technology regarding the upcoming National ICT Policy Framework.",
    image: "https://picsum.photos/seed/policy/800/500"
  },
  {
    id: 3,
    title: "Sri Lankan Tech Delegation to Visit Singapore FinTech Festival",
    category: "Industry",
    date: "February 28, 2024",
    excerpt: "A high-level delegation of 20 Sri Lankan tech firms, led by FITIS, will participate in the upcoming Singapore FinTech Festival to explore global partnerships.",
    image: "https://picsum.photos/seed/singapore/800/500"
  },
  {
    id: 4,
    title: "Upcoming Workshop: Cybersecurity for Small & Medium Enterprises",
    category: "Event",
    date: "February 20, 2024",
    excerpt: "Join our expert-led workshop on implementing cost-effective cybersecurity measures for SMEs. Registration is free for all FITIS members.",
    image: "https://picsum.photos/seed/cyber/800/500"
  },
  {
    id: 5,
    title: "FITIS Welcomes New Software Chapter President",
    category: "Announcement",
    date: "February 15, 2024",
    excerpt: "We are pleased to announce the appointment of the new President for the FITIS Software Chapter, bringing over 20 years of industry experience.",
    image: "https://picsum.photos/seed/president/800/500"
  },
  {
    id: 6,
    title: "Industry Insight: The Rise of AI in Sri Lanka's Service Sector",
    category: "Industry",
    date: "February 10, 2024",
    excerpt: "Our latest industry report explores how artificial intelligence is being adopted across Sri Lanka's banking, retail, and telecommunications sectors.",
    image: "https://picsum.photos/seed/ai/800/500"
  },
  {
    id: 7,
    title: "FITIS Annual Cricket Tournament 2024 Announced",
    category: "Event",
    date: "February 05, 2024",
    excerpt: "The much-awaited FITIS Cricket Tournament is back. Register your company teams for a day of networking and friendly competition.",
    image: "https://picsum.photos/seed/cricket/800/500"
  }
];

export const News = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest first');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredNews = useMemo(() => {
    return newsData
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'Newest first') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
  }, [searchQuery, categoryFilter, sortBy]);

  const featuredItem = newsData.find(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  const totalPages = Math.ceil(regularNews.length / itemsPerPage);
  const paginatedNews = regularNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Page Top Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4 text-sm text-slate-400 font-medium">
            <a href="/" className="hover:text-fitis-blue transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-slate-600">News</span>
          </nav>

          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-5xl font-bold text-fitis-blue mb-4">News</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Latest updates, announcements, events, and industry highlights from FITIS.
          </p>
        </div>
      </section>

      {/* Featured News */}
      {featuredItem && (
        <section className="py-16 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 flex flex-col lg:flex-row group"
            >
              <div className="lg:w-3/5 relative overflow-hidden">
                <img 
                  src={featuredItem.image}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-fitis-blue text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                    Featured
                  </span>
                </div>
              </div>
              <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-fitis-blue mb-4">
                  <Tag size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">{featuredItem.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-fitis-blue transition-colors">
                  {featuredItem.title}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {featuredItem.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">{featuredItem.date}</span>
                  </div>
                  <button className="text-fitis-blue font-bold flex items-center gap-2 hover:gap-3 transition-all group/btn">
                    Read More <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <section className="py-12 border-b border-slate-100 sticky top-[72px] bg-white/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Category:</span>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 cursor-pointer"
                  >
                    <option>All</option>
                    <option>Announcement</option>
                    <option>Event</option>
                    <option>Industry</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 cursor-pointer"
                  >
                    <option>Newest first</option>
                    <option>Oldest first</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {paginatedNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedNews.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-fitis-blue text-[10px] font-bold rounded-full uppercase tracking-widest border border-fitis-blue/10">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-slate-400 mb-3">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-fitis-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <button className="text-fitis-blue text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group/btn">
                      Read More <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl text-slate-400 font-medium">No news articles found matching your criteria.</p>
              <button
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); }}
                className="mt-4 text-fitis-blue font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-20 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={20} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-lg text-sm font-bold transition-all",
                    currentPage === i + 1
                      ? "bg-fitis-blue text-white shadow-lg shadow-fitis-blue/20"
                      : "text-slate-600 hover:bg-slate-50 border border-slate-200"
                  )}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
