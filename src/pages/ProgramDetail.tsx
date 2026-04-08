import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getImageUrl } from '../utils/getImageUrl';
import { SectionHeader } from '../components/SectionHeader';
import { ArrowLeft, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface ProgramItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  banner_image_url: string;
  read_more_url: string;
  updated_at?: string;
}

export const ProgramDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [program, setProgram] = useState<ProgramItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res = await fetch(`${apiUrl}/api/programs/${slug}`);

        if (!res.ok) throw new Error('Program not found');

        const data = await res.json();
        setProgram(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-blue"></div>
    </div>
  );

  if (error || !program) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <h2 className="text-3xl font-bold text-slate-800 mb-4">Program Not Found</h2>
      <p className="text-slate-600 mb-8">{error || "The program you're looking for doesn't exist or has been removed."}</p>
      <Link to="/Home/programs" className="px-6 py-3 bg-fitis-blue text-white font-bold rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-2">
        <ArrowLeft size={20} /> Back to Programs
      </Link>
    </div>
  );

  const shareUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner Area */}
      <div className="bg-slate-900 pt-32 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/Home/programs" className="inline-flex items-center text-slate-300 hover:text-white font-medium mb-8 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Back to Programs
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            {program.title}
          </motion.h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100"
        >
          {/* Main Flyer Image */}
          {program.banner_image_url && (
            <div className="w-full bg-slate-100 border-b border-slate-100">
              <img
                src={getImageUrl(program.banner_image_url, program.updated_at ? new Date(program.updated_at).getTime() : undefined)}
                alt={program.title}
                className="w-full h-auto object-contain max-h-[800px] mx-auto"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
          )}

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Share & Actions Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Share</span>
                <div className="flex items-center gap-2">
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-600 transition-colors">
                    <Facebook size={18} />
                  </a>
                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(program.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-500 transition-colors">
                    <Twitter size={18} />
                  </a>
                  <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(program.title)}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <button onClick={copyToClipboard} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors" title="Copy Link">
                    <LinkIcon size={18} />
                  </button>
                </div>
              </div>

              {program.read_more_url && program.read_more_url.trim() !== '' && (
                <a
                  href={program.read_more_url}
                  target={program.read_more_url.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-fitis-blue text-white font-bold rounded-xl hover:bg-blue-800 transition-colors shadow-sm hover:shadow"
                >
                  Visit External Link
                </a>
              )}
            </div>

            {/* Description text */}
            <div className="prose prose-lg prose-slate max-w-none prose-headings:text-fitis-blue prose-a:text-fitis-blue">
              {/* If it contains HTML, render as HTML, else split by newline */}
              {program.description.includes('<') && program.description.includes('>') ? (
                <div dangerouslySetInnerHTML={{ __html: program.description }} />
              ) : (
                program.description.split('\n').map((paragraph, idx) => (
                  paragraph.trim() ? <p key={idx} className="mb-4 text-slate-700 leading-relaxed">{paragraph}</p> : <br key={idx} />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

