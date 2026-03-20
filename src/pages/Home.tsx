import { BoardMembers } from '../components/BoardMembers';
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Globe, 
  Briefcase, 
  Award, 
  Mail, 
  ArrowRight, 
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { GlobeHero } from '../components/GlobeHero';
import { ContactQuickBar } from '../components/ContactQuickBar';
import { SectionHeader } from '../components/SectionHeader';
import { getImageUrl } from '../utils/getImageUrl';
import { useEffect, useState } from 'react';

const ChairmanMessage = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/chairman-message`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error('Failed to load chairman message', err);
      }
    };
    fetchData();
  }, []);

  if (!data) return null;

  const truncate = (str: string, max: number) => {
    if (!str) return '';
    // Strip simple HTML tags for the excerpt just in case, though it's mostly plain text
    const plainText = str.replace(/<[^>]+>/g, '');
    return plainText.length > max ? plainText.substring(0, max) + '...' : plainText;
  };

  return (
    <section id="about" className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <Link to="/Home/chairman-message" className="block bg-slate-50 rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group cursor-pointer">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fitis-blue/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center relative z-10">
            {/* Left Column: Smaller Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="md:col-span-4 lg:col-span-3"
            >
              <div className="relative group">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img 
                    src={`${getImageUrl(data.photo_url)}?v=${data.updated_at || ''}`}
                    alt={data.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Photo'; }}
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-fitis-gold rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <Award className="text-white" size={24} />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Concise Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-8 lg:col-span-9"
            >
              <div className="mb-6">
                <h2 className="text-sm font-bold text-fitis-blue uppercase tracking-[0.3em] mb-2">CHAIRMAN'S MESSAGE</h2>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                  {data.message_title}
                </h3>
              </div>
              
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
                {truncate(data.message_body, 200)}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-lg font-bold text-slate-900 leading-none">{data.name}</p>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{data.designation}</p>
                  </div>
                </div>
                <span className="text-fitis-blue font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Read Full Message <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>
          </div>
        </Link>
      </div>
    </section>
  );
};

const NetworkMesh = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
      <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0066cc" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0066cc" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Simple static mesh for performance, but styled to look techy */}
        <g stroke="#0066cc" strokeWidth="0.5" strokeOpacity="0.3">
          <line x1="100" y1="100" x2="300" y2="150" />
          <line x1="300" y1="150" x2="200" y2="400" />
          <line x1="200" y1="400" x2="100" y2="100" />
          <line x1="300" y1="150" x2="500" y2="100" />
          <line x1="500" y1="100" x2="700" y2="200" />
          <line x1="700" y1="200" x2="500" y2="400" />
          <line x1="500" y1="400" x2="300" y2="150" />
          <line x1="700" y1="200" x2="900" y2="150" />
          <line x1="900" y1="150" x2="800" y2="450" />
          <line x1="800" y1="450" x2="700" y2="200" />
          <line x1="200" y1="400" x2="500" y2="400" />
          <line x1="500" y1="400" x2="800" y2="450" />
        </g>
        {/* Glowing Nodes */}
        {[
          [100, 100], [300, 150], [200, 400], [500, 100], 
          [700, 200], [500, 400], [900, 150], [800, 450]
        ].map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x ?? 0}
            cy={y ?? 0}
            r={4}
            fill="url(#nodeGlow)"
            initial={{ r: 4, opacity: 0.5 }}
            animate={{ r: [3, 5, 3], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2 + i % 3, repeat: Infinity }}
          />
        ))}
      </svg>
    </div>
  );
};

const FitisLogoWhite = () => (
  <div className="bg-white/90 p-4 rounded-xl inline-block shadow-lg backdrop-blur-md">
    <img src="/fitis-logo.png" alt="FITIS" className="w-auto h-16 md:h-20 object-contain" />
  </div>
);

const BoardSection = () => {
  const board = {
    top: [
      { name: "Indika De Zoysa", role: "Chairman" },
      { name: "Dr. Dayan Rajapakse", role: "Senior Vice Chairman" },
      { name: "Channa De Silva", role: "Vice Chairman" },
      { name: "Thariq Sanoon", role: "Vice Chairman" },
      { name: "Abbas Kamrudeen", role: "Past Chairman" },
      { name: "Tharmarajah Suresh", role: "Advisor" },
    ],
    middle: [
      { name: "Gnanam Sellathurrai", role: "President", sub: "ICT Infrastructure Chapter" },
      { name: "Sanjaya Dayananda", role: "President", sub: "Software Chapter" },
      { name: "Amila Bandara", role: "President", sub: "Education & Training Chapter" },
      { name: "Lakmal Embuldeniya", role: "President", sub: "Professional (ISACA) Chapter" },
      { name: "Ramanan Devairakam", role: "President", sub: "Communication Chapter" },
      { name: "Omar Sahib", role: "President", sub: "Digital Services Chapter" },
      { name: "Manjula Kulasuriya", role: "President", sub: "Office Automation Chapter" },
      { name: "Nagarajah Nirmalan", role: "President", sub: "Professional Consultants Chapter" },
    ],
    bottom: [
      { name: "Shanaka Fernando", role: "Vice President", sub: "Hardware Chapter" },
      { name: "Kalinga Ihalagedara", role: "Vice President", sub: "Software Chapter" },
      { name: "Dr. Sampath Kannangara", role: "Vice President", sub: "Education & Training Chapter" },
      { name: "Ashane Jayasekara", role: "Vice President", sub: "Professional (ISACA) Chapter" },
    ]
  };

  const MemberCard = ({ member, size = "md" }: { member: any, size?: "md" | "sm" }) => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center text-center group"
    >
      <div className={cn(
        "relative rounded-full border-[3px] border-white shadow-[0_0_20px_rgba(0,102,204,0.6)] overflow-hidden mb-4 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]",
        size === "md" ? "w-28 h-28 md:w-36 md:h-36" : "w-24 h-24 md:w-32 md:h-32"
      )}>
        <img 
          src={`https://picsum.photos/seed/${member.name}/400/400`} 
          alt={member.name} 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001a33]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h4 className="text-white font-bold text-[11px] md:text-sm uppercase tracking-wider mb-1.5 drop-shadow-md">
        {member.name}
      </h4>
      <p className="text-fitis-gold font-black text-[9px] md:text-[11px] uppercase leading-tight drop-shadow-sm">
        {member.role}
      </p>
      {member.sub && (
        <p className="text-fitis-gold font-bold text-[8px] md:text-[10px] uppercase leading-tight max-w-[140px] opacity-90">
          {member.sub}
        </p>
      )}
    </motion.div>
  );

  return (
    <section id="board" className="relative py-24 bg-gradient-to-br from-[#000d1a] via-[#001a33] to-[#000d1a] overflow-hidden">
      <NetworkMesh />
      
      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        {/* Poster Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-20 gap-10">
          <div className="lg:w-1/3">
            <FitisLogoWhite />
          </div>
          
          <div className="lg:w-1/3 text-center">
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-[0.2em] drop-shadow-2xl">
              Board Members
            </h2>
          </div>
          
          <div className="lg:w-1/3 text-right">
            <div className="text-fitis-gold font-black text-3xl md:text-5xl tracking-tighter drop-shadow-lg">
              2023/2024
            </div>
          </div>
        </div>

        {/* Members Grid */}
        <div className="space-y-20">
          {/* Top Row */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {board.top.map((m, i) => <MemberCard key={i} member={m} />)}
          </div>
          
          {/* Middle Row */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {board.middle.map((m, i) => <MemberCard key={i} member={m} size="sm" />)}
          </div>
          
          {/* Bottom Row */}
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {board.bottom.map((m, i) => <MemberCard key={i} member={m} size="sm" />)}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Industry Advocacy",
      desc: "Representing member interests at government policy levels to ensure a favorable business environment.",
      icon: ShieldCheck,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Global Networking",
      desc: "Connecting Sri Lankan tech firms with international markets through trade delegations and exhibitions.",
      icon: Globe,
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Capacity Building",
      desc: "Specialized training programs and workshops to upskill the local ICT workforce.",
      icon: Users,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Business Matchmaking",
      desc: "Facilitating B2B connections between startups, SMEs, and large enterprises.",
      icon: Briefcase,
      color: "bg-orange-50 text-orange-600"
    },
    {
      title: "Digital Transformation",
      desc: "Guiding traditional industries through their digital journey with expert consultancy.",
      icon: Cpu,
      color: "bg-fitis-blue/10 text-fitis-blue"
    },
    {
      title: "Awards & Recognition",
      desc: "Celebrating excellence in the ICT sector through national award ceremonies.",
      icon: Award,
      color: "bg-fitis-gold/10 text-fitis-gold"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Services Offered" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-3xl border border-slate-100 hover:border-fitis-blue/20 hover:shadow-2xl hover:shadow-fitis-blue/5 transition-all group"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110", service.color)}>
                <service.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MembershipCTA = () => {
  return (
    <section id="membership" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-fitis-blue rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fitis-gold/20 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                title="Become a Member of the Apex Body"
                className="text-left [&>h2]:text-white [&>h2]:text-3xl md:[&>h2]:text-4xl mb-6 [&>div]:mx-0"
              />
              <p className="text-white/80 text-lg mb-8 leading-relaxed mt-4">
                Join the most influential network of ICT professionals and organizations in Sri Lanka. Gain access to exclusive resources, networking events, and policy advocacy.
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Access to FITIS Digital Excellence Awards",
                  "Participation in International Trade Fairs",
                  "Government Policy Advocacy Representation",
                  "Exclusive B2B Networking Opportunities"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-white">
                    <CheckCircle2 className="text-fitis-gold" size={20} />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <button className="bg-white text-fitis-blue px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                Apply for Membership
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 pt-12">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-1">200+</p>
                    <p className="text-white/60 text-sm uppercase font-bold tracking-wider">Members</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-1">30+</p>
                    <p className="text-white/60 text-sm uppercase font-bold tracking-wider">Years</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-fitis-gold p-6 rounded-3xl shadow-xl">
                    <p className="text-3xl font-bold text-fitis-blue mb-1">10k+</p>
                    <p className="text-fitis-blue/60 text-sm uppercase font-bold tracking-wider">Professionals</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10">
                    <p className="text-3xl font-bold text-white mb-1">50+</p>
                    <p className="text-white/60 text-sm uppercase font-bold tracking-wider">Partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface Partner {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
}

const PartnersSection = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/partners`);
        if (res.ok) {
          const data = await res.json();
          setPartners(data);
        }
      } catch (error) {
        console.error('Failed to load partners', error);
      }
    };
    fetchPartners();
  }, []);

  return (
    <section id="partners" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader title="Partnerships & Affiliations" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {partners.map((partner, idx) => {
            const innerContent = (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all border border-slate-100 group hover:shadow-md cursor-pointer overflow-hidden"
              >
                {partner.logo_url ? (
                  <img
                    src={getImageUrl(partner.logo_url)}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-slate-400 font-bold text-sm text-center group-hover:text-fitis-blue transition-colors uppercase tracking-widest">{partner.name}</span>
                )}
              </motion.div>
            );

            return partner.website_url ? (
              <a
                key={partner.id}
                href={partner.website_url.startsWith('http') ? partner.website_url : `https://${partner.website_url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {innerContent}
              </a>
            ) : (
              <div key={partner.id}>
                {innerContent}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-20 h-20 bg-fitis-blue/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="text-fitis-blue" size={32} />
        </div>
        <SectionHeader title="Stay Updated with the ICT Ecosystem" className="mb-6" />
        <p className="text-slate-600 mb-10 text-lg mt-4">
          Subscribe to our monthly newsletter for industry insights, policy updates, and upcoming event announcements.
        </p>
        <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 px-6 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-fitis-blue/20 focus:border-fitis-blue transition-all bg-white"
            required
          />
          <button className="bg-fitis-blue text-white px-8 py-4 rounded-xl font-bold hover:bg-fitis-blue-light transition-all shadow-lg active:scale-95">
            Subscribe Now
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">We respect your privacy. Unsubscribe at any time.</p>
      </div>
    </section>
  );
};

export const Home = () => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/site-settings`);
        if (res.ok) {
          const data = await res.json();
          setSiteSettings(data);
        }
      } catch (error) {
        console.error('Failed to load site settings', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <>
      <GlobeHero />
      {siteSettings && (
        <ContactQuickBar
          site_phone={siteSettings.site_phone}
          site_email={siteSettings.site_email}
          facebook_url={siteSettings.facebook_url}
          instagram_url={siteSettings.instagram_url}
          linkedin_url={siteSettings.linkedin_url}
          twitter_url={siteSettings.twitter_url}
          youtube_url={siteSettings.youtube_url}
        />
      )}
      <ChairmanMessage />
      <BoardMembers />
      <ServicesSection />
      <MembershipCTA />
      <PartnersSection />
      <Newsletter />
    </>
  );
};
