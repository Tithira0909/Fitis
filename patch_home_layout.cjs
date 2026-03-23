const fs = require('fs');
const path = 'src/pages/Home.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldMapping = `{CATEGORY_ORDER.map((catKey) => {
              const group = groupedPartners[catKey];
              if (!group || group.length === 0) return null;

              return (
                <div key={catKey} className="relative">
                  <div className="flex items-center justify-center mb-10">
                    <div className="h-px bg-slate-200 flex-grow max-w-[100px] md:max-w-[300px]"></div>
                    <h3 className="px-6 text-xl md:text-2xl font-bold text-slate-800 text-center">
                      {CATEGORY_LABELS[catKey]}
                    </h3>
                    <div className="h-px bg-slate-200 flex-grow max-w-[100px] md:max-w-[300px]"></div>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">`;

const newMapping = `{CATEGORY_ORDER.map((catKey) => {
              const group = groupedPartners[catKey];
              if (!group || group.length === 0) return null;

              return (
                <div key={catKey} className="relative">
                  <div className="flex flex-col items-center justify-center mb-10 w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 text-center mb-4 uppercase">
                      {CATEGORY_LABELS[catKey]}
                    </h3>
                    <div className="h-px bg-slate-200 w-full"></div>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">`;

content = content.replace(oldMapping, newMapping);
fs.writeFileSync(path, content, 'utf8');
