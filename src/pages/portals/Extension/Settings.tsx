import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: 'Engr. Samuel Danjuma',
    position: 'Director of Extension Services',
    gender: 'Male',
    birthDate: '1979-03-08',

    // Contact Info - Contact Information
    email: 'samuel.danjuma@nationalextension.ng',
    phone: '+234-806-555-7788',
    whatsapp: '+234-803-112-3344',
    address: 'Extension House, Agricultural Secretariat',
    city: 'Kaduna',
    state: 'Kaduna State',
    country: 'Nigeria',

    // Contact Info - Verification & Emergency
    idType: 'Driver\'s License',
    idNumber: 'KD-EXT-443322',
    idDocument: '',
    emergencyContactName: 'Grace Danjuma',
    emergencyContactPhone: '+234-808-900-1122',
    emergencyRelationship: 'Spouse',

    // Organization Info - Basic Information
    organizationName: 'National Agricultural Extension Service Agency',
    registrationNumber: 'NAESA-REG-2018-009',
    organizationType: 'Government Agency',
    yearEstablished: '2018',
    industry: 'Agricultural Extension & Advisory',
    missionStatement: 'Deliver timely agricultural advisory services and technology transfer to farmers nationwide.',

    // Organization Info - Address & Contact Info
    headquartersAddress: 'Extension House, Samaru, Kaduna',
    hqCity: 'Kaduna',
    hqState: 'Kaduna State',
    hqCountry: 'Nigeria',
    officePhone: '+234-806-555-7788',
    officialEmail: 'info@nationalextension.ng',
    website: 'https://nationalextension.ng',
    facebook: 'NationalExtensionNG',
    linkedin: 'national-extension-service-agency',
    twitter: '@NAESA_NG',
    instagram: 'naesa_ng',

    // Organization Info - Operations & Documentation
    numEmployees: '185',
    areasOfOperation: 'North-West and North-Central',
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'Yes',
    partnershipDetails: 'Collaborating with AFCF, PFIs, Anchor companies, and state ADPs for field support.',

    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training-programs', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training-programs' },
    { id: 'advisory-services', name: 'Advisory Services', icon: '💬', href: '/portal/extension/advisory-services' },
    { id: 'technology-transfer', name: 'Technology Transfer', icon: '⚙️', href: '/portal/extension/technology-transfer' },
    { id: 'field-monitoring', name: 'Field Monitoring', icon: '📋', href: '/portal/extension/field-monitoring' },
    { id: 'reports', name: 'Reports', icon: '📈', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
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
    <PortalLayout role="Extension Service" roleIcon="🌿" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Maintain your extension service profile and outreach preferences
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
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Enter your WhatsApp number"
                    />
                  </div>
                  <div>
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
                      <option value="">Select ID Type</option>
                      <option value="Driver's License">Driver's License</option>
                      <option value="National ID">National ID</option>
                      <option value="Passport">Passport</option>
                      <option value="Other">Other</option>
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
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      ID Document (Upload)
                    </label>
                    <input
                      type="file"
                      name="idDocument"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.idDocument && (
                      <p className="text-sm text-gray-400 mt-1">{formData.idDocument}</p>
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
                      <option value="">Select Relationship</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Parent">Parent</option>
                      <option value="Child">Child</option>
                      <option value="Sibling">Sibling</option>
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
                      <option value="">Select Organization Type</option>
                      <option value="Government Agency">Government Agency</option>
                      <option value="Non-Government Organization">Non-Government Organization</option>
                      <option value="Private Company">Private Company</option>
                      <option value="Academic Institution">Academic Institution</option>
                      <option value="Other">Other</option>
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
                      <option value="Agricultural Extension & Advisory">Agricultural Extension & Advisory</option>
                      <option value="Agricultural Research">Agricultural Research</option>
                      <option value="Agricultural Training">Agricultural Training</option>
                      <option value="Agricultural Technology">Agricultural Technology</option>
                      <option value="Other">Other</option>
                    </select>
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
                      placeholder="Enter your organization's mission statement"
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
                      Office Phone
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
                      Official Email
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
                      Facebook
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
                      LinkedIn
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
                      Twitter
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
                      Instagram
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
                      Number of Employees <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                      placeholder="Enter areas of operation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Organization Logo (Upload)
                    </label>
                    <input
                      type="file"
                      name="organizationLogo"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.organizationLogo && (
                      <p className="text-sm text-gray-400 mt-1">{formData.organizationLogo}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Certificate of Incorporation (Upload)
                    </label>
                    <input
                      type="file"
                      name="certificateOfIncorporation"
                      onChange={handleFileChange}
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 mt-1">{formData.certificateOfIncorporation}</p>
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
                      <option value="">Select Partnership Status</option>
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      required
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-300 font-serif">
                      I agree to the terms and conditions
                    </label>
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
