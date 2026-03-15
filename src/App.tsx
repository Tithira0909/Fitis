import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';

import { LeadershipTeam } from './pages/LeadershipTeam';
import { ChairmanMessage } from './pages/ChairmanMessage';
import { SecretariatTeam } from './pages/SecretariatTeam';
import { CodeOfConduct } from './pages/CodeOfConduct';
import { CodeOfEthics } from './pages/CodeOfEthics';
import { PastLeaders } from './pages/PastLeaders';

import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Gallery } from './pages/Gallery';
import { Events } from './pages/Events';
import { Chapters } from './pages/Chapters';
import { ChapterDetail } from './pages/ChapterDetail';
import { Contact } from './pages/Contact';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { Programs } from './pages/Programs';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminChapters } from './pages/admin/AdminChapters';
import { AdminLeadership } from './pages/admin/AdminLeadership';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';
import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminChairmanMessage } from './pages/admin/AdminChairmanMessage';
import { AdminSecretariat } from './pages/admin/AdminSecretariat';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const useSiteSettings = () => {
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        // Add cache busting to ensure we get latest settings
        const res = await fetch(`${baseUrl}/api/site-settings?t=${new Date().getTime()}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.favicon_url) {
            let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            // If the URL is already absolute, use it directly. Otherwise, prepend the API URL.
            link.href = data.favicon_url.startsWith('http') ? data.favicon_url : `${baseUrl}${data.favicon_url}`;
          }
        }
      } catch (err) {
        console.error('Failed to load site settings for favicon', err);
      }
    };
    fetchSettings();
  }, []);
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="font-sans flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

export default function App() {
  useSiteSettings();

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="chapters" element={<AdminChapters />} />
          <Route path="leadership" element={<AdminLeadership />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="chairman-message" element={<AdminChairmanMessage />} />
          <Route path="secretariat-team" element={<AdminSecretariat />} />
          <Route path="site-settings" element={<AdminSiteSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home/introduction" element={<Introduction />} />
              <Route path="/Home/leadership-team" element={<LeadershipTeam />} />
              <Route path="/Home/chairman-message" element={<ChairmanMessage />} />
              <Route path="/Home/secretariat-team" element={<SecretariatTeam />} />
              <Route path="/Home/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/Home/code-of-ethics" element={<CodeOfEthics />} />
              <Route path="/Home/past-leaders" element={<PastLeaders />} />
              <Route path="/Home/programs" element={<Programs />} />
              <Route path="/Home/news" element={<News />} />
              <Route path="/Home/news/:slug" element={<NewsDetail />} />
              <Route path="/Home/gallery" element={<Gallery />} />
              <Route path="/Home/events" element={<Events />} />
              <Route path="/Chapter/chapters" element={<Chapters />} />
              <Route path="/Chapter/chapters/:slug" element={<ChapterDetail />} />
              <Route path="/Home/contact" element={<Contact />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}
