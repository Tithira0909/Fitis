import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';
import { News } from './pages/News';
import { Events } from './pages/Events';
import { Chapters } from './pages/Chapters';
import { ChapterDetail } from './pages/ChapterDetail';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminChapters } from './pages/admin/AdminChapters';
import { AdminBoardMembers } from './pages/admin/AdminBoardMembers';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminNewsletter } from './pages/admin/AdminNewsletter';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
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
          <Route path="board-members" element={<AdminBoardMembers />} />
          <Route path="partners" element={<AdminPartners />} />
          <Route path="newsletter" element={<AdminNewsletter />} />
        </Route>

        {/* Public Routes */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home/introduction" element={<Introduction />} />
              <Route path="/Home/news" element={<News />} />
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
