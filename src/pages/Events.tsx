import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, Calendar, MapPin, Clock, ArrowRight, Tag, Filter, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface EventItem {
  id: number;
  title: string;
  category: 'Conference' | 'Seminar' | 'Workshop';
  date: string;
  time: string;
  location: string;
  excerpt: string;
  image: string;
  status: 'upcoming' | 'past';
  featured?: boolean;
}

const eventsData: EventItem[] = [
  {
    id: 1,
    title: "FITIS Digital Excellence Summit 2024",
    category: "Conference",
    date: "June 15, 2024",
    time: "09:00 AM - 05:00 PM",
    location: "Shangri-La Hotel, Colombo",
    excerpt: "The flagship digital transformation event of the year, bringing together global thought leaders and local innovators to shape the future of Sri Lanka's digital economy.",
    image: "https://picsum.photos/seed/summit/1200/600",
    status: "upcoming",
    featured: true
  },
  {
    id: 2,
    title: "AI & Machine Learning Workshop for Developers",
    category: "Workshop",
    date: "April 25, 2024",
    time: "02:00 PM - 06:00 PM",
    location: "FITIS Training Center, Colombo 03",
    excerpt: "A hands-on technical workshop focused on implementing practical AI solutions using modern frameworks. Ideal for software engineers and data scientists.",
    image: "https://picsum.photos/seed/ai-workshop/800/500",
    status: "upcoming"
  },
  {
    id: 3,
    title: "Cybersecurity Trends in 2024: Industry Seminar",
    category: "Seminar",
    date: "May 10, 2024",
    time: "10:00 AM - 12:30 PM",
    location: "Virtual Event (Zoom)",
    excerpt: "Join industry experts as they discuss the evolving threat landscape and best practices for protecting enterprise infrastructure in an increasingly connected world.",
    image: "https://picsum.photos/seed/cyber-seminar/800/500",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Cloud Computing Strategy for SMEs",
    category: "Workshop",
    date: "May 22, 2024",
    time: "09:00 AM - 01:00 PM",
    location: "FITIS Training Center, Colombo 03",
    excerpt: "Learn how to leverage cloud technologies to scale your business efficiently while maintaining cost-effectiveness and security.",
    image: "https://picsum.photos/seed/cloud/800/500",
    status: "upcoming"
  },
  {
    id: 5,
    title: "National ICT Awards - INFOTEL 2024",
    category: "Conference",
    date: "July 05, 2024",
    time: "06:30 PM - 10:30 PM",
    location: "BMICH, Colombo",
    excerpt: "Celebrating excellence in the ICT industry. Join us for a night of recognition and networking with the leaders of Sri Lanka's tech sector.",
    image: "https://picsum.photos/seed/awards-event/800/500",
    status: "upcoming"
  },
  {
    id: 6,
    title: "Blockchain Beyond Crypto: Enterprise Applications",
    category: "Seminar",
    date: "March 01, 2024",
    time: "03:00 PM - 05:00 PM",
    location: "Virtual Event",
    excerpt: "Exploring the practical applications of blockchain technology in supply chain, finance, and healthcare sectors.",
    image: "https://picsum.photos/seed/blockchain/800/500",
    status: "past"
  },
  {
    id: 7,
    title: "Digital Marketing for Tech Startups",
    category: "Workshop",
    date: "February 15, 2024",
    time: "09:00 AM - 04:00 PM",
    location: "Hatch Works, Colombo",
    excerpt: "A comprehensive guide to building a digital presence and acquiring customers for early-stage technology companies.",
    image: "https://picsum.photos/seed/marketing/800/500",
    status: "past"
  },
  {
    id: 8,
    title: "Future of Work: Hybrid Models & Digital Tools",
    category: "Seminar",
    date: "January 20, 2024",
    time: "10:00 AM - 12:00 PM",
    location: "Virtual Event",
    excerpt: "Discussing the shift towards hybrid work environments and the essential digital tools required for seamless collaboration.",
    image: "https://picsum.photos/seed/work/800/500",
    status: "past"
  },
  {
    id: 9,
    title: "IoT Solutions for Smart Cities",
    category: "Conference",
    date: "December 10, 2023",
    time: "09:00 AM - 05:00 PM",
    location: "Hilton Colombo",
    excerpt: "Bringing together urban planners and technology providers to discuss the implementation of IoT solutions for smarter urban living.",
    image: "https://picsum.photos/seed/iot/800/500",
    status: "past"
  },
  {
    id: 10,
    title: "Data Privacy & GDPR Compliance Workshop",
    category: "Workshop",
    date: "November 15, 2023",
    time: "01:30 PM - 05:30 PM",
    location: "FITIS Training Center, Colombo 03",
    excerpt: "Understanding the legal requirements and technical implementations for data privacy and international compliance.",
    image: "https://picsum.photos/seed/privacy/800/500",
    status: "past"
  }
];

export const Events = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Upcoming first');

  const filteredEvents = useMemo(() => {
    return eventsData
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
        
        const eventDate = new Date(item.date);
        const eventMonth = eventDate.toLocaleString('default', { month: 'long' });
        const matchesMonth = monthFilter === 'All' || eventMonth === monthFilter;

        return matchesSearch && matchesCategory && matchesMonth;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (sortBy === 'Upcoming first') {
          return dateA - dateB;
        }
        return dateB - dateA;
      });
  }, [searchQuery, categoryFilter, monthFilter, sortBy]);

  const upcomingEvents = filteredEvents.filter(item => item.status === 'upcoming');
  const pastEvents = filteredEvents.filter(item => item.status === 'past');
  const featuredEvent = eventsData.find(item => item.featured && item.status === 'upcoming');

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Page Top Section */}
      <section className="py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex mb-4 text-sm text-slate-400 font-medium">
            <a href="/" className="hover:text-fitis-blue transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-slate-600">Events</span>
          </nav>

          {/* Title & Subtitle */}
          <h1 className="text-4xl md:text-5xl font-bold text-fitis-blue mb-4">Events</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Conferences, seminars, workshops, and industry programs powered by FITIS.
          </p>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
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
                  src={featuredEvent.image} 
                  alt={featuredEvent.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-fitis-blue text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                    Featured Event
                  </span>
                </div>
              </div>
              <div className="lg:w-2/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-fitis-blue mb-4">
                  <Tag size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">{featuredEvent.category}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-fitis-blue transition-colors">
                  {featuredEvent.title}
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">
                  {featuredEvent.excerpt}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={18} className="text-fitis-blue" />
                    <span className="font-medium">{featuredEvent.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock size={18} className="text-fitis-blue" />
                    <span className="font-medium">{featuredEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin size={18} className="text-fitis-blue" />
                    <span className="font-medium">{featuredEvent.location}</span>
                  </div>
                </div>

                <button className="w-full bg-fitis-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-all shadow-lg shadow-fitis-blue/20 active:scale-95 flex items-center justify-center gap-2">
                  Register Now <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Filters & Search */}
      <section className="py-12 border-b border-slate-100 sticky top-[72px] bg-white/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filters:</span>
              </div>
              
              <div className="relative">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 cursor-pointer min-w-[140px]"
                >
                  <option value="All">All Categories</option>
                  <option value="Conference">Conference</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Workshop">Workshop</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <select 
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 cursor-pointer min-w-[140px]"
                >
                  <option value="All">All Months</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 cursor-pointer min-w-[140px]"
                >
                  <option>Upcoming first</option>
                  <option>Latest first</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Upcoming Events</h2>
            <span className="px-4 py-1 bg-fitis-blue/5 text-fitis-blue text-sm font-bold rounded-full border border-fitis-blue/10">
              {upcomingEvents.length} Events Found
            </span>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((item, idx) => (
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
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-100 shadow-sm">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">Date</p>
                        <p className="text-sm font-bold text-fitis-blue leading-none mt-1">{item.date.split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <MapPin size={14} />
                        <span className="text-xs font-medium truncate">{item.location}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-fitis-blue transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <button className="text-fitis-blue text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all group/btn">
                      View Details <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-xl text-slate-400 font-medium">No upcoming events found.</p>
              <button 
                onClick={() => { setSearchQuery(''); setCategoryFilter('All'); setMonthFilter('All'); }}
                className="mt-4 text-fitis-blue font-bold underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Past Events</h2>
              <p className="text-slate-500 mt-2">Highlights from our previous programs and initiatives.</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-fitis-blue font-bold hover:underline">
              View All Past Events <ExternalLink size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEvents.slice(0, 4).map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Calendar size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mb-3 group-hover:text-fitis-blue transition-colors">
                  {item.title}
                </h4>
                <button className="text-xs font-bold text-slate-400 group-hover:text-fitis-blue transition-colors flex items-center gap-1">
                  View Recap <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-10 md:hidden bg-white border border-slate-200 text-slate-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
            View All Past Events <ExternalLink size={18} />
          </button>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-fitis-blue rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-fitis-blue/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitis-gold rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Want to partner with FITIS for an event?</h2>
              <p className="text-white/80 text-lg mb-10">
                Join forces with the apex body of the ICT industry to create impactful programs and reach a wider audience.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button className="w-full sm:w-auto px-10 py-4 bg-white text-fitis-blue rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                  Contact Us
                </button>
                <button className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                  Download Event Kit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
