import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';
import { SectionHeader } from '../components/SectionHeader';

const ChapterDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChapter();
  }, [slug]);

  const fetchChapter = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';

      const res = await fetch(`${apiUrl}/api/chapters/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch chapter details');

      const detailData = await res.json();
      setChapter(detailData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-600">Loading chapter details...</div>;
  if (error || !chapter) return <div className="py-20 text-center text-red-600">Chapter not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner / Header */}
      {chapter.banner_image_url ? (
        <div className="relative h-[400px] w-full">
          <img src={getImageUrl(chapter.banner_image_url)} alt={chapter.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8 lg:p-16">
            <div className="max-w-7xl mx-auto w-full">
              <nav className="text-sm text-gray-300 mb-4 font-medium flex space-x-2">
                <Link to="/" className="hover:text-white transition">Home</Link>
                <span>›</span>
                <Link to="/Chapter/chapters" className="hover:text-white transition">Chapters</Link>
                <span>›</span>
                <span className="text-white">{chapter.name}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{chapter.name}</h1>
            </div>
          </div>
        </div>
      ) : (
        <SectionHeader
          title={chapter.name}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">

        {/* About Section */}
        {chapter.about_chapter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 relative inline-block">
              About the Chapter
              <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-blue-600 rounded-full"></div>
            </h2>
            <div
              className="prose prose-lg prose-blue max-w-none text-gray-700 break-words overflow-hidden text-justify [&_p]:mb-4 [&_p:last-child]:mb-0 [&_p:empty]:h-6"
              dangerouslySetInnerHTML={{ __html: chapter.about_chapter }}
            />
          </motion.div>
        )}

        {/* Chairman Message */}
        {(chapter.chair_name || chapter.chair_message) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-blue-900 rounded-3xl overflow-hidden shadow-xl text-white">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="col-span-1 bg-blue-800 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 mb-6 shadow-lg">
                    {chapter.chair_image_url ? (
                      <img src={getImageUrl(chapter.chair_image_url)} alt={chapter.chair_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-700 flex items-center justify-center text-5xl font-bold">
                        {chapter.chair_name?.charAt(0) || 'P'}
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{chapter.chair_name}</h3>
                  <p className="text-blue-200 font-medium">{chapter.chair_title}</p>
                </div>

                <div className="col-span-2 p-8 md:p-12 flex flex-col justify-center">
                  <svg className="w-12 h-12 text-blue-500 mb-6 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6.3c.7-2.3 2.9-4 5.7-4V8zm16 0c-3.3 0-6 2.7-6 6v10h10V14h-7.7c.7-2.3 2.9-4 5.7-4V8z"></path>
                  </svg>
                  <div className="text-lg md:text-xl leading-relaxed text-blue-50 font-light italic whitespace-pre-wrap text-justify">
                    {chapter.chair_message}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Executive Committee */}
        {Boolean(chapter.has_committee) && chapter.committee && chapter.committee.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Executive Committee</h2>
              <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {chapter.committee.map((member: any, index: number) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 group">
                  <div className="h-2 bg-blue-600"></div>
                  <div className="p-6 text-center">
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-6 border-4 border-gray-50 shadow-sm">
                      {member.image_url ? (
                        <img src={getImageUrl(member.image_url)} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-3xl font-bold text-gray-400">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>

                    {member.role_label && (
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-3">
                        {member.role_label}
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    {member.designation && <p className="text-gray-600 font-medium text-sm mb-1">{member.designation}</p>}
                    {member.company && <p className="text-gray-500 text-sm mb-4">{member.company}</p>}

                    {member.linkedin_url && (
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export { ChapterDetail };

