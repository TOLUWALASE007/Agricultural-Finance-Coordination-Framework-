import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: 'Dr. Amina Mohammed',
    position: 'Director General',
    gender: 'Female',
    birthDate: '1978-02-11',

    // Contact Info - Contact Information
    email: 'amina.mohammed@afcf.gov.ng',
    phone: '+234-904-000-1122',
    whatsapp: '+234-904-000-1133',
    address: 'Federal Secretariat Complex, Phase III',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    country: 'Nigeria',

    // Contact Info - Verification & Emergency
    idType: 'National ID',
    idNumber: 'FCT-001-778899',
    idDocument: '',
    emergencyContactName: 'Usman Mohammed',
    emergencyContactPhone: '+234-809-111-4455',
    emergencyRelationship: 'Spouse',

    // Organization Info - Basic Information
    organizationName: 'Agricultural Finance Coordination Framework',
    registrationNumber: 'AFCF-NG-2023-001',
    organizationType: 'Government Agency',
    yearEstablished: '2023',
    industry: 'Agricultural Finance Oversight',
    missionStatement: 'Coordinate agricultural finance stakeholders and ensure equitable distribution of funds across the nation.',

    // Organization Info - Address & Contact Info
    headquartersAddress: 'Federal Secretariat Complex, Shehu Shagari Way, Abuja',
    hqCity: 'Abuja',
    hqState: 'Federal Capital Territory',
    hqCountry: 'Nigeria',
    officePhone: '+234-9-461-5000',
    officialEmail: 'info@afcf.gov.ng',
    website: 'https://afcf.gov.ng',
    facebook: 'AFCFNigeria',
    linkedin: 'agricultural-finance-coordination-framework',
    twitter: '@AFCF_Nigeria',
    instagram: 'afcf_nigeria',

    // Organization Info - Operations & Documentation
    numEmployees: '320',
    areasOfOperation: '36 States + FCT',
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'Yes',
    partnershipDetails: 'Strategic partnerships with Fund Providers, PFIs, Anchor firms, and state monitoring teams.',

    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const sidebarItems = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: '🏠',
      href: '/portal/coordinating-agency',
      hasDropdown: true,
      dropdownItems: [
        { id: 'activities', name: 'Activities', icon: '⚡', href: '/portal/coordinating-agency/activities' },
        { id: 'fund-schemes', name: 'Fund Schemes', icon: '💼', href: '/portal/coordinating-agency/fund-schemes' },
        { id: 'reportings', name: 'Reports', icon: '📑', href: '/portal/coordinating-agency/reportings' },
        { id: 'trainings', name: 'Trainings', icon: '📚', href: '/portal/coordinating-agency/trainings' }
      ]
    },
    { id: 'state-monitoring', name: 'State Monitoring Team', icon: '🗺️', href: '/portal/coordinating-agency/monitoring/state' },
    {
      id: 'representative-body',
      name: 'Representative Body',
      icon: '🏛️',
      href: '/portal/coordinating-agency/representative',
      hasDropdown: true,
      dropdownItems: [
        { id: 'rep-insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/representative/insurance-companies' },
        { id: 'rep-extension', name: 'Extension Organizations', icon: '🌿', href: '/portal/coordinating-agency/representative/extension-organizations' },
        { id: 'rep-ngos', name: 'NGOs', icon: '🤝', href: '/portal/coordinating-agency/representative/ngos' }
      ]
    },
    {
      id: 'applicants',
      name: 'Applicants',
      icon: '📝',
      href: '/portal/coordinating-agency/applicants',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-provider', name: 'Fund Provider', icon: '💼', href: '/portal/coordinating-agency/applicants/fund-provider' },
        { id: 'pfis', name: 'PFIs', icon: '🏦', href: '/portal/coordinating-agency/applicants/pfis' },
        { id: 'insurance', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
        {
          id: 'fund-beneficiaries',
          name: 'Fund Beneficiaries',
          icon: '👥',
          href: '/portal/coordinating-agency/fund-beneficiaries',
          hasDropdown: true,
          dropdownItems: [
            { id: 'lead-firms', name: 'Lead Firms', icon: '🏢', href: '/portal/coordinating-agency/fund-beneficiaries/lead-firms' },
            { id: 'anchors', name: 'Anchors', icon: '⚓', href: '/portal/coordinating-agency/fund-beneficiaries/anchors' },
            { id: 'cooperative-groups', name: 'Cooperative Groups', icon: '🤝', href: '/portal/coordinating-agency/fund-beneficiaries/cooperative-groups' },
            { id: 'producers-farmers', name: 'Producers/Farmers', icon: '🌾', href: '/portal/coordinating-agency/fund-beneficiaries/producers-farmers' }
          ]
        }
      ]
    },
    {
      id: 'stakeholders',
      name: 'Department',
      icon: '🤝',
      href: '/portal/coordinating-agency/stakeholders',
      hasDropdown: true,
      dropdownItems: [
        { id: 'fund-management', name: 'Fund Management Department', icon: '💼', href: '/portal/coordinating-agency/stakeholders/fund-management' },
        { id: 'credit-risk', name: 'Agricultural Credit Risk Management Department', icon: '📊', href: '/portal/coordinating-agency/stakeholders/credit-risk' },
        { id: 'insurance', name: 'Agricultural Insurance Management Department', icon: '🛡️', href: '/portal/coordinating-agency/stakeholders/insurance' },
        { id: 'finance', name: 'Finance and Accounting Department', icon: '🪙', href: '/portal/coordinating-agency/stakeholders/finance' },
        { id: 'legal', name: 'Legal Department', icon: '⚖️', href: '/portal/coordinating-agency/stakeholders/legal' },
        { id: 'it', name: 'IT Department', icon: '💻', href: '/portal/coordinating-agency/stakeholders/it' },
        { id: 'training', name: 'Training Department', icon: '📚', href: '/portal/coordinating-agency/stakeholders/training' }
      ]
    },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/coordinating-agency/publications' },
    { id: 'blog', name: 'Blog', icon: '📰', href: '/portal/coordinating-agency/blog' },
    { id: 'faqs', name: 'FAQs', icon: '❓', href: '/portal/coordinating-agency/faqs' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
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
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Manage your coordinating agency profile and operation preferences
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
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your country"
                    />
                  </div>
                </div>
              </div>

              {/* Verification & Emergency Contact */}
              <div className="card">
                <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Verification & Emergency Contact</h3>
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
                      placeholder="Enter your ID number"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Document (Upload)
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      accept="image/*,application/pdf"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.idDocument && (
                      <p className="text-sm text-gray-400 font-serif mt-2">
                        Current file: {formData.idDocument}
                      </p>
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
                      Emergency Relationship
                    </label>
                    <select
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Child">Child</option>
                      <option value="Friend">Friend</option>
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
                      <option value="Government Agency">Government Agency</option>
                      <option value="Private Limited Company">Private Limited Company</option>
                      <option value="Public Limited Company">Public Limited Company</option>
                      <option value="Non-Profit Organization">Non-Profit Organization</option>
                      <option value="Partnership">Partnership</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Year Established <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="yearEstablished"
                      value={formData.yearEstablished}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter year established"
                    />
                  </div>
                  <div className="md:col-span-2">
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
                  <div className="md:col-span-2">
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
                      City
                    </label>
                    <input
                      type="text"
                      name="hqCity"
                      value={formData.hqCity}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="hqState"
                      value={formData.hqState}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="hqCountry"
                      value={formData.hqCountry}
                      onChange={handleInputChange}
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Website URL
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
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Social Media Links
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium font-sans text-gray-300 mb-1">Facebook</label>
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
                        <label className="block text-sm font-medium font-sans text-gray-300 mb-1">LinkedIn</label>
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
                        <label className="block text-sm font-medium font-sans text-gray-300 mb-1">Twitter</label>
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
                        <label className="block text-sm font-medium font-sans text-gray-300 mb-1">Instagram</label>
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
                      placeholder="Enter areas of operation"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Logo (Upload)
                    </label>
                    <input
                      type="file"
                      name="organizationLogo"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.organizationLogo && (
                      <p className="text-sm text-gray-400 font-serif mt-2">
                        Current file: {formData.organizationLogo}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Certificate of Incorporation (Upload)
                    </label>
                    <input
                      type="file"
                      name="certificateOfIncorporation"
                      accept="application/pdf"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 font-serif mt-2">
                        Current file: {formData.certificateOfIncorporation}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Has Partnership?
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
                  {formData.hasPartnership === 'Yes' && (
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
                  )}
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
                      className="input-field"
                      placeholder="Create password"
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
                      className="input-field"
                      placeholder="Confirm password"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <span className="text-sm text-gray-300">
                        I agree to the terms and conditions <span className="text-red-500">*</span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}
        </form>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
