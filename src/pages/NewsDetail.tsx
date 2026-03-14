import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowLeft, Facebook, Twitter, Linkedin, Link as LinkIcon, Download, FileText, Loader, ArrowRight } from 'lucide-react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { getImageUrl } from '../utils/getImageUrl';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  banner_image_url: string;
  pdf_url: string;
  category: string;
  publish_date: string;
  author: string;
  updated_at?: string;
}

export const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/news/${slug}?t=${new Date().getTime()}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Article not found');
          throw new Error('Failed to load news article');
        }
        const data = await res.json();
        setNews(data);

        // Fetch related news
        const relatedRes = await fetch(`${baseUrl}/api/news/${slug}/related`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedNews(relatedData);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading article.');
      } finally {
        setIsLoading(false);
      }
    };

    // reset scroll when slug changes
    window.scrollTo(0, 0);
    fetchNewsDetail();
  }, [slug, baseUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bannerUrl = news?.banner_image_url ? getImageUrl(news.banner_image_url, news.updated_at ? new Date(news.updated_at).getTime() : undefined) : 'https://picsum.photos/1200/600';
  const pdfUrl = news?.pdf_url ? getImageUrl(news.pdf_url, news.updated_at ? new Date(news.updated_at).getTime() : undefined) : null;

  return (
    <article className="min-h-screen bg-slate-50 pb-20">

      {/* Global Top Bar */}
      <SubHeaderBar
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/Home/news' },
          { label: news?.title || 'Loading...' }
        ]}
        title="FITIS PRESS ROOM"
        showSearch={false}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center pt-32 pb-20 text-slate-500">
          <Loader className="animate-spin text-fitis-blue mb-4" size={40} />
          <p className="font-medium">Loading article...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="min-h-[50vh] flex flex-col items-center justify-center px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Oops!</h2>
          <p className="text-slate-600 mb-8">{error || 'Article not found'}</p>
          <Link to="/Home/news" className="text-fitis-blue font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to News
          </Link>
        </div>
      )}

      {!isLoading && !error && news && (
        <>
          {/* Main Content Layout */}
          <div className="max-w-4xl mx-auto px-6 pt-12">

            {/* Centered Content Card */}
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-slate-100">

              <div className="p-8 md:p-12 pb-8">
                {/* Date & Category */}
                <div className="flex items-center gap-4 text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                  <span className="text-fitis-blue">{news.category}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {news.publish_date ? new Date(news.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-[1.15] mb-8">
                  {news.title}
                </h1>

                {/* Share Icons Row */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <span className="text-sm font-semibold text-slate-400 mr-2">Share:</span>

                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                     target="_blank" rel="noopener noreferrer"
                     className="bg-slate-100 hover:bg-[#1877F2] hover:text-white text-slate-600 p-2.5 rounded-full transition-colors">
                    <Facebook size={18} />
                  </a>

                  <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(news.title)}`}
                     target="_blank" rel="noopener noreferrer"
                     className="bg-slate-100 hover:bg-[#1DA1F2] hover:text-white text-slate-600 p-2.5 rounded-full transition-colors">
                    <Twitter size={18} />
                  </a>

                  <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                     target="_blank" rel="noopener noreferrer"
                     className="bg-slate-100 hover:bg-[#0A66C2] hover:text-white text-slate-600 p-2.5 rounded-full transition-colors">
                    <Linkedin size={18} />
                  </a>

                  <button onClick={handleCopyLink}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2.5 rounded-full transition-colors"
                          title="Copy Link">
                    <LinkIcon size={18} className={copied ? "text-green-500" : ""} />
                  </button>
                  {copied && <span className="text-xs text-green-600 font-medium ml-2">Copied!</span>}
                </div>
              </div>

              {/* Full Banner Image */}
              <div className="w-full h-[40vh] md:h-[50vh] bg-slate-100">
                <img src={bannerUrl} alt={news.title} loading="lazy" onError={(e) => { e.currentTarget.src = 'https://picsum.photos/1200/600'; }} className="w-full h-full object-cover" />
              </div>

              <div className="p-8 md:p-12">
                {/* Content */}
                <div
                  className="prose prose-lg prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-fitis-blue hover:prose-a:text-blue-800 prose-img:rounded-xl max-w-none mb-12"
                  dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }}
                />

                {/* Embedded PDF Viewer Section */}
                {pdfUrl && (
                  <div className="mt-16 border-t border-slate-100 pt-10">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="bg-red-100 text-red-600 p-4 rounded-xl shadow-sm"><FileText size={28} /></div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">Press Release Document</h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">View the official PDF attachment</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <a href={pdfUrl} download className="bg-white border border-slate-200 hover:border-fitis-blue text-slate-700 hover:text-fitis-blue font-bold py-2.5 px-5 rounded-xl transition-all flex items-center gap-2 shadow-sm">
                          <Download size={18} /> Download
                        </a>
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-fitis-blue hover:bg-blue-800 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md">
                          View PDF
                        </a>
                      </div>
                    </div>

                    <div className="w-full aspect-[1/1.4] bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 shadow-inner hidden md:block">
                      <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full" title="PDF Viewer" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Posts Section */}
            {relatedNews.length > 0 && (
              <div className="mt-20">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-display font-bold text-slate-900 border-l-4 border-fitis-gold pl-4">Related News</h3>
                  <Link to="/Home/news" className="text-fitis-blue font-semibold hover:underline flex items-center gap-2 text-sm">
                    View All <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {relatedNews.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 group flex flex-col"
                    >
                      <Link to={`/Home/news/${item.slug}`} className="block relative h-48 overflow-hidden">
                        <img
                          src={item.banner_image_url ? getImageUrl(item.banner_image_url, item.updated_at ? new Date(item.updated_at).getTime() : undefined) : 'https://picsum.photos/400/300'}
                          alt={item.title}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/300'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded text-[10px] font-bold text-fitis-blue uppercase tracking-wider">
                          {item.category}
                        </div>
                      </Link>
                      <div className="p-5 flex flex-col flex-1">
                        <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                          {item.publish_date ? new Date(item.publish_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-fitis-blue transition-colors">
                          <Link to={`/Home/news/${item.slug}`}>{item.title}</Link>
                        </h4>
                        <div className="mt-auto pt-4 border-t border-slate-50">
                          <Link to={`/Home/news/${item.slug}`} className="text-fitis-blue text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </>
      )}
    </article>
  );
};
