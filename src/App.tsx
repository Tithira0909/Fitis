import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Introduction } from './pages/Introduction';

import { LeadershipTeam } from './pages/LeadershipTeam';
import { ChairmanMessage } from './pages/ChairmanMessage';
import { SecretariatTeam } from './pages/SecretariatTeam';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Disclaimer } from './pages/Disclaimer';
import { Partners } from './pages/Partners';
import { CodeOfConduct } from './pages/CodeOfConduct';
import { CodeOfEthics } from './pages/CodeOfEthics';
import { PastLeaders } from './pages/PastLeaders';

import { News } from './pages/News';
import { NewsDetail } from './pages/NewsDetail';
import { Newsletters } from './pages/Newsletters';
import { Gallery } from './pages/Gallery';
import { Events } from './pages/Events';
import { Chapters } from './pages/Chapters';
import { ChapterDetail } from './pages/ChapterDetail';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';

import { AdminLayout } from './components/admin/AdminLayout';
import { BecomeAMember } from './pages/BecomeAMember';
import { CompanySignup } from './pages/CompanySignup';
import { MemberCommunity } from './pages/MemberCommunity';
import { MemberProfile } from './pages/MemberProfile';
import { MemberDashboard } from './pages/MemberDashboard';
import { MemberBenefits } from './pages/MemberBenefits';

import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminCommunityRequests } from './pages/admin/AdminCommunityRequests';
import { AdminMemberBenefits } from './pages/admin/AdminMemberBenefits';
import { AdminProfileUpdates } from './pages/admin/AdminProfileUpdates';


import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminNews } from './pages/admin/AdminNews';
import { AdminPrograms } from './pages/admin/AdminPrograms';
import { Programs } from './pages/Programs';
import { ProgramDetail } from './pages/ProgramDetail';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminChapters } from './pages/admin/AdminChapters';
import { AdminLeadership } from './pages/admin/AdminLeadership';
import { AdminPartners } from './pages/admin/AdminPartners';
import { AdminNewsletterPublications } from './pages/admin/AdminNewsletterPublications';
import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminChairmanMessage } from './pages/admin/AdminChairmanMessage';
import { AdminSecretariat } from './pages/admin/AdminSecretariat';
import { AdminWallPosts } from './pages/admin/AdminWallPosts';

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
          <Route path="members" element={<AdminMembers />} />
          <Route path="community-requests" element={<AdminCommunityRequests />} />
          <Route path="wall-posts" element={<AdminWallPosts />} />
          <Route path="profile-updates" element={<AdminProfileUpdates />} />
          <Route path="member-benefits" element={<AdminMemberBenefits />} />

          <Route path="partners" element={<AdminPartners />} />
          <Route path="newsletter-publications" element={<AdminNewsletterPublications />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="chairman-message" element={<AdminChairmanMessage />} />
          <Route path="secretariat-team" element={<AdminSecretariat />} />
          <Route path="site-settings" element={<AdminSiteSettings />} />
        </Route>

        {/* Member Dashboard — standalone, no public navbar/footer */}
        <Route path="/member-dashboard" element={<MemberDashboard />} />

        {/* Public Routes */}
        <Route path="/*" element={
          <PublicLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Home/introduction" element={<Introduction />} />
              <Route path="/Home/leadership-team" element={<LeadershipTeam />} />
              <Route path="/Home/chairman-message" element={<ChairmanMessage />} />
              <Route path="/Home/secretariat-team" element={<SecretariatTeam />} />
              <Route path="/Home/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/Home/disclaimer" element={<Disclaimer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Home/become-a-member" element={<BecomeAMember />} />
              <Route path="/signup" element={<CompanySignup />} />
              <Route path="/Home/member-community" element={<MemberCommunity />} />
              <Route path="/member/:id" element={<MemberProfile />} />
              <Route path="/Home/member-benefits" element={<MemberBenefits />} />

              <Route path="/Home/partnerships" element={<Partners />} />
              <Route path="/Home/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/Home/code-of-ethics" element={<CodeOfEthics />} />
              <Route path="/Home/past-leaders" element={<PastLeaders />} />
              <Route path="/Home/programs" element={<Programs />} />
              <Route path="/Home/programs/:slug" element={<ProgramDetail />} />
              <Route path="/Home/news" element={<News />} />
              <Route path="/Home/news/:slug" element={<NewsDetail />} />
              <Route path="/Home/newsletters" element={<Newsletters />} />
              <Route path="/Home/gallery" element={<Gallery />} />
              <Route path="/Home/events" element={<Events />} />
              <Route path="/Chapter/chapters" element={<Chapters />} />
              <Route path="/Chapter/:slug" element={<ChapterDetail />} />
              <Route path="/Home/contact" element={<Contact />} />
            </Routes>
          </PublicLayout>
        } />
      </Routes>
    </Router>
  );
}
