import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';

interface EventItem {
  id: number;
  title: string;
  flyer_image_url: string;
  venue: string;
  event_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  rsvp_open: boolean;
  short_description: string;
  details_url: string;
  updated_at?: string;
}

interface ProgramItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image_url: string;
  read_more_url: string;
  updated_at?: string;
}

export const LatestEventsPrograms = () => {
  const [latestEvent, setLatestEvent] = useState<EventItem | null>(null);
  const [latestProgram, setLatestProgram] = useState<ProgramItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        // Fetch events
        const eventsRes = await fetch(`${baseUrl}/api/events?t=${new Date().getTime()}`);
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          if (eventsData && eventsData.length > 0) {
            // Assuming the first one is the latest or upcoming
            setLatestEvent(eventsData[0]);
          }
        }

        // Fetch programs
        const programsRes = await fetch(`${baseUrl}/api/programs?t=${new Date().getTime()}`);
        if (programsRes.ok) {
          const programsData = await programsRes.json();
          if (programsData && programsData.length > 0) {
            setLatestProgram(programsData[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load latest event or program:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  if (isLoading || (!latestEvent && !latestProgram)) {
    return null; // or a loading skeleton
  }

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 uppercase">Latest Highlights</h2>
            <div className="w-24 h-1 bg-fitis-gold mt-4"></div>
          </div>
          <div className="hidden md:flex gap-4">
             {latestEvent && (
              <Link to="/Home/events" className="text-fitis-blue font-bold hover:underline flex items-center gap-1">
                All Events <ArrowRight size={16} />
              </Link>
             )}
             {latestProgram && (
              <Link to="/Home/programs" className="text-fitis-blue font-bold hover:underline flex items-center gap-1 ml-4">
                All Programs <ArrowRight size={16} />
              </Link>
             )}
          </div>
        </div>

        {/* Slidable container */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 hide-scrollbar">

          {/* Latest Event Card */}
          {latestEvent && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="snap-start shrink-0 w-full md:w-[600px] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                {latestEvent.flyer_image_url ? (
                  <img
                    src={getImageUrl(latestEvent.flyer_image_url, latestEvent.updated_at ? new Date(latestEvent.updated_at).getTime() : undefined)}
                    alt={latestEvent.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Calendar size={64} />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-fitis-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Latest Event
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-fitis-blue transition-colors">
                  {latestEvent.title}
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar className="w-5 h-5 text-fitis-gold shrink-0" />
                    <span className="font-medium text-sm">
                      {new Date(latestEvent.event_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Clock className="w-5 h-5 text-fitis-gold shrink-0" />
                    <span className="font-medium text-sm">
                      {formatTime(latestEvent.start_time)} – {formatTime(latestEvent.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-fitis-gold shrink-0" />
                    <span className="font-medium text-sm truncate">{latestEvent.venue}</span>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                   {latestEvent.details_url ? (
                    <a href={latestEvent.details_url} target="_blank" rel="noopener noreferrer" className="text-fitis-blue font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      View Details <ExternalLink size={16} />
                    </a>
                   ) : (
                     <Link to="/Home/events" className="text-fitis-blue font-bold flex items-center gap-2 hover:gap-3 transition-all">
                      View Events <ArrowRight size={16} />
                    </Link>
                   )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Latest Program Card */}
          {latestProgram && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="snap-start shrink-0 w-full md:w-[600px] bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 flex flex-col group"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                {latestProgram.banner_image_url ? (
                  <img
                    src={getImageUrl(latestProgram.banner_image_url, latestProgram.updated_at ? new Date(latestProgram.updated_at).getTime() : undefined)}
                    alt={latestProgram.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = 'https://picsum.photos/600/400'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <div className="w-16 h-16 border-4 border-slate-300 rounded-lg"></div>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Latest Program
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {latestProgram.title}
                </h3>

                <p className="text-slate-600 line-clamp-3 mb-6 flex-1">
                  {latestProgram.description}
                </p>

                <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center">
                   <Link to={`/Home/programs/${latestProgram.slug}`} className="text-emerald-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Mobile links */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 md:hidden justify-center items-center">
           {latestEvent && (
            <Link to="/Home/events" className="text-fitis-blue font-bold hover:underline flex items-center gap-1">
              View All Events <ArrowRight size={16} />
            </Link>
           )}
           {latestProgram && (
            <Link to="/Home/programs" className="text-fitis-blue font-bold hover:underline flex items-center gap-1">
              View All Programs <ArrowRight size={16} />
            </Link>
           )}
        </div>

      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};
