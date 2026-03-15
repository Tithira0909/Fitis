import re

with open('src/components/Navbar.tsx', 'r') as f:
    content = f.read()

search = """        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-fitis-blue rounded-lg flex items-center justify-center text-white font-bold text-xl">F</div>
          <span className={cn(
            "font-display font-bold text-2xl tracking-tighter",
            isScrolled || location.pathname !== '/' ? "text-fitis-blue" : "text-white"
          )}>FITIS</span>
        </Link>"""
replace = """        <Link to="/" className="flex items-center gap-2">
          <img src="/fitis-logo.png" alt="FITIS Logo" className="h-10 w-auto bg-white rounded p-1" />
        </Link>"""

content = content.replace(search, replace)

with open('src/components/Navbar.tsx', 'w') as f:
    f.write(content)
