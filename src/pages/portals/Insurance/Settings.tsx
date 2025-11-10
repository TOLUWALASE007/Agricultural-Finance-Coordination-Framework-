import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contact' | 'organization'>('contact');

  const [formData, setFormData] = useState({
    // Contact Info - Personal Details
    fullName: 'Mrs. Chidinma Okafor',
    position: 'Head of Agricultural Insurance',
    gender: 'Female',
    birthDate: '1984-09-27',

    // Contact Info - Contact Information
    email: 'chidinma.okafor@africainsure.com',
    phone: '+234-902-345-6789',
    whatsapp: '+234-907-456-7890',
    address: 'Insurance House, Central Business District',
    city: 'Abuja',
    state: 'Federal Capital Territory',
    country: 'Nigeria',

    // Contact Info - Verification & Emergency
    idType: 'Passport',
    idNumber: 'NGP4455667',
    idDocument: '',
    emergencyContactName: 'Emeka Okafor',
    emergencyContactPhone: '+234-803-555-2211',
    emergencyRelationship: 'Spouse',

    // Organization Info - Basic Information
    organizationName: 'Africa Sure Insurance Plc',
    registrationNumber: 'RC-INS-2020-114',
    organizationType: 'Insurance Company',
    yearEstablished: '2010',
    industry: 'Agricultural Insurance',
    missionStatement: 'Provide resilient agricultural risk protection for farmers, PFIs, and anchors across Nigeria.',

    // Organization Info - Address & Contact Info
    headquartersAddress: 'Insurance House, Central Business District, Abuja',
    hqCity: 'Abuja',
    hqState: 'Federal Capital Territory',
    hqCountry: 'Nigeria',
    officePhone: '+234-902-345-6789',
    officialEmail: 'info@africainsure.com',
    website: 'https://africainsure.com',
    facebook: 'AfricaSureInsurance',
    linkedin: 'africa-sure-insurance',
    twitter: '@AfricaSureIns',
    instagram: 'africasurengl',

    // Organization Info - Operations & Documentation
    numEmployees: '210',
    areasOfOperation: 'Nationwide (36 States + FCT)',
    organizationLogo: '',
    certificateOfIncorporation: '',
    hasPartnership: 'Yes',
    partnershipDetails: 'Partnered with AFCF, PFIs, and international reinsurers for risk pooling.',

    // Organization Info - Security & Terms
    password: '',
    confirmPassword: '',
    agreeToTerms: true
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'policies', name: 'Policies', icon: '📄', href: '/portal/insurance/policies' },
    { id: 'claims', name: 'Claims', icon: '⚖️', href: '/portal/insurance/claims' },
    { id: 'risk-assessment', name: 'Risk Assessment', icon: '🛡️', href: '/portal/insurance/risk-assessment' },
    { id: 'reports', name: 'Reports', icon: '📈', href: '/portal/insurance/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
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
    <PortalLayout role="Insurance Company" roleIcon="🛡️" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-sm md:text-base text-gray-400 font-serif mt-2">
              Update your organization profile and insurance operation preferences
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
                    <label className="block text-sm font-medium.font-sans text-gray-300 mb-2">
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
                      Office Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter office address"
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
                      placeholder="Enter city"
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
                      placeholder="Enter state"
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
                      Registration Number / CAC Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter registration/CAC number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Type of Organization <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="Insurance Company">Insurance Company</option>
                      <option value="Reinsurance Company">Reinsurance Company</option>
                      <option value="Broker">Broker</option>
                      <option value="Micro-Insurance">Micro-Insurance</option>
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
                      placeholder="Enter year"
                      min="1950"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Industry / Sector <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Enter industry/sector"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Short Description / Mission Statement <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="missionStatement"
                      value={formData.missionStatement}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="input-field"
                      placeholder="Enter mission statement or description"
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
                      Website (Optional)
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
                      Facebook (Optional)
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
                      LinkedIn (Optional)
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
                      Twitter (Optional)
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
                      Instagram (Optional)
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
                      placeholder="e.g., Nationwide (36 States + FCT)"
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
                      accept=".jpg,.jpeg,.png,.svg"
                      className="input-field"
                    />
                    {formData.organizationLogo && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.organizationLogo}</p>
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
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="input-field"
                    />
                    {formData.certificateOfIncorporation && (
                      <p className="text-sm text-gray-400 font-serif mt-2">Current: {formData.certificateOfIncorporation}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-sans text-gray-300 mb-2">
                      Partnership Details
                    </label>
                    <textarea
                      name="partnershipDetails"
                      value={formData.partnershipDetails}
                      onChange={handleInputChange}
                      rows={4}
                      className="input-field"
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
                      placeholder="Enter new password"
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
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="mr-2 text-primary-500 focus:ring-primary-500 border-gray-600 rounded text-sm"
                      />
                      <span className="text-sm text-gray-300 font-serif">
                        I agree to the <a href="#" className="text-primary-400 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-400 hover:underline">Privacy Policy</a>
                      </span>
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
