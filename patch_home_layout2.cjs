const fs = require('fs');
const path = 'src/pages/Home.tsx';
let content = fs.readFileSync(path, 'utf8');

// I might have failed the previous replace if whitespace didn't match. Let me use regex.
const regex = /<div key=\{catKey\} className="relative">\s*<div className="flex items-center justify-center mb-10">\s*<div className="h-px bg-slate-200 flex-grow max-w-\[100px\] md:max-w-\[300px\]"><\/div>\s*<h3 className="px-6 text-xl md:text-2xl font-bold text-slate-800 text-center">\s*\{CATEGORY_LABELS\[catKey\]\}\s*<\/h3>\s*<div className="h-px bg-slate-200 flex-grow max-w-\[100px\] md:max-w-\[300px\]"><\/div>\s*<\/div>/s;

const newBlock = `<div key={catKey} className="relative">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center uppercase tracking-widest mb-4">
                    {CATEGORY_LABELS[catKey]}
                  </h3>
                  <div className="w-full h-px bg-slate-200 mb-8 md:mb-12"></div>`;

content = content.replace(regex, newBlock);
fs.writeFileSync(path, content, 'utf8');
