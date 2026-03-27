import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';
import { Linkedin } from 'lucide-react';

interface PastLeader {
  id: number;
  name: string;
  designation: string;
  image_url: string;
  linkedin_url: string;
  year_start: number;
  year_end: number;
}

export const PastLeaders = () => {
  const [leaders, setLeaders] = useState<PastLeader[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/leadership-members?type=past`);
        if (res.ok) {
          const data = await res.json();
          setLeaders(data);
        }
      } catch (error) {
        console.error('Failed to load past leaders', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Past Leaders' }]}
        title="PAST LEADERS"
        showSearch={false}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">FITIS PAST LEADERS</h2>
            <p className="italic text-slate-500 mb-6 font-serif">"Guiding the digital future of Sri Lanka"</p>
            <p className="text-slate-600 leading-relaxed">
              We honor the visionaries who have guided FITIS through its journey. Their dedication and strategic foresight have been instrumental in shaping the ICT landscape of Sri Lanka.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : leaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {leaders.map((leader) => (
                <div key={leader.id} className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex items-center space-x-6 hover:shadow-md transition-shadow relative group overflow-hidden">

                  {/* Photo Left */}
                  <div className="flex-shrink-0 relative">
                    {leader.image_url ? (
                      <img
                        src={getImageUrl(leader.image_url)}
                        alt={leader.name}
                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-2xl shadow-sm bg-slate-100"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=0D8ABC&color=fff&size=128`; }}
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-800 font-bold text-xl shadow-sm">
                        {leader.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info Right */}
                  <div className="flex-grow min-w-0 pr-6">
                    <h3 className="text-lg font-bold text-slate-900 truncate mb-1">{leader.name}</h3>
                    <p className="text-sm font-medium text-slate-500 mb-3 truncate">{leader.designation}</p>
                    <div className="inline-block bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded">
                      {leader.year_start} - {leader.year_end}
                    </div>
                  </div>

                  {/* LinkedIn Bottom Right Corner */}
                  {leader.linkedin_url && (
                    <a
                      href={leader.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-4 right-4 text-slate-300 hover:text-blue-600 transition-colors"
                      title={`LinkedIn Profile of ${leader.name}`}
                    >
                      <Linkedin size={20} fill="currentColor" className="opacity-80 group-hover:opacity-100" />
                    </a>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>No past leaders found.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
