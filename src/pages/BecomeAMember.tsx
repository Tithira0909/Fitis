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
    other_documents: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const CHAPTER_OPTIONS = ['Software Chapter', 'Hardware Chapter', 'Training Chapter', 'Communication Chapter', 'Professional Chapter'];
  const INDUSTRY_OPTIONS = ['BFI/Banking', 'Telecommunications', 'Logistics & Transportation', 'Healthcare', 'Education', 'Retail/E-commerce', 'Manufacturing'];
  const EMPLOYEES_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const CATEGORY_OPTIONS = ['Corporate', 'Associate', 'Affiliate'];

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

    const payload = new FormData();
    // Append standard fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'chapters_applied' || key === 'industry_focus' || key === 'primary_nominee' || key === 'secondary_nominee') {
        payload.append(`${key}_json`, JSON.stringify(value));
      } else {
        payload.append(key, String(value));
      }
    });

    // Append files
    if (files.business_registration) payload.append('business_registration', files.business_registration);
    if (files.audited_accounts) payload.append('audited_accounts', files.audited_accounts);
    if (files.company_profile) payload.append('company_profile', files.company_profile);
    if (files.other_documents) payload.append('other_documents', files.other_documents);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${baseUrl}/api/membership/apply`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setSuccess(true);
        window.scrollTo(0, 0);
      } else {
        const errorData = await response.json();
        alert(`Failed to submit: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-slate-50 min-h-screen font-sans">
        <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Member' }]} title="BECOME A MEMBER" showSearch={false} />
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Application Submitted Successfully!</h2>
          <p className="text-slate-600 mb-8">Thank you for applying to become a member of FITIS. Our team will review your application and contact you shortly.</p>
          <button onClick={() => window.location.reload()} className="bg-fitis-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">Submit Another Application</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <SubHeaderBar breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Become a Member' }]} title="BECOME A MEMBER" showSearch={false} />

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 uppercase">NEW MEMBER REGISTRATION</h2>
            <div className="text-slate-600 leading-relaxed space-y-4 max-w-3xl mx-auto text-left md:text-center">
              <p>A body corporate should satisfy the eligibility criteria set out for the respective Chapter as stipulated in the Articles of Association of FITIS to become a member.</p>
              <p>Eligible members may apply for membership by duly completing the specified application form together with the supporting documents mentioned therein and the applicable fees.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200 space-y-12">

            {/* Section A */}
            <div>
              <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">A. Membership Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Primary Chapter</label>
                  <select name="primary_chapter" value={formData.primary_chapter} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required>
                    <option value="">Select Primary Chapter</option>
                    {CHAPTER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Membership Category</label>
                  <select name="membership_category" value={formData.membership_category} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required>
                    <option value="">Select Category</option>
                    {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chapter(s) you are applying for *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CHAPTER_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.chapters_applied.includes(opt)} onChange={() => handleArrayChange('chapters_applied', opt)} className="w-4 h-4 text-fitis-blue rounded border-gray-300" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name *</label>
                  <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Name of the CEO / Managing Director</label>
                  <input type="text" name="ceo_name" value={formData.ceo_name} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Address</label>
                  <textarea name="company_address" value={formData.company_address} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" rows={3} required />
                </div>
              </div>
            </div>

            {/* Section B */}
            <div>
              <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">B. Organization Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Fax</label>
                  <input type="text" name="fax" value={formData.fax} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Company Website</label>
                  <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" placeholder="https://" />
                </div>
              </div>
            </div>

            {/* Section C */}
            <div>
              <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">C. Organization Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Business Registration Number *</label>
                  <input type="text" name="br_number" value={formData.br_number} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Year of Incorporation in Sri Lanka *</label>
                  <input type="text" name="year_incorporation" value={formData.year_incorporation} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">BOI No (If Applicable)</label>
                  <input type="text" name="boi_no" value={formData.boi_no} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ownership % Local</label>
                  <input type="text" name="ownership_local" value={formData.ownership_local} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" placeholder="e.g. 100%" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ownership % Foreign</label>
                  <input type="text" name="ownership_foreign" value={formData.ownership_foreign} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" placeholder="e.g. 0%" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Briefly explain Business Activities *</label>
                  <textarea name="business_activities" value={formData.business_activities} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" rows={3} required />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Industry Focus *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {INDUSTRY_OPTIONS.map(opt => (
                      <label key={opt} className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
                        <input type="checkbox" checked={formData.industry_focus.includes(opt)} onChange={() => handleArrayChange('industry_focus', opt)} className="w-4 h-4 text-fitis-blue rounded border-gray-300" />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Revenue Ratio % Local</label>
                  <input type="text" name="revenue_local" value={formData.revenue_local} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" placeholder="e.g. 80%" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Revenue Ratio % Foreign</label>
                  <input type="text" name="revenue_foreign" value={formData.revenue_foreign} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" placeholder="e.g. 20%" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Number of Employees *</label>
                  <select name="employees_count" value={formData.employees_count} onChange={handleChange} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required>
                    <option value="">Select Employee Count</option>
                    {EMPLOYEES_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Sections D & E */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">D. Primary Nominee</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name *</label>
                    <input type="text" value={formData.primary_nominee.name} onChange={(e) => handleNestedChange('primary_nominee', 'name', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Designation *</label>
                    <input type="text" value={formData.primary_nominee.designation} onChange={(e) => handleNestedChange('primary_nominee', 'designation', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input type="tel" value={formData.primary_nominee.phone} onChange={(e) => handleNestedChange('primary_nominee', 'phone', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email *</label>
                    <input type="email" value={formData.primary_nominee.email} onChange={(e) => handleNestedChange('primary_nominee', 'email', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" required />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">E. Secondary Nominee</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Name</label>
                    <input type="text" value={formData.secondary_nominee.name} onChange={(e) => handleNestedChange('secondary_nominee', 'name', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Designation</label>
                    <input type="text" value={formData.secondary_nominee.designation} onChange={(e) => handleNestedChange('secondary_nominee', 'designation', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input type="tel" value={formData.secondary_nominee.phone} onChange={(e) => handleNestedChange('secondary_nominee', 'phone', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                    <input type="email" value={formData.secondary_nominee.email} onChange={(e) => handleNestedChange('secondary_nominee', 'email', e.target.value)} className="w-full border rounded-lg p-3 bg-slate-50 focus:ring-2 focus:ring-fitis-blue outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section F */}
            <div>
              <h3 className="text-xl font-bold text-fitis-blue border-b pb-2 mb-6">F. Upload Documents</h3>
              <p className="text-sm text-slate-500 mb-4">Please upload the required documents in PDF, JPG, or PNG format (Max 20MB per file).</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Registration *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'business_registration')} className="w-full text-sm" required />
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Audited Accounts (Latest) *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'audited_accounts')} className="w-full text-sm" required />
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Company Profile *</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'company_profile')} className="w-full text-sm" required />
                </div>
                <div className="p-4 border rounded-lg bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Other Documents (Optional)</label>
                  <input type="file" onChange={(e) => handleFileChange(e, 'other_documents')} className="w-full text-sm" />
                </div>
              </div>
            </div>

            {/* Section G */}
            <div className="bg-slate-100 p-8 rounded-xl border border-slate-200">
              <h3 className="text-xl font-bold text-fitis-blue border-b border-slate-300 pb-2 mb-6">G. Declaration by Applicant</h3>

              <div className="prose prose-sm max-w-none text-slate-700 mb-6">
                <p>We hereby apply for membership of the Federation of Information Technology Industry Sri Lanka (FITIS). If admitted to Membership, we agree to abide by the Memorandum and Articles of Association of FITIS and its Chapters, as well as the rules and regulations, and code of conduct governing its Membership.</p>
                <p>We declare that the information provided in this application is true and correct to the best of our knowledge and belief. We understand that any false information may result in the rejection of this application or subsequent termination of membership.</p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 mb-8 max-w-md">
                <h4 className="font-bold text-slate-800 mb-2">Applicable Fees:</h4>
                <ul className="text-sm space-y-1 text-slate-700">
                  <li className="flex justify-between"><span>Entrance Fee:</span> <span className="font-semibold">LKR 25,000</span></li>
                  <li className="flex justify-between"><span>Membership Fee (Annual):</span> <span className="font-semibold">LKR 25,000</span></li>
                  <li className="flex justify-between border-t border-slate-100 pt-1 mt-1"><span>Administration Fee:</span> <span className="font-semibold">LKR 5,000</span></li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Applicant's Name *</label>
                  <input type="text" name="declaration_applicant_name" value={formData.declaration_applicant_name} onChange={handleChange} className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Applicant's Designation *</label>
                  <input type="text" name="declaration_applicant_designation" value={formData.declaration_applicant_designation} onChange={handleChange} className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date *</label>
                  <input type="date" name="declaration_date" value={formData.declaration_date} onChange={handleChange} className="w-full border rounded-lg p-3 bg-white focus:ring-2 focus:ring-fitis-blue outline-none" required />
                </div>
              </div>

              <label className="flex items-start space-x-3 mb-8 cursor-pointer">
                <input type="checkbox" name="agree_checkbox" checked={formData.agree_checkbox} onChange={handleChange} className="mt-1 w-5 h-5 text-fitis-blue rounded border-gray-300" required />
                <span className="text-sm font-bold text-slate-800">I hereby certify that I am authorized to sign this application on behalf of the organization.</span>
              </label>

              <div className="text-center">
                <button type="submit" disabled={isSubmitting} className={`px-12 py-4 text-white font-bold text-lg rounded-xl shadow-lg transition-all ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-fitis-blue hover:bg-blue-700 active:scale-95'}`}>
                  {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </section>
    </div>
  );
};
