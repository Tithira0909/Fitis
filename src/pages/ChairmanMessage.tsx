import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';
import { Lightbulb, Target, Users, Globe, TrendingUp, Eye, Shield } from 'lucide-react';

interface FocusCard {
  icon: string;
  title: string;
}

interface ChairmanMessageData {
  name: string;
  designation: string;
  subtitle: string;
  photo_url: string;
  message_title: string;
  message_body: string;
  focus_cards: FocusCard[];
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Lightbulb': return <Lightbulb size={24} className="text-blue-900 mb-2" />;
    case 'Target': return <Target size={24} className="text-blue-900 mb-2" />;
    case 'Users': return <Users size={24} className="text-blue-900 mb-2" />;
    case 'Globe': return <Globe size={24} className="text-blue-900 mb-2" />;
    case 'TrendingUp': return <TrendingUp size={24} className="text-blue-900 mb-2" />;
    case 'Shield': return <Shield size={24} className="text-blue-900 mb-2" />;
    case 'Eye':
    default: return <Eye size={24} className="text-slate-700 mb-2" />;
  }
};

export const ChairmanMessage = () => {
  const [data, setData] = useState<ChairmanMessageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/chairman-message`);
        if (res.ok) {
          const json = await res.json();
          setData({
            ...json,
            focus_cards: typeof json.focus_cards === 'string' ? JSON.parse(json.focus_cards) : (json.focus_cards || [])
          });
        }
      } catch (error) {
        console.error('Failed to load chairman message', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Chairman\'s Message' }]}
        title="CHAIRMAN'S MESSAGE"
        showSearch={false}
      />

      {isLoading ? (
        <section className="py-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </section>
      ) : data ? (
        <section className="py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-6">

            {/* Top Section: Photo & Message */}
            <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">

              {/* Left Column: Photo Card */}
              <div className="w-full md:w-1/3 flex-shrink-0">
                <div className="relative rounded-lg overflow-hidden shadow-lg group">
                  <img
                    src={getImageUrl(data.photo_url)}
                    alt={data.name}
                    className="w-full h-auto object-cover aspect-[3/4]"
                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x533'; }}
                  />
                  {/* Overlay Text at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                    <h3 className="text-white font-bold text-lg lg:text-xl uppercase tracking-wider">{data.name}</h3>
                    <p className="text-white font-semibold text-sm lg:text-base">{data.designation}</p>
                    {data.subtitle && (
                      <p className="text-gray-200 text-xs lg:text-sm mt-1 leading-snug">{data.subtitle}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Message Content */}
              <div className="w-full md:w-2/3 flex-col space-y-6 pt-2 md:pt-0">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  {data.message_title}
                </h2>
                <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4">
                  {data.message_body.split('\n').map((paragraph, idx) => (
                    paragraph.trim() ? <p key={idx} className="text-[15px] md:text-base">{paragraph}</p> : null
                  ))}
                </div>
              </div>

            </div>

            {/* Bottom Section: Focus Cards */}
            {data.focus_cards && data.focus_cards.length > 0 && (
              <div className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.focus_cards.map((card, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIconComponent(card.icon)}
                    </div>
                    <h4 className="text-sm font-semibold text-slate-800 leading-snug">{card.title}</h4>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      ) : (
        <section className="py-20 text-center">
          <p className="text-slate-500 text-lg">Message not available at this time.</p>
        </section>
      )}
    </div>
  );
};
