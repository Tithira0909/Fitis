import React, { useEffect, useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';
import { Linkedin, Facebook } from 'lucide-react';

interface SecretariatMember {
  id: number;
  name: string;
  role: string;
  photo_url: string;
  linkedin_url: string;
  facebook_url: string;
  sort_order: number;
}

export const SecretariatTeam = () => {
  const [members, setMembers] = useState<SecretariatMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const res = await fetch(`${baseUrl}/api/secretariat-team`);
        if (res.ok) {
          const data = await res.json();
          setMembers(data);
        }
      } catch (error) {
        console.error('Failed to load secretariat team', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Secretariat Team' }]}
        title="SECRETARIAT TEAM"
        showSearch={false}
      />
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">SECRETARIAT TEAM</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Meet the dedicated team that drives the daily operations and initiatives of FITIS. Their commitment and expertise ensure the seamless execution of our goals.
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            </div>
          ) : members.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member) => (
                <div key={member.id} className="flex flex-col group">

                  {/* Photo Container */}
                  <div className="relative rounded-lg overflow-hidden shadow-md mb-4 aspect-[4/5] bg-white">
                    {member.photo_url ? (
                      <img
                        src={getImageUrl(member.photo_url)}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0D8ABC&color=fff&size=512`; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-5xl">
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    {/* Overlay Bar for Social Icons */}
                    {(member.linkedin_url || member.facebook_url) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm py-3 px-4 flex justify-center space-x-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-blue-400 transition-colors"
                            title="LinkedIn Profile"
                          >
                            <Linkedin size={20} fill="currentColor" />
                          </a>
                        )}
                        {member.facebook_url && (
                          <a
                            href={member.facebook_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-blue-500 transition-colors"
                            title="Facebook Profile"
                          >
                            <Facebook size={20} fill="currentColor" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="text-center px-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{member.name}</h3>
                    <p className="text-sm font-medium text-blue-700">{member.role}</p>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <p>No secretariat team members found.</p>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};
