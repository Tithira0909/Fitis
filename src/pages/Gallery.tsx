import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, X, Loader, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  id: number;
  image_url: string;
  sort_order: number;
}

interface GalleryPost {
  id: number;
  title: string;
  description: string;
  event_date: string;
  cover_image?: string;
  images?: GalleryImage[]; // Fetched dynamically on detail view
}

export const Gallery = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [selectedPost, setSelectedPost] = useState<GalleryPost | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/gallery?t=${new Date().getTime()}`);
        if (!res.ok) throw new Error('Failed to load gallery');
        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Error loading gallery.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const openModal = async (post: GalleryPost) => {
    setSelectedPost(post);
    setCurrentImageIndex(0);
    setIsModalLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/gallery/${post.id}`);
      if (!res.ok) throw new Error('Failed to load images');
      const data = await res.json();
      setSelectedPost(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const nextImage = () => {
    if (selectedPost?.images && currentImageIndex < selectedPost.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = () => {
    if (selectedPost?.images && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-white min-h-screen">

      {/* Hero Header */}
      <section className="pt-32 pb-16 px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold text-slate-900 mb-6 tracking-tight"
          >
            Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Explore the memorable moments, industry events, and technological milestones from the Federation of Information Technology Industry Sri Lanka.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader className="animate-spin mb-4" size={32} />
              <p>Loading gallery...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
              <p>No gallery items available at the moment.</p>
            </div>
          )}

          {/* Masonry/Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => openModal(post)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={post.cover_image ? (post.cover_image.startsWith('http') ? post.cover_image : `${baseUrl}${post.cover_image}`) : 'https://picsum.photos/600/400'}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                    {post.description}
                  </p>

                  {post.event_date && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium uppercase tracking-wider mt-auto pt-4 border-t border-slate-50">
                      <Calendar size={14} />
                      <span>{new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/50 hover:text-white p-2 bg-black/50 rounded-full transition-colors z-50"
            >
              <X size={24} />
            </button>

            {isModalLoading ? (
              <Loader className="animate-spin text-white" size={48} />
            ) : (
              <div className="w-full h-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 bg-transparent relative">

                {/* Image Carousel Viewer */}
                <div className="flex-1 relative flex items-center justify-center h-[50vh] lg:h-full bg-black/20 rounded-2xl overflow-hidden border border-white/10 group">
                  {selectedPost.images && selectedPost.images.length > 0 ? (
                    <>
                      <img
                        key={selectedPost.images[currentImageIndex].id}
                        src={selectedPost.images[currentImageIndex].image_url.startsWith('http') ? selectedPost.images[currentImageIndex].image_url : `${baseUrl}${selectedPost.images[currentImageIndex].image_url}`}
                        alt={selectedPost.title}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl"
                      />

                      {/* Controls */}
                      {selectedPost.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            disabled={currentImageIndex === 0}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md disabled:opacity-20 transition-all shadow-lg"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            disabled={currentImageIndex === selectedPost.images.length - 1}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md disabled:opacity-20 transition-all shadow-lg"
                          >
                            <ChevronRight size={24} />
                          </button>

                          {/* Image Counter */}
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white/80 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md">
                            {currentImageIndex + 1} / {selectedPost.images.length}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="text-white/50 flex flex-col items-center gap-4">
                      <ImageIcon size={48} className="opacity-20" />
                      <p>No images available for this gallery.</p>
                    </div>
                  )}
                </div>

                {/* Info Panel */}
                <div className="lg:w-96 flex flex-col h-auto lg:h-full justify-center bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                  <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4">
                    {selectedPost.title}
                  </h2>

                  {selectedPost.event_date && (
                    <div className="flex items-center gap-2 text-white/40 text-sm font-medium uppercase tracking-wider mb-6">
                      <Calendar size={14} />
                      <span>{new Date(selectedPost.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  )}

                  <div className="w-12 h-1 bg-blue-500 mb-6 rounded-full" />

                  <p className="text-white/70 leading-relaxed overflow-y-auto pr-2 custom-scrollbar">
                    {selectedPost.description}
                  </p>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
