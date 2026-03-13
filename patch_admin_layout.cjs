const fs = require('fs');

const layoutFile = 'src/components/admin/AdminLayout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');

const oldImports = `import { LayoutDashboard, Newspaper, Calendar, Users, Briefcase, Handshake, Mail, Settings, LogOut } from 'lucide-react';`;
const newImports = `import { LayoutDashboard, Newspaper, Calendar, Users, Briefcase, Handshake, Mail, Settings, LogOut, Image as ImageIcon } from 'lucide-react';`;
layoutContent = layoutContent.replace(oldImports, newImports);

const oldMenuItems = `{ path: '/admin/newsletter', label: 'Newsletter', icon: <Mail size={20} /> },`;
const newMenuItems = `{ path: '/admin/newsletter', label: 'Newsletter', icon: <Mail size={20} /> },\n    { path: '/admin/gallery', label: 'Gallery', icon: <ImageIcon size={20} /> },`;
layoutContent = layoutContent.replace(oldMenuItems, newMenuItems);

fs.writeFileSync(layoutFile, layoutContent, 'utf8');
console.log('Patched AdminLayout.tsx');

const appFile = 'src/App.tsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const importGallery = `import { AdminGallery } from './pages/admin/AdminGallery';`;
appContent = appContent.replace(`import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';`, `import { AdminSiteSettings } from './pages/admin/AdminSiteSettings';\n${importGallery}`);

const routeGallery = `<Route path="gallery" element={<AdminGallery />} />`;
appContent = appContent.replace(`<Route path="newsletter" element={<AdminNewsletter />} />`, `<Route path="newsletter" element={<AdminNewsletter />} />\n          ${routeGallery}`);

fs.writeFileSync(appFile, appContent, 'utf8');
console.log('Patched App.tsx');
