import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, User, Link as LinkIcon, Mail, Phone, Hash, Upload, CheckCircle2 } from 'lucide-react';

export const CompanySignup = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_id: '',
    official_email: '',
    company_linkedin: '',
    website_link: '',
    rep_name: '',
    rep_email: '',
    rep_mobile: '',
    rep_designation: '',
    password: '',
    confirm_password: ''
  });

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [repImage, setRepImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'rep') => {
    const file = e.target.files?.[0] || null;
    if (type === 'logo') setCompanyLogo(file);
    else setRepImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match. Please try again.");
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirm_password') data.append(key, value);
      });

      if (companyLogo) data.append('company_logo', companyLogo);
      if (repImage) data.append('rep_image', repImage);

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/community/apply`, {
        method: 'POST',
        body: data // FormData avoids generic application/json content-type
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-32 px-4 sm:px-6 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-10 text-center border top-t-4 border-t-blue-600"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to the FITIS Member Community. Your company profile and representative details have been received and are currently under review by our administration. We will get back to you shortly at {formData.official_email}.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-24 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#0a1128] text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-600/30 text-blue-200 font-bold tracking-widest text-xs rounded-full mb-4 uppercase border border-blue-500/30">Community Directory</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Join the Member Community</h1>
          <p className="text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Showcase your organization in the FITIS Member Community index. Fill the form below to register your company and its representative.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 w-full -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200 flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Company Info */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Building2 size={24} /></div>
                <h3 className="text-2xl font-bold text-gray-800">Company Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Company Name *</label>
                  <input type="text" name="company_name" required value={formData.company_name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="e.g. Acme Corporation" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Company Registration ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Hash size={18} className="text-gray-400" /></div>
                    <input type="text" name="company_id" value={formData.company_id} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="PV-12345" />
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

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block">Company Logo *</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG or SVG (Max 5MB)</p>
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
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={24} /></div>
                <h3 className="text-2xl font-bold text-gray-800">Primary Representative</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mobile Number *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone size={18} className="text-gray-400" /></div>
                    <input type="tel" name="rep_mobile" required value={formData.rep_mobile} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="+94 7X XXX XXXX" />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block">Representative Photo</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500"><span className="font-semibold text-blue-600">Click to upload photo</span> or drag and drop</p>
                        <p className="text-xs text-gray-400 mt-1">Professional headshot (PNG/JPG)</p>
                        {repImage && <p className="text-xs font-bold text-green-600 mt-2">Selected: {repImage.name}</p>}
                      </div>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'rep')} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Account Security */}
            <div>
              <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-100 mt-8">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Hash size={24} /></div>
                <h3 className="text-2xl font-bold text-gray-800">Account Security</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Password *</label>
                  <input type="password" name="password" required minLength={6} value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm Password *</label>
                  <input type="password" name="confirm_password" required minLength={6} value={formData.confirm_password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-blue-600/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? 'Submitting Application...' : 'Apply to Join Community'}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};
