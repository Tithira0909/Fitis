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
  updated_at?: string;
}

const MemberCard = ({ member }: { member: LeadershipMember }) => {
  const [imgError, setImgError] = React.useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const imgUrl = getImageUrl(member.image_url, member.updated_at ? new Date(member.updated_at).getTime() : undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center group w-36 md:w-48"
    >
      <div className="relative mb-4 w-[90px] h-[90px] md:w-[120px] md:h-[120px]">
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="w-full h-full rounded-full border-[3px] border-white overflow-hidden shadow-xl bg-slate-800 flex items-center justify-center relative z-10">
          {!imgError && imgUrl ? (
            <img
              src={imgUrl}
              alt={member.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="text-2xl md:text-3xl font-bold text-slate-400">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>
      <div className="text-center px-2">
        <h4 className="font-bold text-white uppercase text-sm md:text-base leading-tight mb-1">
          {member.name}
        </h4>
        <p className="text-amber-500 font-semibold text-xs md:text-sm tracking-wide mb-2 leading-tight">
          {member.designation}
        </p>
        {member.linkedin_url && (
          <a
            href={member.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const LeadershipTeam = () => {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadershipYear, setLeadershipYear] = useState('2023/2024');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        
        // Fetch Settings for Year
        fetch(`${apiUrl}/api/site-settings`)
          .then(res => res.json())
          .then(data => {
            if (data && data.leadership_year) setLeadershipYear(data.leadership_year);
          })
          .catch(err => console.error('Failed to load site settings', err));

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

  // Group by hierarchy_level
  const groupedMembers = React.useMemo(() => {
    const groups: Record<number, LeadershipMember[]> = {};
    members.forEach(m => {
      if (!groups[m.hierarchy_level]) groups[m.hierarchy_level] = [];
      groups[m.hierarchy_level].push(m);
    });
    // Sort each group by seat
    Object.keys(groups).forEach(level => {
      groups[Number(level)].sort((a, b) => a.seat - b.seat);
    });
    return groups;
  }, [members]);

  const hierarchyLevels = Object.keys(groupedMembers).map(Number).sort((a, b) => a - b);

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
            <>
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-700 pb-6 mb-16 max-w-5xl mx-auto">
                <div className="flex-1"></div>
                <div className="flex-2 text-center text-amber-500 font-bold text-2xl tracking-wider">
                  {leadershipYear}
                </div>
                <div className="flex-1"></div>
              </div>

              <div className="space-y-16 md:space-y-20">
                {hierarchyLevels.map((level) => (
                  <div
                    key={level}
                    className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-16"
                  >
                    {groupedMembers[level].map((m) => (
                      <MemberCard key={m.id} member={m} />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

