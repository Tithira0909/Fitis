import re

with open('src/pages/Home.tsx', 'r') as f:
    content = f.read()

search = """const FitisLogoWhite = () => (
  <div className="flex items-center gap-3">
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 100 100" className="w-full h-full text-white">
        <path d="M20 20 L80 20 L80 35 L40 35 L40 50 L70 50 L70 65 L40 65 L40 85 L20 85 Z" fill="currentColor" />
        {/* Mesh dots to the left of F */}
        <g fill="currentColor" opacity="0.8">
          <circle cx="10" cy="30" r="2" />
          <circle cx="5" cy="45" r="2" />
          <circle cx="12" cy="60" r="2" />
          <circle cx="8" cy="75" r="2" />
          <circle cx="15" cy="40" r="1.5" />
          <circle cx="18" cy="55" r="1.5" />
        </g>
      </svg>
    </div>
    <div className="text-white">
      <p className="font-black text-3xl leading-none tracking-tighter">FITIS</p>
      <p className="text-[7px] uppercase tracking-[0.2em] font-bold opacity-70">Federation of IT Industry Sri Lanka</p>
    </div>
  </div>
);"""

replace = """const FitisLogoWhite = () => (
  <div className="bg-white/90 p-4 rounded-xl inline-block shadow-lg backdrop-blur-md">
    <img src="/fitis-logo.png" alt="FITIS" className="w-auto h-16 md:h-20 object-contain" />
  </div>
);"""

content = content.replace(search, replace)

with open('src/pages/Home.tsx', 'w') as f:
    f.write(content)
