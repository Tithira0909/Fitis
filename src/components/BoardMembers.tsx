import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';
import { SectionHeader } from './SectionHeader';

interface LeadershipMember {
  id: number;
  name: string;
  designation: string;
  type: 'current' | 'past';
  image_url: string;
  linkedin_url: string;
  hierarchy_level: number;
  seat: number;
  updated_at?: string;
}

const SkeletonCard = () => (
  <div className="flex flex-col items-center animate-pulse w-32 md:w-40">
    <div className="w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full bg-slate-700/50 mb-4" />
    <div className="h-4 w-24 bg-slate-700/50 rounded mb-2" />
    <div className="h-3 w-20 bg-slate-700/50 rounded" />
  </div>
);

const MemberCard = ({ member, key }: { member: LeadershipMember, key?: React.Key }) => {
  const [imgError, setImgError] = useState(false);

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
        {/* Glow effect */}
        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Avatar Container */}
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
            <Linkedin size={18} />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export const BoardMembers = () => {
  const [members, setMembers] = useState<LeadershipMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/leadership-members?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error('Failed to fetch board members');
        const data = await res.json();
        // Filter only current members
        const currentMembers = data.filter((m: LeadershipMember) => m.type === 'current');
        setMembers(currentMembers);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Error loading board members.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeadership();
  }, []);

  // Group by hierarchy_level
  const groupedMembers = useMemo(() => {
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
    <section id="board" className="py-24 bg-[#0a1128] relative overflow-hidden">
      {/* Network Lines / Subtle Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/10 pb-6 mb-16">
          <div className="flex-1 flex justify-start mb-4 md:mb-0">
             {/* Logo Placeholder - You could use an image if available */}
             <div className="flex items-center gap-2 text-white">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">F</div>
                <span className="font-display font-bold text-xl tracking-tighter">FITIS</span>
             </div>
          </div>

          <div className="flex-2 text-center mb-4 md:mb-0">
             <SectionHeader
               title="Board Members"
               className="mb-0 [&>h2]:text-white [&>h2]:text-2xl md:[&>h2]:text-4xl [&>h2]:tracking-widest [&>div]:mb-0 [&>p]:hidden"
             />
          </div>

          <div className="flex-1 flex justify-end">
            <span className="text-amber-500 font-bold text-xl md:text-2xl tracking-wider">
              2023/2024
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-16 md:space-y-20">
          {isLoading ? (
            // Skeleton Loading State
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
               {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            // Error State
            <div className="text-center text-red-400 p-8 border border-red-400/20 rounded-lg bg-red-400/5">
              <p>{error}</p>
            </div>
          ) : members.length === 0 ? (
            // Empty State
            <div className="text-center text-slate-400 p-8">
              Leadership information is currently being updated.
            </div>
          ) : (
            // Render Grouped Rows
            hierarchyLevels.map((level) => (
              <div
                key={level}
                className="flex flex-wrap justify-center gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-16"
              >
                {groupedMembers[level].map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
