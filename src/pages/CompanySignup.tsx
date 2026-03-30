import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Building2, User, Link as LinkIcon, Mail, Phone, Hash, Upload, CheckCircle2 } from 'lucide-react';

export const CompanySignup = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    primary_chapter: '',
    secondary_chapter: '',
    fitis_membership_id: '',
    company_id: '',
    official_email: '',
    company_linkedin: '',
    website_link: '',
    rep_name: '',
    rep_email: '',
    rep_mobile: '',
    rep_designation: '',
    password: '',
    confirm_password: '',
    services: ''
  });

  const CHAPTER_OPTIONS = ['ICT Infrastructure Chapter', 'Software Chapter', 'Digital Services Chapter', 'Education & Training Chapter', 'Communication Chapter', 'Digital Trust Chapter'];

  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [repImage, setRepImage] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'filling' | 'verifying'>('filling');
  const [otpCode, setOtpCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState('');

  const passwordRequirements = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'One uppercase letter', regex: /[A-Z]/ },
    { label: 'One lowercase letter', regex: /[a-z]/ },
    { label: 'One number', regex: /[0-9]/ },
    { label: 'One special character', regex: /[^A-Za-z0-9]/ },
  ];

  const getPasswordStrength = () => {
    return passwordRequirements.filter(req => req.regex.test(formData.password)).length;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    const strength = getPasswordStrength();
    if (strength < passwordRequirements.length) {
      setError("Please ensure your password meets all strong password requirements.");
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }


    setIsSubmitting(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.official_email }),
      });

      if (response.ok) {
        setStep('verifying');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const result = await response.json();
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err: any) {
      setError(err.message);
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
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      // 1. Verify OTP
      const verifyRes = await fetch(`${baseUrl}/api/membership/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.official_email, otp: otpCode }),
      });

      if (!verifyRes.ok) {
        const err = await verifyRes.json();
        setOtpError(err.error || 'Invalid OTP');
        setIsVerifying(false);
        return;
      }

      // 2. Final Submission
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirm_password') data.append(key, value);
      });

      if (companyLogo) data.append('company_logo', companyLogo);
      if (repImage) data.append('rep_image', repImage);

      const res = await fetch(`${baseUrl}/api/community/apply`, {
        method: 'POST',
        body: data
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to submit application');
      }

      setSubmitSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setOtpError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsSubmitting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.official_email }),
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
      <div className="bg-[#0a1128] text-white py-12 md:py-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 bg-blue-600/30 text-blue-200 font-bold tracking-widest text-xs rounded-full mb-4 uppercase border border-blue-500/30">Community Directory</span>
          <h1 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight">Join the Member Community</h1>
          <p className="text-base md:text-lg text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
            Showcase your organization in the FITIS Member Community index. Fill the form below to register your company and its representative.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 w-full -mt-6 md:-mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 md:p-12">


          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200 flex items-start">
              <svg className="w-5 h-5 mt-0.5 mr-3 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 'verifying' ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
                <p className="text-gray-600 mb-8 max-w-sm mx-auto">
                  We've sent a code to <span className="font-bold text-blue-600">{formData.official_email}</span>.
                </p>

                <div className="max-w-xs mx-auto mb-8">
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    className="w-full text-center text-2xl md:text-3xl font-bold tracking-[0.3em] md:tracking-[0.5em] py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-all outline-none"
                    placeholder="000000"
                  />

                  {otpError && <p className="text-red-500 text-sm font-bold mt-4">{otpError}</p>}
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={handleVerifyAndSubmit}
                    disabled={isVerifying}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    {isVerifying ? 'Verifying...' : 'Complete Registration'}
                  </button>
                  <div className="flex justify-between text-sm">
                    <button type="button" onClick={() => setStep('filling')} className="text-gray-500 hover:text-gray-800">
                      ← Edit Form
                    </button>
                    <button type="button" onClick={handleResendOTP} className="text-blue-600 font-bold hover:underline">
                      Resend Code
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>

            
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
                    <input type="text" name="fitis_membership_id" value={formData.fitis_membership_id} onChange={handleChange} className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="e.g. FM0000" />
                  </div>
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

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Services Offered *</label>
                  <textarea 
                    name="services" 
                    required 
                    value={formData.services} 
                    onChange={handleChange as any} 
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none" 
                    placeholder="Software Services | Digital Solutions | IT Consultancy | Cloud Services | etc."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 block">Company Logo *</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors p-4">
                      <div className="flex flex-col items-center justify-center pt-2 pb-3">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 text-center"><span className="font-semibold text-blue-600">Click to upload</span> or drag and drop</p>

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
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700">Password *</label>
                  <input 
                    type="password" 
                    name="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" 
                    placeholder="••••••••" 
                  />
                  
                  {/* Password Strength Indicator */}
                  <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex gap-1 h-1.5">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`flex-1 rounded-full transition-all duration-500 ${
                            getPasswordStrength() >= level 
                              ? (getPasswordStrength() <= 2 ? 'bg-red-400' : getPasswordStrength() <= 4 ? 'bg-yellow-400' : 'bg-green-500')
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <ul className="text-xs space-y-1.5">
                      {passwordRequirements.map((req, idx) => (
                        <li key={idx} className={`flex items-center gap-2 ${req.regex.test(formData.password) ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                          {req.regex.test(formData.password) ? '✓' : '○'} {req.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Confirm Password *</label>
                  <input type="password" name="confirm_password" required value={formData.confirm_password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none" placeholder="••••••••" />
                </div>
              </div>

            </div>

                <div className="pt-6 border-t border-gray-100 flex justify-center md:justify-end">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-blue-600/30 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? 'Sending OTP...' : 'Apply to Join Community'}
                  </button>
                </div>

              </>
            )}

          </form>

        </div>
      </div>
    </div>
  );
};
