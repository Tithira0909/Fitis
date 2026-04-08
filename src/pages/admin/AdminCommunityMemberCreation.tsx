import React, { useState } from 'react';
import { Building2, User, Link as LinkIcon, Mail, Phone, Hash, Upload, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminCommunityMemberCreation: React.FC = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    primary_chapter: '',
    secondary_chapter: '',
    fitis_membership_id: '',
    company_id: '',
    official_email: '',
    company_linkedin: '',
    website_link: '',
    services: '',
    rep_name: '',
    rep_email: '',
    rep_mobile: '',
    rep_designation: ''
  });

  const CHAPTER_OPTIONS = ['ICT Infrastructure Chapter', 'Software Chapter', 'Digital Services Chapter', 'Education & Training Chapter', 'Communication Chapter', 'Digital Trust Chapter'];

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [repImage, setRepImage] = useState<File | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'rep') => {
    const file = e.target.files?.[0] || null;
    if (type === 'logo') setCompanyLogo(file);
    else setRepImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const authToken = localStorage.getItem('adminToken');
      
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (companyLogo) data.append('company_logo', companyLogo);
      if (repImage) data.append('rep_image', repImage);

      const res = await fetch(`${baseUrl}/api/admin/community-members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: data,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to create member');
      }

      setSuccess(true);
      setFormData({
        company_name: '',
        primary_chapter: '',
        secondary_chapter: '',
        fitis_membership_id: '',
        company_id: '',
        official_email: '',
        company_linkedin: '',
        website_link: '',
        services: '',
        rep_name: '',
        rep_email: '',
        rep_mobile: '',
        rep_designation: ''
      });
      setCompanyLogo(null);
      setRepImage(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'Failed to create member');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Community Member Creation</h1>
          <p className="text-slate-500 text-sm mt-1">Directly provision an approved community member profile and dispatch a setup email.</p>
        </div>
        <ShieldCheck className="text-fitis-blue opacity-20 hidden md:block" size={48} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
        
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-8 p-6 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-start gap-4">
            <CheckCircle2 size={32} className="shrink-0 text-green-600 mt-1" />
            <div>
              <h3 className="font-bold text-lg">Member Successfully Provisioned</h3>
              <p className="mt-1 opacity-90">The member account has been created and immediately approved. A specialized email has been dispatched to the representative with a 24-hour setup link.</p>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><Building2 size={24} /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Company Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Company Name *</label>
                <input type="text" name="company_name" required value={formData.company_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="e.g. FITIS (Guarantee) LTD" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Primary Chapter *</label>
                <div className="relative">
                  <select name="primary_chapter" required value={formData.primary_chapter} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white">
                    <option value="">Select Primary Chapter</option>
                    {CHAPTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Secondary Chapter</label>
                <div className="relative">
                  <select name="secondary_chapter" value={formData.secondary_chapter} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none appearance-none bg-white">
                    <option value="">No secondary chapter</option>
                    {CHAPTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">FITIS Membership ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Hash size={18} className="text-gray-400" /></div>
                  <input type="text" name="fitis_membership_id" value={formData.fitis_membership_id} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="FNXXXX" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Company Registration ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Hash size={18} className="text-gray-400" /></div>
                  <input type="text" name="company_id" value={formData.company_id} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="PV 12345" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Official Contact Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
                  <input type="email" name="official_email" required value={formData.official_email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="contact@company.com" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">LinkedIn Page URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><LinkIcon size={18} className="text-gray-400" /></div>
                  <input type="url" name="company_linkedin" value={formData.company_linkedin} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="https://linkedin.com/company/..." />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Website Link</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><LinkIcon size={18} className="text-gray-400" /></div>
                  <input type="url" name="website_link" value={formData.website_link} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="https://www.company.com" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700">Services Offered *</label>
                <textarea
                  name="services"
                  required
                  value={formData.services}
                  onChange={handleChange as any}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                  placeholder="Briefly describe the services your company provides..."
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Company Logo *</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-4">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 text-center"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                      {companyLogo && <p className="text-xs font-bold text-green-600 mt-2">Selected: {companyLogo.name}</p>}
                    </div>
                    <input type="file" required accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Representative Info */}
          <div>
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 mt-8">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0"><User size={24} /></div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800">Primary Representative</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User size={18} className="text-gray-400" /></div>
                  <input type="text" name="rep_name" required value={formData.rep_name} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="John Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Designation *</label>
                <input type="text" name="rep_designation" required value={formData.rep_designation} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="CEO / General Manager" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Personal/Work Email *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-gray-400" /></div>
                  <input type="email" name="rep_email" required value={formData.rep_email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="john.doe@company.com" />
                </div>
                <p className="text-xs text-slate-500 mt-1">The setup link will be emailed to this address.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400" /></div>
                  <input type="tel" name="rep_mobile" required value={formData.rep_mobile} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="+94 7X XXX XXXX" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Representative Photo</label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload photo</span> or drag and drop</p>
                      {repImage && <p className="text-xs font-bold text-green-600 mt-2">Selected: {repImage.name}</p>}
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'rep')} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-[0_4px_14px_rgba(37,99,235,0.39)] disabled:opacity-70 disabled:hover:translate-y-0 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-lg'
              }`}
            >
              {isLoading ? 'Creating Member...' : 'Provision Member & Send Setup Email'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
