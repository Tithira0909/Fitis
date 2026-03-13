import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';
import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Events } from './pages/Events';
import { Chapters } from './pages/Chapters';
import { ChapterDetail } from './pages/ChapterDetail';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminChapters } from './pages/admin/AdminChapters';
import { AdminLeadership } from './pages/admin/AdminLeadership';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';
import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';

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
          <Route path="news" element={<AdminNews />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="chapters" element={<AdminChapters />} />
          <Route path="leadership" element={<AdminLeadership />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
          <Route path="site-settings" element={<AdminSiteSettings />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home/introduction" element={<Introduction />} />
              <Route path="/Home/news" element={<News />} />
              <Route path="/Home/news/:slug" element={<NewsDetail />} />
              <Route path="/Home/event_homenow" element={<Events />} />
              <Route path="/Chapter/chapters" element={<Chapters />} />
              <Route path="/Chapter/chapters/:slug" element={<ChapterDetail />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}
