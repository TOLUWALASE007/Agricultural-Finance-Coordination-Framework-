import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: 'Prof. Olufemi Adebayo',
    position: 'Lead Research Fellow',
    gender: 'Male',
    birthDate: '1972-01-30',

    // Contact Info - Contact Information
    email: 'olufemi.adebayo@agroresearch.org',
    phone: '+234-802-555-7788',
    whatsapp: '+234-807-555-2233',
    address: 'Institute Avenue, University Research Park',
    city: 'Ibadan',
    state: 'Oyo State',
    country: 'Nigeria',

    // Contact Info - Verification & Emergency
    idType: 'Passport',
    idNumber: 'NGP7788990',
    idDocument: '',
    emergencyContactName: 'Tosin Adebayo',
    emergencyContactPhone: '+234-803-777-8899',
    emergencyRelationship: 'Spouse',

    // Organization Info - Basic Information
    organizationName: 'African Agricultural Research Consortium',
    registrationNumber: 'AARC-REG-2001-018',
    organizationType: 'Research Institution',
    yearEstablished: '2001',
    industry: 'Agricultural Research & Innovation',
    missionStatement: 'Advance evidence-based agricultural innovation through collaborative research and knowledge sharing.',

    // Organization Info - Address & Contact Info
    headquartersAddress: 'Institute Avenue, University Research Park, Ibadan',
    hqCity: 'Ibadan',
    hqState: 'Oyo State',
    hqCountry: 'Nigeria',
    officePhone: '+234-802-555-7788',
    officialEmail: 'info@agroresearch.org',
    website: 'https://agroresearch.org',
    facebook: 'AgroResearchAfrica',
    linkedin: 'african-agricultural-research-consortium',
    twitter: '@AgroResearchNG',
    instagram: 'agroresearch_ng',

    // Organization Info - Operations & Documentation
    numEmployees: '95',
    areasOfOperation: 'Nigeria, Ghana, Kenya, Rwanda',
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'Yes',
    partnershipDetails: 'Research collaborations with universities, PFIs, extension services, and international donors.',

    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'research-projects', name: 'Research Projects', icon: '🧪', href: '/portal/researcher/research-projects' },
    { id: 'data-collection', name: 'Data Collection', icon: '📋', href: '/portal/researcher/data-collection' },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/researcher/publications' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝', href: '/portal/researcher/collaborations' },
    { id: 'funding', name: 'Funding', icon: '💰', href: '/portal/researcher/funding' },
    { id: 'conferences', name: 'Conferences', icon: '🎤', href: '/portal/researcher/conferences' },
    { id: 'reports', name: 'Reports', icon: '📈', href: '/portal/researcher/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const field = (e.target as HTMLInputElement).name;
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Settings saved successfully!', 'success');
  };

  return (
    <PortalLayout role="Researcher" roleIcon="🔬" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Manage your research institution profile and collaboration preferences
            </p>
          </div>
          <button type="submit" form="settings-form" className="btn-primary w-full sm:w-auto justify-center">
            💾 Save Changes
          </button>
        </div>

        {/* Section Tabs */}
        <div className="bg-primary-800 rounded-lg p-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveSection('contact')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'contact'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Contact Info</div>
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('organization')}
              className={`p-3 rounded-lg text-center transition-all duration-200 ${
                activeSection === 'organization'
                  ? 'bg-primary-500 text-white'
                  : 'bg-primary-700 text-gray-300 hover:bg-primary-600 hover:text-white'
              }`}
            >
              <div className="font-medium font-sans">Organization Info</div>
            </button>
          </div>
        </div>

        <form id="settings-form" onSubmit={handleSave} className="space-y-6">
          {activeSection === 'contact' && (
            <>
              {/* Personal Details */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Personal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Position / Role in Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your position/role"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      WhatsApp (Optional)
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter WhatsApp number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Office / Lab Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>

              {/* Verification & Emergency */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Verification & Emergency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Type
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="National ID">National ID</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter's Card">Voter's Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Number
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload ID Document
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.idDocument && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.idDocument}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Relationship with Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === 'organization' && (
            <>
              {/* Basic Information */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter registration number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Organization Type</option>
                      <option value="Research Institution">Research Institution</option>
                      <option value="University">University</option>
                      <option value="Research Center">Research Center</option>
                      <option value="Private Company">Private Company</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Year Established
                    </label>
                    <input
                      type="text"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter year established"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Industry</option>
                      <option value="Agricultural Research & Innovation">Agricultural Research & Innovation</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Biotechnology">Biotechnology</option>
                      <option value="Pharmaceutical">Pharmaceutical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Mission Statement
                    </label>
                    <textarea
                      name="missionStatement"
                      value={formData.missionStatement}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={4}
                      placeholder="Enter mission statement"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Contact Info */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Address & Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Headquarters Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="headquartersAddress"
                      value={formData.headquartersAddress}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter headquarters address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqCity"
                      value={formData.hqCity}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqState"
                      value={formData.hqState}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="hqCountry"
                      value={formData.hqCountry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Office Phone Number
                    </label>
                    <input
                      type="tel"
                      name="officePhone"
                      value={formData.officePhone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter office phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Official Email Address
                    </label>
                    <input
                      type="email"
                      name="officialEmail"
                      value={formData.officialEmail}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter official email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Facebook Page
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter Facebook URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Twitter Handle
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter Twitter URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Instagram Handle
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter Instagram URL"
                    />
                  </div>
                </div>
              </div>

              {/* Operations & Documentation */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Operations & Documentation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Number of Employees
                    </label>
                    <input
                      type="text"
                      name="numEmployees"
                      value={formData.numEmployees}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter number of employees"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Areas of Operation
                    </label>
                    <input
                      type="text"
                      name="areasOfOperation"
                      value={formData.areasOfOperation}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter areas of operation (comma-separated)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload Organization Logo
                    </label>
                    <input
                      type="file"
                      name="organizationLogo"
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.svg"
                      className="input-field"
                    />
                    {formData.organizationLogo && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.organizationLogo}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload Certificate of Incorporation
                    </label>
                    <input
                      type="file"
                      name="certificateOfIncorporation"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.certificateOfIncorporation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Has Partnership
                    </label>
                    <select
                      name="hasPartnership"
                      value={formData.hasPartnership}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Partnership Details
                    </label>
                    <textarea
                      name="partnershipDetails"
                      value={formData.partnershipDetails}
                      onChange={handleInputChange}
                      className="input-field"
                      rows={4}
                      placeholder="Enter partnership details"
                    />
                  </div>
                </div>
              </div>

              {/* Security & Terms */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Security & Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Confirm password"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <label className="text-sm text-gray-300 font-serif">
                        I agree to the <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </PortalLayout>
  );
};

export default Settings;
