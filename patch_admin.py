import re

with open('src/App.tsx', 'r') as f:
    app_content = f.read()

import_statement = "import { AdminGallery } from './pages/admin/AdminGallery';\nimport { AdminChairmanMessage } from './pages/admin/AdminChairmanMessage';"
app_content = app_content.replace("import { AdminGallery } from './pages/admin/AdminGallery';", import_statement)

route_statement = '<Route path="gallery" element={<AdminGallery />} />\n          <Route path="chairman-message" element={<AdminChairmanMessage />} />'
app_content = app_content.replace('<Route path="gallery" element={<AdminGallery />} />', route_statement)

with open('src/App.tsx', 'w') as f:
    f.write(app_content)

with open('src/components/admin/AdminLayout.tsx', 'r') as f:
    layout_content = f.read()

lucide_import = "import { LayoutDashboard, Newspaper, Calendar, Users, Briefcase, Handshake, Mail, Settings, LogOut, Image as ImageIcon, FolderGit2, UserSquare } from 'lucide-react';"
layout_content = re.sub(r"import \{([^}]+)\} from 'lucide-react';", lucide_import, layout_content)

menu_item = "{ path: '/admin/leadership', label: 'Leadership', icon: <Briefcase size={20} /> },\n    { path: '/admin/chairman-message', label: 'Chairman Message', icon: <UserSquare size={20} /> },"
layout_content = layout_content.replace("{ path: '/admin/leadership', label: 'Leadership', icon: <Briefcase size={20} /> },", menu_item)

with open('src/components/admin/AdminLayout.tsx', 'w') as f:
    f.write(layout_content)
