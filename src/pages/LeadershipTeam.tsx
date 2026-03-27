import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';

interface LeadershipMember {
  id: number;
  name: string;
  designation: string;
  type: string;
  image_url: string | null;
  linkedin_url: string | null;
  hierarchy_level: number;
  seat: number;
}

export const LeadershipTeam = () => {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/leadership-members?type=current`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to fetch leadership members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="bg-[#0B1120] min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'About' }, { label: 'Leadership Team' }]}
        title="LEADERSHIP TEAM"
        showSearch={false}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Board of Directors</h2>
            <div className="w-24 h-1 bg-fitis-gold mx-auto rounded-full"></div>
            <p className="mt-6 text-slate-400 max-w-2xl mx-auto text-lg">
              Meet the visionary leaders driving innovation, shaping strategies, and guiding our organization towards excellence.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-gold"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              No leadership members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-slate-800 shadow-2xl group-hover:border-fitis-gold transition-colors duration-300 relative bg-slate-800">
                      {member.image_url ? (
                        <img
                          src={getImageUrl(member.image_url)}
                          alt={member.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      {/* Fallback Initials */}
                      <div className={`w-full h-full flex items-center justify-center text-5xl font-bold text-slate-400 ${member.image_url ? 'hidden' : ''}`}>
                        {member.name.charAt(0)}
                      </div>
                    </div>

                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-2 right-2 w-10 h-10 bg-fitis-gold text-slate-900 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-yellow-400"
                        title={`LinkedIn profile of ${member.name}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </a>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1 text-center group-hover:text-fitis-gold transition-colors">{member.name}</h3>
                  <p className="text-fitis-gold font-medium text-sm text-center mb-2 uppercase tracking-wide">{member.designation}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
