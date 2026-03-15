import React from 'react';
import { cn } from '../lib/utils';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn("text-center mb-16", className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-fitis-blue uppercase tracking-wider mb-4">
        {title}
      </h2>
      <div className="w-20 h-1 bg-fitis-gold mx-auto rounded-full" />
      {subtitle && (
        <p className="mt-6 text-slate-500 text-lg max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};
