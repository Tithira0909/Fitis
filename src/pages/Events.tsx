import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Share2, MapPin, Clock, Calendar, ExternalLink, Facebook, Twitter, Linkedin } from 'lucide-react';
import { fetchApi } from '../lib/api';
import { getImageUrl } from '../utils/getImageUrl';
import { SubHeaderBar } from '../components/SubHeaderBar';

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
  facebook_url: string;
  twitter_url: string;
  linkedin_url: string;
}

export const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchApi('/api/events');
        setEvents(data);
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.short_description && e.short_description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events' }]}
        title="UPCOMING EVENTS & ACTIVITIES"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="max-w-5xl mx-auto px-6 pt-12">
        {/* Events List */}
        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading events...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-3xl border border-slate-200 text-slate-500 shadow-sm">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-xl font-medium">No upcoming events scheduled at the moment.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row group"
              >
                {/* Left Side: Flyer */}
                <div className="md:w-[45%] relative border-b md:border-b-0 md:border-r border-slate-100 overflow-hidden bg-slate-100 flex-shrink-0">
                  {event.flyer_image_url ? (
                    <img 
                      src={getImageUrl(event.flyer_image_url)}
                      alt={event.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/500'; }}
                      className="w-full h-full object-cover aspect-[4/5] md:aspect-auto md:absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full aspect-[4/5] md:aspect-auto md:absolute inset-0 flex items-center justify-center text-slate-300">
                      <Calendar size={64} />
                    </div>
                  )}
                </div>

                {/* Right Side: Details */}
                <div className="md:w-[55%] p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    {/* RSVP Badge */}
                    <div className="mb-4">
                      {event.rsvp_open ? (
                        <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 font-bold text-sm rounded-full tracking-wide">
                          RSVP Open
                        </span>
                      ) : (
                        <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 font-bold text-sm rounded-full tracking-wide">
                          RSVP Closed
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-fitis-blue transition-colors">
                      {event.title}
                    </h2>

                    {/* Meta Details */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3 text-slate-600">
                        <Clock className="w-5 h-5 text-fitis-blue mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-800">
                            {new Date(event.event_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </p>
                          <p className="text-sm">
                            {formatTime(event.start_time)} – {formatTime(event.end_time)} {event.timezone ? `(${event.timezone})` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 text-slate-600">
                        <MapPin className="w-5 h-5 text-fitis-blue mt-0.5 shrink-0" />
                        <span className="font-medium">{event.venue}</span>
                      </div>
                    </div>

                    {/* Description */}
                    {event.short_description && (
                      <p className="text-slate-600 leading-relaxed line-clamp-3 mb-8">
                        {event.short_description}
                      </p>
                    )}
                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    {/* Share Icons */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Share2 size={16} /> Share
                      </span>
                      <div className="flex gap-2">
                        {event.facebook_url && (
                          <a href={event.facebook_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-500 hover:text-white hover:bg-[#1877F2] rounded-full transition-colors">
                            <Facebook size={18} />
                          </a>
                        )}
                        {event.twitter_url && (
                          <a href={event.twitter_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-500 hover:text-white hover:bg-black rounded-full transition-colors">
                            <Twitter size={18} />
                          </a>
                        )}
                        {event.linkedin_url && (
                          <a href={event.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 text-slate-500 hover:text-white hover:bg-[#0A66C2] rounded-full transition-colors">
                            <Linkedin size={18} />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Details Button */}
                    <a
                      href={event.details_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-fitis-blue text-white font-bold rounded-full hover:bg-blue-800 transition-all shadow-md hover:shadow-xl active:scale-95 text-center"
                    >
                      Details <ExternalLink size={18} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
