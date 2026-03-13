const fs = require('fs');

const navFile = 'src/components/Navbar.tsx';
let navContent = fs.readFileSync(navFile, 'utf8');

const oldNavLinks = `{ name: 'Chapters', href: '/Chapter/chapters' },`;
const newNavLinks = `{ name: 'Chapters', href: '/Chapter/chapters' },\n    { name: 'Gallery', href: '/Home/gallery' },`;
navContent = navContent.replace(oldNavLinks, newNavLinks);
fs.writeFileSync(navFile, navContent, 'utf8');
console.log('Patched Navbar.tsx');

const appFile = 'src/App.tsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const oldAppImport = `import { NewsDetail } from './pages/NewsDetail';`;
const newAppImport = `import { NewsDetail } from './pages/NewsDetail';\nimport { Gallery } from './pages/Gallery';`;
appContent = appContent.replace(oldAppImport, newAppImport);

const oldRoute = `<Route path="/Home/news/:slug" element={<NewsDetail />} />`;
const newRoute = `<Route path="/Home/news/:slug" element={<NewsDetail />} />\n              <Route path="/Home/gallery" element={<Gallery />} />`;
appContent = appContent.replace(oldRoute, newRoute);
fs.writeFileSync(appFile, appContent, 'utf8');
console.log('Patched App.tsx');
