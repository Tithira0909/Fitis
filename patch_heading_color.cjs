const fs = require('fs');

const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  '<h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 uppercase">',
  '<h2 className="text-3xl md:text-4xl font-bold text-fitis-blue mb-4 uppercase">'
);

fs.writeFileSync(file, content);
