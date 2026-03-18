import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Linkedin } from 'lucide-react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { SectionHeader } from '../components/SectionHeader';
import { getImageUrl } from '../utils/getImageUrl';

export const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [chapter, setChapter] = useState<any>(null);
  const [committee, setCommittee] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const resChapter = await fetch(`${baseUrl}/api/chapters/${slug}?status=published`);
        if (!resChapter.ok) throw new Error('Chapter not found');
        const chapterData = await resChapter.json();

        // Parse objectives_json
        if (chapterData.objectives_json) {
            try {
                chapterData.objectives_json = JSON.parse(chapterData.objectives_json);
            } catch (e) {
                // Ignore parse errors if it's already an array or invalid
            }
        } else {
             chapterData.objectives_json = [];
        }

        setChapter(chapterData);

        const resComm = await fetch(`${baseUrl}/api/chapters/${slug}/committee?status=published`);
        if (resComm.ok) {
          const commData = await resComm.json();
          setCommittee(commData);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-40">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-blue"></div>
      </div>
    );
  }

  if (error || !chapter) {
    return <Navigate to="/Chapter/chapters" replace />;
  }

  return (
    <div className="bg-white min-h-screen pb-20 font-sans">
      <SubHeaderBar
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Chapters', href: '/Chapter/chapters' },
          { label: chapter.name }
        ]}
        title={chapter.name.toUpperCase()}
        showSearch={false}
      />

      {/* Section 1: ABOUT + OBJECTIVES */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <SectionHeader title="About" className="text-left md:text-left [&>div]:mx-0 mb-8" />
            <div
              className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: chapter.about_html || '' }}
            />
          </div>
          <div>
            <SectionHeader title="Objectives" className="text-left md:text-left [&>div]:mx-0 mb-8" />
            <ul className="grid sm:grid-cols-2 gap-4">
              {(Array.isArray(chapter.objectives_json) ? chapter.objectives_json : []).map((obj: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-fitis-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{i + 1}</span>
                  </div>
                  <span className="text-slate-700">{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 2: CHAIRMAN MESSAGE */}
      {chapter.chairman_message_html && (
        <section className="py-16 md:py-24 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader title="CHAPTER CHAIRMAN'S MESSAGE" className="mb-16" />

            <div className="flex flex-col lg:flex-row gap-12 items-start max-w-5xl mx-auto">
              {/* Photo & Name */}
              <div className="w-full lg:w-1/3 flex flex-col items-center flex-shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-6 relative group">
                  <img
                    src={getImageUrl(chapter.chairman_photo_url)}
                    alt={chapter.chairman_name || 'Chairman'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Photo';
                    }}
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">{chapter.chairman_name}</h3>
                  <p className="text-fitis-blue font-medium">{chapter.chairman_designation}</p>
                </div>
              </div>

              {/* Message */}
              <div className="w-full lg:w-2/3 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 relative">
                <span className="absolute -top-6 -left-4 text-7xl text-fitis-blue/10 font-serif leading-none select-none">"</span>
                <div
                  className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: chapter.chairman_message_html || '' }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section 3: CHAPTER EXECUTIVE COMMITTEE */}
      {committee.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader title="CHAPTER EXECUTIVE COMMITTEE" className="mb-16" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
              {committee.map((member, idx) => (
                <motion.div
                  key={member.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col h-full"
                >
                  <div className="w-full aspect-[4/5] relative bg-slate-100 overflow-hidden">
                    <img
                      src={getImageUrl(member.image_url)}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/300x400?text=No+Photo';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow relative">
                    {/* Role Badge overlapping the image slightly */}
                    {member.role_label && (
                      <div className="absolute -top-4 right-4 bg-fitis-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {member.role_label}
                      </div>
                    )}

                    <h4 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{member.name}</h4>
                    {member.designation && <p className="text-sm font-medium text-slate-500 mb-1">{member.designation}</p>}
                    {member.company && <p className="text-sm text-slate-600 mb-4">{member.company}</p>}

                    <div className="mt-auto pt-4 flex gap-3 border-t border-slate-50">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-colors"
                          aria-label={`${member.name}'s LinkedIn`}
                        >
                          <Linkedin size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Band */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Interested in Joining {chapter.name}?</h2>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
            Become a part of our growing community and contribute to the advancement of Sri Lanka's digital economy.
          </p>
          <Link
            to="/Home/become-a-member"
            className="inline-block px-8 py-4 bg-fitis-blue text-white rounded-xl font-bold text-lg hover:bg-fitis-blue-light transition-colors"
          >
            Apply for Membership
          </Link>
        </div>
      </section>

    </div>
  );
};
