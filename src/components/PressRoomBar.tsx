import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

interface PressRoomBarProps {
  breadcrumbs: { label: string; href?: string }[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PressRoomBar: React.FC<PressRoomBarProps> = ({ breadcrumbs, searchQuery, onSearchChange }) => {
  return (
    <div className="bg-[#0b1a30] text-white py-3 px-6 mt-20 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Breadcrumbs */}
        <div className="text-xs font-semibold tracking-wider flex items-center gap-2 w-full md:w-1/3 overflow-hidden whitespace-nowrap text-ellipsis">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-400">&gt;</span>}
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-fitis-gold transition-colors text-slate-300">
                  {crumb.label.toUpperCase()}
                </Link>
              ) : (
                <span className="text-white">{crumb.label.toUpperCase()}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Center Title */}
        <div className="text-center font-display font-bold text-sm tracking-widest w-full md:w-1/3 uppercase text-slate-100">
          FITIS PRESS ROOM
        </div>

        {/* Search Input */}
        <div className="w-full md:w-1/3 flex justify-end">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                    window.location.href = `/Home/news?q=${encodeURIComponent(val.trim())}`;
                  }
                }
              }}
              className="w-full bg-[#162742] text-white border border-[#233859] rounded-full py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-fitis-gold focus:ring-1 focus:ring-fitis-gold placeholder-slate-400 transition-all"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

      </div>
    </div>
  );
};
