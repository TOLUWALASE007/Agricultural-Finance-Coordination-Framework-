import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: 'Dr. Sarah Johnson',
    position: 'Chief Executive Officer',
    gender: 'Female',
    birthDate: '1982-04-18',

    // Contact Info - Contact Information
    email: 'sarah.johnson@agritech.com',
    phone: '+234-801-234-5678',
    whatsapp: '+234-807-234-5678',
    address: '789 Industrial Estate',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',

    // Contact Info - Verification & Emergency
    idType: 'Passport',
    idNumber: 'NGP1234567',
    idDocument: '',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '+234-809-111-2233',
    emergencyRelationship: 'Spouse',

    // Organization Info - Basic Information
    organizationName: 'AgriTech Solutions Ltd',
    registrationNumber: 'RC-987654321',
    organizationType: 'Company',
    yearEstablished: '2016',
    industry: 'Agricultural Technology & Input Supply',
    missionStatement: 'Deliver innovative agricultural solutions and supply chain efficiency for smallholder farmers.',

    // Organization Info - Address & Contact Info
    headquartersAddress: '789 Industrial Estate, Lagos',
    hqCity: 'Lagos',
    hqState: 'Lagos State',
    hqCountry: 'Nigeria',
    officePhone: '+234-801-234-5678',
    officialEmail: 'info@agritech.com',
    website: 'https://agritech.com',
    facebook: 'AgriTechNigeria',
    linkedin: 'agritech-solutions',
    twitter: '@AgriTechNG',
    instagram: 'agritech_ng',

    // Organization Info - Operations & Documentation
    numEmployees: '75',
    areasOfOperation: 'Lagos, Ogun, Oyo, Rivers',
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'Yes',
    partnershipDetails: 'Strategic partnerships with PFIs, Anchor companies, and cooperative groups.',

    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/lead-firm' },
    { id: 'scheme-application', name: 'Schemes Application', icon: '📝', href: '/portal/lead-firm/scheme-application' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/lead-firm/settings' }
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
    <PortalLayout role="Lead Firm" roleIcon="🌱" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Manage your account information and preferences
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
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Residential / Office Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your address"
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
                      ID Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select ID Type</option>
                      <option value="National ID">National ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="Voter's Card">Voter's Card</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter your ID number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Upload ID Document <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleFileChange}
                      required
                      className="input-field"
                    />
                    {formData.idDocument && (
                      <p className="text-sm text-gray-400 mt-2">Selected file: {formData.idDocument}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter emergency contact name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Contact Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="emergencyContactPhone"
                      value={formData.emergencyContactPhone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter emergency contact phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Emergency Relationship <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Other">Other</option>
                    </select>
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
                      Registration Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
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
                      <option value="">Select organization type</option>
                      <option value="Company">Company</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Cooperative">Cooperative</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Year Established <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter year established"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter industry"
                    />
                  </div>
                  <div>
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
                      Office Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="officePhone"
                      value={formData.officePhone}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter office phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Official Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="officialEmail"
                      value={formData.officialEmail}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter official email"
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
                      Facebook
                    </label>
                    <input
                      type="text"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter Facebook URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter LinkedIn URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Twitter
                    </label>
                    <input
                      type="text"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter Twitter URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
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
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="numEmployees"
                      value={formData.numEmployees}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter number of employees"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Areas of Operation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="areasOfOperation"
                      value={formData.areasOfOperation}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter areas of operation (comma-separated)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Logo
                    </label>
                    <input
                      type="file"
                      name="organizationLogo"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.organizationLogo && (
                      <p className="text-sm text-gray-400 mt-2">Selected file: {formData.organizationLogo}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Certificate of Incorporation
                    </label>
                    <input
                      type="file"
                      name="certificateOfIncorporation"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 mt-2">Selected file: {formData.certificateOfIncorporation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Has Partnership <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hasPartnership"
                      value={formData.hasPartnership}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select partnership status</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div>
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
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
                    />
                    <label className="text-sm font-medium font-sans text-gray-300">
                      I agree to the terms and conditions
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">ℹ️ System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Account ID:</span>
                <span className="text-gray-100 font-sans">LEAD-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Registration Date:</span>
                <span className="text-gray-100 font-sans">March 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Last Login:</span>
                <span className="text-gray-100 font-sans">Today, 3:45 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Account Status:</span>
                <span className="text-green-400 font-sans">Active</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">API Version:</span>
                <span className="text-gray-100 font-sans">v2.1.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Database Version:</span>
                <span className="text-gray-100 font-sans">PostgreSQL 14.2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">System Uptime:</span>
                <span className="text-gray-100 font-sans">99.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Support Level:</span>
                <span className="text-blue-400 font-sans">Standard</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
