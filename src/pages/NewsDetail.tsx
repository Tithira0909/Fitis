import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, ArrowLeft, Facebook, Twitter, Linkedin, Link as LinkIcon, Download, FileText, Loader } from 'lucide-react';

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
}

export const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading article.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNewsDetail();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50">
        <Loader className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Loading article...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Oops!</h2>
        <p className="text-slate-600 mb-8">{error || 'Article not found'}</p>
        <Link to="/Home/news" className="text-blue-600 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to News
        </Link>
      </div>
    );
  }

  const bannerUrl = news.banner_image_url ? (news.banner_image_url.startsWith('http') ? news.banner_image_url : `${baseUrl}${news.banner_image_url}`) : 'https://picsum.photos/1200/600';
  const pdfUrl = news.pdf_url ? (news.pdf_url.startsWith('http') ? news.pdf_url : `${baseUrl}${news.pdf_url}`) : null;

  return (
    <article className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <img src={bannerUrl} alt={news.title} className="w-full h-full object-cover object-center" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-5xl mx-auto flex flex-col justify-end">
          <Link to="/Home/news" className="text-blue-400 hover:text-white font-semibold flex items-center gap-2 mb-6 w-fit transition-colors text-sm uppercase tracking-wide">
            <ArrowLeft size={16} /> Back to all news
          </Link>

          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
              <Tag size={12} /> {news.category}
            </span>
            <span className="text-slate-300 flex items-center gap-1.5 text-sm font-medium">
              <Calendar size={14} /> {news.publish_date ? new Date(news.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 shadow-sm">
            {news.title}
          </h1>
          {news.author && (
            <p className="text-slate-300 font-medium text-lg">By {news.author}</p>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20 flex flex-col lg:flex-row gap-12 lg:gap-16">

        {/* Article Body */}
        <div className="lg:w-2/3 flex flex-col">

          {/* Excerpt */}
          <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed mb-10 border-l-4 border-blue-600 pl-6 italic">
            {news.excerpt}
          </p>

          {/* Content (Assuming basic newline separation, or dangerouslySetInnerHTML if HTML is allowed) */}
          <div className="prose prose-lg prose-slate prose-a:text-blue-600 max-w-none mb-12" dangerouslySetInnerHTML={{ __html: news.content.replace(/\n/g, '<br />') }} />

          {/* Embedded PDF Viewer */}
          {pdfUrl && (
            <div className="mt-12 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-0">
                  <div className="bg-red-100 text-red-600 p-3 rounded-lg"><FileText size={24} /></div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Attached Document</h3>
                    <p className="text-sm text-slate-500">Read or download the full report</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all">
                     Open PDF
                  </a>
                  <a href={pdfUrl} download className="bg-blue-600 text-white hover:bg-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-md transition-all">
                     <Download size={18} /> Download
                  </a>
                </div>
              </div>
              <div className="w-full aspect-[1/1.4] bg-slate-200 rounded-lg overflow-hidden border border-slate-300 relative group hidden md:block">
                 <iframe src={`${pdfUrl}#toolbar=0`} className="w-full h-full" title="PDF Document Viewer" />
                 <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-transform">
                      View Full Screen
                    </a>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3">
          <div className="sticky top-32 bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">Share this article</h3>
            <div className="flex flex-col gap-4">

              <button
                onClick={handleCopyLink}
                className={`w-full flex items-center justify-center gap-3 font-semibold py-3 px-4 rounded-xl transition-all ${copied ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
              >
                <LinkIcon size={18} /> {copied ? 'Link Copied!' : 'Copy Link'}
              </button>

              <a
                href={`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + currentUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                WhatsApp
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                <Facebook size={18} /> Facebook
              </a>

              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(news.title)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#1DA1F2] hover:bg-[#1a94df] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                <Twitter size={18} /> Twitter
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#0A66C2] hover:bg-[#095bb0] text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm"
              >
                <Linkedin size={18} /> LinkedIn
              </a>

            </div>
          </div>
        </div>

      </div>
    </article>
  );
};
