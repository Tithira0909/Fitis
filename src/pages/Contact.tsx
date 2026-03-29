import React from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';
import { SectionHeader } from '../components/SectionHeader';
import { Mail, Phone, MapPin } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SubHeaderBar
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact Us' }]}
        title="CONTACT US"
        showSearch={false}
      />

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
          <SectionHeader title="Get in Touch" className="mb-8" />

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-slate-600">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-fitis-blue/10 text-fitis-blue rounded-full flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <span className="font-medium text-lg leading-tight">No.9A, 1/3, Fourth Floor, St. Anthony’s Mawatha, Colombo 03</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-fitis-blue/10 text-fitis-blue rounded-full flex items-center justify-center">
                <Mail size={24} />
              </div>
              <span className="font-medium text-lg">info@fitis.lk</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-fitis-blue/10 text-fitis-blue rounded-full flex items-center justify-center">
                <Phone size={24} />
              </div>
              <span className="font-medium text-lg">(+94) 112 577 103</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
