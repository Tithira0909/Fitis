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

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="font-sans flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home/introduction" element={<Introduction />} />
            <Route path="/Home/news" element={<News />} />
            <Route path="/Home/event_homenow" element={<Events />} />
            <Route path="/Chapter/chapters" element={<Chapters />} />
            <Route path="/Chapter/chapters/:slug" element={<ChapterDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
