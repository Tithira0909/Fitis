import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronLeft, ChevronRight, X, Loader, Image as ImageIcon } from 'lucide-react';
import { getImageUrl } from '../utils/getImageUrl';
import { SubHeaderBar } from '../components/SubHeaderBar';

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
  updated_at?: string;
}

export const Gallery = () => {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      const res = await fetch(`${baseUrl}/api/gallery/${post.id}?t=${new Date().getTime()}`);
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

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="bg-white min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery' }]}
        title="GALLERY"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content */}
      <section className="py-16 px-6 pt-12">
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

          {!isLoading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-20 text-slate-500 bg-white rounded-xl shadow-sm border border-slate-100">
              <p>No gallery items found.</p>
            </div>
          )}

          {/* Detailed Full-Section Layout Per Post */}
          <div className="flex flex-col gap-16">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 flex flex-col"
              >
                {/* Post Header */}
                <div className="p-8 lg:p-10 border-b border-slate-100">
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">{post.title}</h2>
                  <div className="flex items-center gap-4 text-slate-500 mb-6">
                    {post.event_date && (
                      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                        <Calendar size={16} className="stroke-[2]" />
                        <span>{new Date(post.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 text-lg leading-relaxed max-w-4xl">
                    {post.description}
                  </p>
                </div>

                {/* Media Section */}
                <div className="p-8 lg:p-10 bg-slate-50 flex flex-col lg:flex-row gap-6">
                  {/* Main Large Image */}
                  <div
                    className="lg:w-3/4 relative rounded-2xl overflow-hidden aspect-video bg-slate-200 cursor-pointer shadow-md"
                    onClick={() => openModal(post)}
                  >
                    <img
                      src={getImageUrl(post.cover_image, post.id)}
                      alt={post.title}
                      loading="lazy"
                      onError={(e) => { e.currentTarget.src = 'https://picsum.photos/1200/800'; }}
                      className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-500"
                    />
                    {post.images && post.images.length > 1 && (
                      <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <ImageIcon size={16} />
                        View All {post.images.length} Photos
                      </div>
                    )}
                  </div>

                  {/* Vertical Thumbnail Strip */}
                  <div className="lg:w-1/4 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                    {post.images && post.images.slice(0, 4).map((img, imgIdx) => (
                      <div
                        key={img.id}
                        className="relative rounded-xl overflow-hidden min-w-[140px] lg:min-w-0 aspect-[4/3] cursor-pointer group shadow-sm border border-slate-200"
                        onClick={() => openModal(post)}
                      >
                        <img
                          src={getImageUrl(img.image_url, img.id)}
                          alt={`Thumbnail ${imgIdx + 1}`}
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/300'; }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        {/* Overlay for the 4th image if there are more */}
                        {imgIdx === 3 && post.images!.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white font-bold text-xl">+{post.images!.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    {(!post.images || post.images.length === 0) && post.cover_image && (
                      <div
                        className="relative rounded-xl overflow-hidden min-w-[140px] lg:min-w-0 aspect-[4/3] cursor-pointer group shadow-sm border border-slate-200"
                        onClick={() => openModal(post)}
                      >
                         <img
                          src={getImageUrl(post.cover_image, post.id)}
                          alt="Thumbnail 1"
                          loading="lazy"
                          onError={(e) => { e.currentTarget.src = 'https://picsum.photos/400/300'; }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                  </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-white/70 hover:text-white p-2 transition-colors z-50"
            >
              <X size={28} />
            </button>

            {isModalLoading ? (
              <Loader className="animate-spin text-white" size={48} />
            ) : (
              <div className="w-full h-[85vh] max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 bg-transparent relative">

                {/* Image Carousel Viewer */}
                <div className="flex-1 relative flex items-center justify-center h-full bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl group">
                  {selectedPost.images && selectedPost.images.length > 0 ? (
                    <>
                      <img
                        key={selectedPost.images[currentImageIndex].id}
                        src={getImageUrl(selectedPost.images[currentImageIndex].image_url, selectedPost.images[currentImageIndex].id)}
                        alt={selectedPost.title}
                        onError={(e) => { e.currentTarget.src = 'https://picsum.photos/1200/800'; }}
                        className="w-full h-full object-cover"
                      />

                      {/* Controls */}
                      {selectedPost.images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            disabled={currentImageIndex === 0}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md disabled:opacity-20 transition-all shadow-lg"
                          >
                            <ChevronLeft size={24} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            disabled={currentImageIndex === selectedPost.images.length - 1}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md disabled:opacity-20 transition-all shadow-lg"
                          >
                            <ChevronRight size={24} />
                          </button>

                          {/* Image Counter */}
                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
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
                <div className="lg:w-[400px] flex flex-col h-full bg-[#1e1e1e] p-10 rounded-2xl shadow-2xl">
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <h2 className="text-3xl font-bold text-white leading-tight mb-4 mt-8">
                      {selectedPost.title}
                    </h2>

                    {selectedPost.event_date && (
                      <div className="flex items-center gap-2 text-[#9CA3AF] text-sm font-medium uppercase tracking-wider mb-6">
                        <Calendar size={14} className="stroke-[2.5]" />
                        <span>{new Date(selectedPost.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    )}

                    <div className="w-12 h-1 bg-[#2563EB] mb-6 rounded-full" />

                    <p className="text-[#D1D5DB] leading-relaxed text-[15px]">
                      {selectedPost.description}
                    </p>
                  </div>
                </div>

              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
