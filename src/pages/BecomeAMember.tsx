import React, { useState } from 'react';
import { SubHeaderBar } from '../components/SubHeaderBar';

export const BecomeAMember = () => {
  const [formData, setFormData] = useState({
    primary_chapter: '',
    chapters_applied: [] as string[],
    company_name: '',
    membership_category: '',
    ceo_name: '',
    company_address: '',
    phone: '',
    fax: '',
    website: '',
    email: '',
    br_number: '',
    year_incorporation: '',
    boi_no: '',
    ownership_local: '',
    ownership_foreign: '',
    business_activities: '',
    industry_focus: [] as string[],
    revenue_local: '',
    revenue_foreign: '',
    employees_count: '',
    primary_nominee: { name: '', designation: '', phone: '', email: '' },
    secondary_nominee: { name: '', designation: '', phone: '', email: '' },
    declaration_applicant_name: '',
    declaration_applicant_designation: '',
    declaration_date: '',
    agree_checkbox: false,
  });

  const [files, setFiles] = useState({
    business_registration: null as File | null,
    audited_accounts: null as File | null,
    company_profile: null as File | null,
    form_20: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'filling' | 'verifying'>('filling');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');


  const CHAPTER_OPTIONS = ['ICT Infrastructure Chapter', 'Software Chapter', 'Digital Services Chapter', 'Education & Training Chapter', 'Communication Chapter', 'Digital Trust Chapter'];
  const INDUSTRY_OPTIONS = ['BFI/Banking', 'Telecommunications', 'Logistics & Transportation', 'Healthcare', 'Education', 'Retail/E-commerce', 'Manufacturing'];
  const EMPLOYEES_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const CATEGORY_OPTIONS = ['Full Member (Annual | Revenue >= LKR 12M)', 'Associate Member (Annual Revenue < LKR 12 M)', 'Premier corporate partner', 'Corporate Partner'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (section: 'primary_nominee' | 'secondary_nominee', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayChange = (field: 'chapters_applied' | 'industry_focus', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof typeof files) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [name]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.chapters_applied.length === 0) {
      alert("Please select at least one Chapter you are applying for.");
      return;
    }
    if (formData.industry_focus.length === 0) {
      alert("Please select at least one Industry Focus.");
      return;
    }

    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        setStep('verifying');
        window.scrollTo(0, 0);
      } else {
        const errorData = await response.json();
        alert(`Failed to send OTP: ${errorData.error}`);
      }
    } catch (error) {
      console.error('OTP Error:', error);
      alert('An error occurred while sending OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyAndSubmit = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setOtpError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      
      // 1. Verify OTP
      const verifyRes = await fetch(`${baseUrl}/api/membership/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: otpCode }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        setOtpError(err.error || 'Invalid OTP');
        setIsVerifying(false);
        return;
      }

      // 2. Proceed with Final Submission
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'chapters_applied' || key === 'industry_focus' || key === 'primary_nominee' || key === 'secondary_nominee') {
          payload.append(`${key}_json`, JSON.stringify(value));
        } else {
          payload.append(key, String(value));
        }
      });

      if (files.business_registration) payload.append('business_registration', files.business_registration);
      if (files.audited_accounts) payload.append('audited_accounts', files.audited_accounts);
      if (files.company_profile) payload.append('company_profile', files.company_profile);
      if (files.form_20) payload.append('form_20', files.form_20);

      const response = await fetch(`${baseUrl}/api/membership/apply`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit application: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred during final submission.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      if (response.ok) {
        alert('OTP resent successfully!');
      } else {
        alert('Failed to resend OTP.');
      }
    } catch (e) {
      alert('Error resending OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // Reusable Tailwind CSS classes for the sleek redesign
  const inputClass = "w-full border border-slate-200 rounded-xl p-4 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-fitis-blue/10 focus:border-fitis-blue transition-all outline-none shadow-sm hover:border-slate-300 text-slate-800 placeholder:text-slate-400";
  const labelClass = "block text-sm font-bold text-slate-700 mb-2 tracking-wide uppercase text-xs";
  const sectionClass = "bg-white p-6 md:p-12 rounded-[1.5rem] md:rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/70 transition-shadow duration-500";

  const sectionTitleClass = "text-xl md:text-2xl font-black text-slate-800 border-b-2 border-slate-100 pb-3 md:pb-5 mb-6 md:mb-8 text-fitis-blue flex items-center gap-4";

  const fileInputClass = "w-full text-sm text-slate-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fitis-blue/10 file:text-fitis-blue hover:file:bg-fitis-blue/20 transition-all cursor-pointer focus:outline-none";
  const badgeClass = "flex items-center space-x-3 p-3 rounded-xl border border-slate-200 hover:border-fitis-blue hover:bg-fitis-blue/5 transition-all cursor-pointer group";

  if (success) {
    return (
      <div className="bg-slate-50 min-h-screen font-sans">
        <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Member' }]} title="BECOME A MEMBER" showSearch={false} />
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl shadow-lg shadow-green-100/50">✓</div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Application Submitted!</h2>
          <p className="text-lg text-slate-600 mb-10 leading-relaxed">Thank you for applying to become a member of FITIS. Our team will carefully review your application and contact you shortly.</p>
          <button onClick={() => window.location.reload()} className="bg-gradient-to-r from-fitis-blue to-blue-700 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/50 min-h-screen pb-24 font-sans selection:bg-fitis-blue selection:text-white">
      <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Member' }]} title="BECOME A MEMBER" showSearch={false} />

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 md:mb-6 tracking-tight">NEW MEMBER REGISTRATION</h2>
            <div className="text-slate-600 leading-relaxed space-y-4 max-w-2xl mx-auto text-base md:text-lg">
              <p>A body corporate should satisfy the eligibility criteria set out for the respective Chapter to become a prestigious member of FITIS.</p>
            </div>
          </div>


          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 'verifying' ? (
              <div className={`${sectionClass} text-center py-16`}>
                <div className="w-20 h-20 bg-fitis-blue/10 text-fitis-blue rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Verify Your Email</h2>
                <p className="text-slate-600 mb-10 max-w-md mx-auto">
                  We've sent a 6-digit verification code to <span className="font-bold text-fitis-blue">{formData.email}</span>. Please enter it below to complete your application.
                </p>

                <div className="max-w-xs mx-auto mb-8">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center text-3xl md:text-4xl font-black tracking-[0.3em] md:tracking-[0.5em] py-5 border-2 border-slate-200 rounded-2xl focus:border-fitis-blue focus:ring-4 focus:ring-fitis-blue/10 transition-all outline-none"

                    placeholder="000000"
                  />
                  {otpError && <p className="text-red-500 text-sm font-bold mt-4">{otpError}</p>}
                </div>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={handleVerifyAndSubmit}
                    disabled={isVerifying}
                    className={`w-full py-5 rounded-full font-black text-lg shadow-xl transition-all ${isVerifying ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-fitis-blue to-blue-800 text-white hover:shadow-fitis-blue/40 hover:-translate-y-1 active:scale-95'}`}
                  >
                    {isVerifying ? 'Verifying...' : 'Complete Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('filling')}
                    className="text-slate-500 font-bold hover:text-slate-800 transition-colors text-sm"
                  >
                    ← Back to form
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-fitis-blue font-bold hover:underline text-sm"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Section A */}
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>A. Membership Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                <div>
                  <label className={labelClass}>Primary Chapter *</label>
                  <div className="relative">
                    <select name="primary_chapter" value={formData.primary_chapter} onChange={handleChange} className={`${inputClass} appearance-none`} required>
                      <option value="">Select Primary Chapter</option>
                      {CHAPTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Membership Category *</label>
                  <div className="relative">
                    <select name="membership_category" value={formData.membership_category} onChange={handleChange} className={`${inputClass} appearance-none`} required>
                      <option value="">Select Category</option>
                      {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className={labelClass}>Secondary chapter *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    <label className={badgeClass}>
                      <input type="checkbox" checked={formData.chapters_applied.includes('No secondary chapter')} onChange={() => handleArrayChange('chapters_applied', 'No secondary chapter')} className="w-5 h-5 text-fitis-blue rounded-md border-slate-300 focus:ring-fitis-blue focus:ring-offset-2 transition-all" />
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-fitis-blue transition-colors">No secondary chapter</span>
                    </label>
                    {CHAPTER_OPTIONS.map(opt => (
                      <label key={opt} className={badgeClass}>
                        <input type="checkbox" checked={formData.chapters_applied.includes(opt)} onChange={() => handleArrayChange('chapters_applied', opt)} className="w-5 h-5 text-fitis-blue rounded-md border-slate-300 focus:ring-fitis-blue focus:ring-offset-2 transition-all" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-fitis-blue transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Company Name *</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className={inputClass} placeholder="Enter full registered company name" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Name of the CEO / Managing Director</label>
                  <input type="text" name="ceo_name" value={formData.ceo_name} onChange={handleChange} className={inputClass} placeholder="Full name of CEO/MD" />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Company Address</label>
                  <textarea name="company_address" value={formData.company_address} onChange={handleChange} className={inputClass} rows={3} placeholder="Full postal address" required />
                </div>
              </div>
            </div>

            {/* Section B */}
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>B. Organization Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+94 11 234 5678" required />
                </div>
                <div>
                  <label className={labelClass}>Fax</label>
                  <input type="text" name="fax" value={formData.fax} onChange={handleChange} className={inputClass} placeholder="+94 11 234 5679" />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="info@company.com" required />
                </div>
                <div>
                  <label className={labelClass}>Company Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className={inputClass} placeholder="https://www.company.com" />
                </div>
              </div>
            </div>

            {/* Section C */}
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>C. Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                <div>
                  <label className={labelClass}>Business Registration Number *</label>
                  <input type="text" name="br_number" value={formData.br_number} onChange={handleChange} className={inputClass} placeholder="PV 12345" required />
                </div>
                <div>
                  <label className={labelClass}>Year of Incorporation</label>
                  <input type="text" name="year_incorporation" value={formData.year_incorporation} onChange={handleChange} className={inputClass} placeholder="YYYY" required />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>BOI No (If Applicable)</label>
                  <input type="text" name="boi_no" value={formData.boi_no} onChange={handleChange} className={inputClass} placeholder="Enter BOI Reg No." />
                </div>
                <div>
                  <label className={labelClass}>Ownership % Local</label>
                  <div className="relative">
                    <input type="text" name="ownership_local" value={formData.ownership_local} onChange={handleChange} className={inputClass} placeholder="100" />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Ownership % Foreign</label>
                  <div className="relative">
                    <input type="text" name="ownership_foreign" value={formData.ownership_foreign} onChange={handleChange} className={inputClass} placeholder="0" />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Briefly explain Business Activities *</label>
                  <textarea name="business_activities" value={formData.business_activities} onChange={handleChange} className={inputClass} rows={4} placeholder="Describe core products/services..." required />
                </div>
                <div className="md:col-span-2 mt-2">
                  <label className={labelClass}>Industry Focus *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <label key={opt} className={badgeClass}>
                        <input type="checkbox" checked={formData.industry_focus.includes(opt)} onChange={() => handleArrayChange('industry_focus', opt)} className="w-5 h-5 text-fitis-blue rounded-md border-slate-300 focus:ring-fitis-blue focus:ring-offset-2 transition-all" />
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-fitis-blue transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Revenue Ratio % Local</label>
                  <div className="relative">
                    <input type="text" name="revenue_local" value={formData.revenue_local} onChange={handleChange} className={inputClass} placeholder="80" />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Revenue Ratio % Foreign</label>
                  <div className="relative">
                    <input type="text" name="revenue_foreign" value={formData.revenue_foreign} onChange={handleChange} className={inputClass} placeholder="20" />
                    <span className="absolute right-5 top-4 text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Number of Employees *</label>
                  <div className="relative">
                    <select name="employees_count" value={formData.employees_count} onChange={handleChange} className={`${inputClass} appearance-none`} required>
                      <option value="">Select Employee Count</option>
                      {EMPLOYEES_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sections D & E */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className={`${sectionClass} md:p-10 basis-full`}>
                <h3 className={sectionTitleClass}>D. Primary Nominee</h3>
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Name *</label>
                    <input type="text" value={formData.primary_nominee.name} onChange={(e) => handleNestedChange('primary_nominee', 'name', e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Designation *</label>
                    <input type="text" value={formData.primary_nominee.designation} onChange={(e) => handleNestedChange('primary_nominee', 'designation', e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input type="tel" value={formData.primary_nominee.phone} onChange={(e) => handleNestedChange('primary_nominee', 'phone', e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input type="email" value={formData.primary_nominee.email} onChange={(e) => handleNestedChange('primary_nominee', 'email', e.target.value)} className={inputClass} required />
                  </div>
                </div>
              </div>

              <div className={`${sectionClass} md:p-10 basis-full`}>
                <h3 className={sectionTitleClass}>E. Secondary Nominee</h3>
                <div className="space-y-6">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input type="text" value={formData.secondary_nominee.name} onChange={(e) => handleNestedChange('secondary_nominee', 'name', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Designation</label>
                    <input type="text" value={formData.secondary_nominee.designation} onChange={(e) => handleNestedChange('secondary_nominee', 'designation', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number</label>
                    <input type="tel" value={formData.secondary_nominee.phone} onChange={(e) => handleNestedChange('secondary_nominee', 'phone', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <input type="email" value={formData.secondary_nominee.email} onChange={(e) => handleNestedChange('secondary_nominee', 'email', e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section F */}
            <div className={sectionClass}>
              <h3 className={sectionTitleClass}>F. Upload Documents</h3>
              <p className="text-sm font-medium text-slate-500 mb-8 bg-slate-50 border border-slate-200 p-4 rounded-xl border-l-4 border-l-fitis-blue">Please upload the required documents in PDF, JPG, or PNG format (Max 20MB per file).</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border-2 border-dashed border-slate-200 hover:border-fitis-blue/50 rounded-2xl bg-white transition-colors group">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Business Registration *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'business_registration')} className={fileInputClass} required />
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 hover:border-fitis-blue/50 rounded-2xl bg-white transition-colors group">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Audited Accounts (Latest) *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'audited_accounts')} className={fileInputClass} required />
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 hover:border-fitis-blue/50 rounded-2xl bg-white transition-colors group">
                  <label className="block text-sm font-bold text-slate-800 mb-3">Company Profile *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'company_profile')} className={fileInputClass} required />
                </div>
                <div className="p-6 border-2 border-dashed border-slate-200 hover:border-fitis-blue/50 rounded-2xl bg-white transition-colors group">
                  <label className="block text-sm font-bold text-slate-800 mb-3">FORM 20 *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'form_20')} className={fileInputClass} required={true} />
                </div>
              </div>
            </div>

            {/* Section G */}
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-fitis-blue/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
              
              <h3 className="text-3xl font-black text-slate-900 border-b-2 border-slate-200 pb-5 mb-8 flex items-center gap-4">G. Declaration by Applicant</h3>

              <div className="prose prose-slate max-w-none text-slate-600 mb-10 text-lg leading-relaxed bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <p className="mb-4">We hereby apply for membership of the Federation of Information Technology Industry Sri Lanka (FITIS). If admitted to Membership, we agree to abide by the Memorandum and Articles of Association of FITIS and its Chapters, as well as the rules and regulations, and code of conduct governing its Membership.</p>
                <p>We declare that the information provided in this application is true and correct to the best of our knowledge and belief. We understand that any false information may result in the rejection of this application or subsequent termination of membership.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {/* Full Member */}
                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <h4 className="font-bold text-fitis-gold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Full Member (Annual | Revenue &gt;= LKR 12M) Fee Structure
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between border-b border-white/10 pb-1"><span>Joining Fee (One-time):</span> <span className="font-bold">25,000</span></li>
                    <li className="flex justify-between border-b border-white/10 pb-1"><span>Membership (Annual):</span> <span className="font-bold">50,000</span></li>
                    <li className="flex justify-between"><span>Secondary Chapter (Annual):</span> <span className="font-bold">25,000</span></li>
                  </ul>
                </div>

                {/* Associate Member */}
                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <h4 className="font-bold text-fitis-gold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Associate Member (Annual Revenue &lt; LKR 12 M) Fee Structure
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between border-b border-white/10 pb-1"><span>Joining Fee (One-time):</span> <span className="font-bold">10,000</span></li>
                    <li className="flex justify-between border-b border-white/10 pb-1"><span>Membership (Annual):</span> <span className="font-bold">30,000</span></li>
                    <li className="flex justify-between"><span>Secondary Chapter (Annual):</span> <span className="font-bold">10,000</span></li>
                  </ul>
                </div>

                {/* Premier Corporate Partner */}
                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <h4 className="font-bold text-fitis-gold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Premier Corporate Partner
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between"><span>Membership (Annual):</span> <span className="font-bold">500,000</span></li>
                  </ul>
                </div>

                {/* Corporate Partner */}
                <div className="bg-slate-800 text-white p-6 rounded-2xl shadow-xl border border-slate-700">
                  <h4 className="font-bold text-fitis-gold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Corporate Partner Fee Structure
                  </h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex justify-between"><span>Membership (Annual):</span> <span className="font-bold">300,000</span></li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div>
                  <label className={labelClass}>Applicant's Name *</label>
                  <input type="text" name="declaration_applicant_name" value={formData.declaration_applicant_name} onChange={handleChange} className={`${inputClass} bg-white`} required />
                </div>
                <div>
                  <label className={labelClass}>Applicant's Designation *</label>
                  <input type="text" name="declaration_applicant_designation" value={formData.declaration_applicant_designation} onChange={handleChange} className={`${inputClass} bg-white`} required />
                </div>
                <div>
                  <label className={labelClass}>Date *</label>
                  <input type="date" name="declaration_date" value={formData.declaration_date} onChange={handleChange} className={`${inputClass} bg-white`} required />
                </div>
              </div>

              <label className="flex items-start space-x-4 mb-12 p-6 bg-white border-2 border-slate-200 rounded-2xl cursor-pointer hover:border-fitis-blue transition-colors shadow-sm group">
                <input type="checkbox" name="agree_checkbox" checked={formData.agree_checkbox} onChange={handleChange} className="mt-1 w-6 h-6 text-fitis-blue bg-slate-100 rounded border-slate-300 focus:ring-fitis-blue transition-all" required />
                <span className="text-base font-bold text-slate-800 group-hover:text-fitis-blue transition-colors pt-0.5">I hereby certify that I am authorized to sign this application on behalf of the organization.</span>
              </label>

                <div className="text-center pt-4">
                  <button type="submit" disabled={isSubmitting} className={`relative inline-flex items-center justify-center px-16 py-5 text-white font-extrabold text-xl rounded-full shadow-2xl transition-all duration-300 overflow-hidden ${isSubmitting ? 'bg-slate-400 cursor-not-allowed scale-95' : 'bg-gradient-to-r from-fitis-blue to-blue-800 hover:from-blue-600 hover:to-blue-900 hover:scale-105 hover:shadow-blue-900/30'}`}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending OTP...
                      </span>
                    ) : 'Submit Member Application'}
                  </button>
                </div>
              </div>
            </>
          )}


          </form>
        </div>
      </section>
    </div>
  );
};

