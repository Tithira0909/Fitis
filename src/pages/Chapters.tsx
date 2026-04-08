import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Monitor,
  GraduationCap,
  Phone,
  Settings,
  Archive,
  User,
  ArrowRight,
  Users,
  Layers,
  Calendar,
  LucideIcon,
  HelpCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { SubHeaderBar } from '../components/SubHeaderBar';
import { SectionHeader } from '../components/SectionHeader';
import { getImageUrl } from '../utils/getImageUrl';

interface Chapter {
  id: number;
  name: string;
  slug: string;
  icon_name: string;
  icon_url: string;
  thumbnail_image_url: string;
  summary: string;
}

const stats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Total Chapters", value: "7", icon: Layers },
  { label: "Working Groups", value: "15+", icon: Users },
  { label: "Programs/Year", value: "50+", icon: Calendar }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Globe': return <Globe size={48} className="text-white" />;
    case 'Monitor': return <Monitor size={48} className="text-white" />;
    case 'GraduationCap': return <GraduationCap size={48} className="text-white" />;
    case 'Phone': return <Phone size={48} className="text-white" />;
    case 'Settings': return <Settings size={48} className="text-white" />;
    case 'Archive': return <Archive size={48} className="text-white" />;
    case 'User': return <User size={48} className="text-white" />;
    default: return <HelpCircle size={48} className="text-white" />;
  }
};

export const Chapters = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const navigate = useNavigate();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const res = await fetch(`${baseUrl}/api/contact/chapter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (res.ok) {
        alert('Your inquiry has been sent successfully!');
        setContactForm({ name: '', email: '', phone: '', message: '' });
        setIsContactModalOpen(false);
      } else {
        alert('Failed to send inquiry. Please try again.');
      }
    } catch (err) {
      console.error('Contact error:', err);
      alert('Failed to send inquiry. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };


  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res = await fetch(`${baseUrl}/api/chapters`);
        if (res.ok) {
          const data = await res.json();
          setChapters(data);
        }
      } catch (error) {
        console.error('Failed to load chapters', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChapters();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">

      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Chapters' }]}
        title="FITIS CHAPTERS"
        showSearch={false}
      />

      {/* Chapters Overview Section */}
      <section className="py-16 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader title="Driving Industry Growth" className="text-left md:text-left [&>div]:mx-0" />
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <p className="text-slate-600 leading-relaxed text-lg mt-0 text-justify">
                FITIS operates through specialised chapters to drive industry growth, collaboration, standards, and national digital priorities. Each chapter serves as a dedicated forum for stakeholders within a specific sector to address challenges, share knowledge, and influence policy decisions that shape the future of technology in Sri Lanka.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center"
                >
                  <div className="w-12 h-12 bg-fitis-blue/10 rounded-xl flex items-center justify-center text-fitis-blue mx-auto mb-4">
                    <stat.icon size={24} />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fitis-blue"></div>
            </div>
          ) : chapters.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-100">
              <p className="text-lg font-medium">No chapters available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {chapters.map((chapter, idx) => (
                <Link
                  to={`/Chapter/${chapter.slug}`}
                  key={chapter.slug}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full border border-gray-100"
                  >
                    <div className="bg-[#00529B] h-48 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="transform group-hover:scale-110 transition-transform duration-300 z-10 text-white flex items-center justify-center h-full w-full">
                        {chapter.thumbnail_image_url ? (
                          <img src={getImageUrl(chapter.thumbnail_image_url)} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : chapter.icon_url ? (
                          <img src={getImageUrl(chapter.icon_url)} alt="Icon" className="w-16 h-16 object-contain" />
                        ) : (
                          getIconComponent(chapter.icon_name)
                        )}
                      </div>
                    </div>
                    <div className="p-5 flex-grow flex items-center justify-center bg-gray-50 border-t border-gray-100">
                      <h3 className="text-sm font-bold text-gray-800 text-center uppercase tracking-wider group-hover:text-fitis-blue transition-colors">
                        {chapter.name}
                      </h3>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-fitis-blue rounded-[3rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl shadow-fitis-blue/30">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-fitis-gold rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <SectionHeader
                title="Want to contribute to a chapter?"
                subtitle="Join our specialized chapters and play a key role in driving Sri Lanka's digital transformation."
                className="mb-10 [&>h2]:text-white [&>h2]:text-3xl md:[&>h2]:text-4xl [&>p]:text-white/80"
              />
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/Home/become-a-member')} 
                  className="w-full sm:w-auto px-10 py-4 bg-white text-fitis-blue rounded-xl font-bold text-lg hover:bg-slate-50 transition-all shadow-xl active:scale-95"
                >
                  Become a Member
                </button>
                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full sm:w-auto px-10 py-4 bg-transparent border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
                >
                  Contact FITIS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-fitis-blue to-blue-700 p-6 flex justify-between items-center text-white">
              <h2 className="text-2xl font-bold">Contact FITIS</h2>
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="text-white/80 hover:text-white p-1 transition-colors"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8">
              <p className="text-slate-600 mb-6 font-medium">Please fill out the form below and our team will get back to you shortly regarding chapter contributions.</p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fitis-blue/50 transition-all text-slate-800"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fitis-blue/50 transition-all text-slate-800"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fitis-blue/50 transition-all text-slate-800"
                    placeholder="+94 77 123 4567"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-fitis-blue/50 transition-all text-slate-800 resize-none"
                    placeholder="How would you like to contribute?"
                  ></textarea>
                </div>
                
                <div className="pt-4 flex items-center justify-end space-x-4 border-t border-slate-100 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className={`px-8 py-3 bg-gradient-to-r from-fitis-blue to-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all ${
                      isSubmittingContact ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmittingContact ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

