const fs = require('fs');
const file = 'src/pages/Gallery.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes("import { Image as ImageIcon } from 'lucide-react';")) {
  content = content.replace("import { Calendar, ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';", "import { Calendar, ChevronLeft, ChevronRight, X, Loader, Image as ImageIcon } from 'lucide-react';");
  fs.writeFileSync(file, content);
  console.log('Fixed imports in Gallery.tsx');
}
