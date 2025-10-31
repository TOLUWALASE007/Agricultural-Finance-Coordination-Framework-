import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';

const CoordinatingAgencySettings: React.FC = () => {
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
    { 
      id: 'state-monitoring', 
      name: 'State Monitoring Team', 
      icon: '🗺️', 
      href: '/portal/coordinating-agency/monitoring/state'
    },
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
        { id: 'insurance-companies', name: 'Insurance Companies', icon: '🛡️', href: '/portal/coordinating-agency/applicants/insurance-companies' },
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

  const [formData, setFormData] = useState({
    companyName: 'Agricultural Finance Coordination Framework',
    companyId: 'AFCF-NG-2023-001',
    taxId: 'TIN-123456789',
    legalStatus: 'Government Agency',
    fieldOfBusiness: 'Agricultural Finance Coordination',
    registeredOffice: 'Federal Secretariat Complex',
    state: 'Federal Capital Territory',
    postalCode: '900001',
    street: 'Shehu Shagari Way, Central Business District',
    email: 'info@afcf.gov.ng',
    companyPhoneNumber: '+234-9-461-5000',
    websiteUrl: 'https://www.afcf.gov.ng',
    contactPersonName: 'Dr. Amina Mohammed',
    contactPersonTitle: 'Director General',
    contactPersonEmailAddress: 'amina.mohammed@afcf.gov.ng',
    contactPersonDesignation: 'Head of Agency',
		contactPersonPassport: '',
		agencyLogo: '',
		primaryColor: '#0ea5e9',
		secondaryColor: '#22c55e',
		notificationEmailEnabled: true,
		notificationSmsEnabled: false,
		notificationInAppEnabled: true,
		twoFactorEnabled: false,
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
			// In a real application, you would upload the file
			const field = (e.target as HTMLInputElement).name as 'contactPersonPassport' | 'agencyLogo';
			setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

	const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
		if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
			if (formData.newPassword !== formData.confirmPassword) {
				alert('New password and confirm password do not match.');
				return;
			}
		}
    alert('Settings updated successfully!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default settings?')) {
			setFormData({
        companyName: 'Agricultural Finance Coordination Framework',
        companyId: 'AFCF-NG-2023-001',
        taxId: 'TIN-123456789',
        legalStatus: 'Government Agency',
        fieldOfBusiness: 'Agricultural Finance Coordination',
        registeredOffice: 'Federal Secretariat Complex',
        state: 'Federal Capital Territory',
        postalCode: '900001',
        street: 'Shehu Shagari Way, Central Business District',
        email: 'info@afcf.gov.ng',
        companyPhoneNumber: '+234-9-461-5000',
        websiteUrl: 'https://www.afcf.gov.ng',
        contactPersonName: 'Dr. Amina Mohammed',
        contactPersonTitle: 'Director General',
        contactPersonEmailAddress: 'amina.mohammed@afcf.gov.ng',
        contactPersonDesignation: 'Head of Agency',
				contactPersonPassport: '',
				agencyLogo: '',
				primaryColor: '#0ea5e9',
				secondaryColor: '#22c55e',
				notificationEmailEnabled: true,
				notificationSmsEnabled: false,
				notificationInAppEnabled: true,
				twoFactorEnabled: false,
				currentPassword: '',
				newPassword: '',
				confirmPassword: ''
      });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coordinating-agency-settings.json';
    link.click();
  };

  return (
    <PortalLayout 
      role="Coordinating Agency (Super Admin)" 
      roleIcon="🏛️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your coordinating agency account settings and preferences</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={handleReset}
              className="btn-secondary w-full sm:w-auto"
            >
              🔄 Reset to Defaults
            </button>
            <button 
              onClick={handleExport}
              className="btn-secondary w-full sm:w-auto"
            >
              📤 Export Settings
            </button>
          </div>
        </div>

		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Branding & Logo */}
			<div className="card">
				<h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Branding & Logo</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<label className="block text-sm font-medium text-gray-300 font-serif mb-2">Agency Logo</label>
						<input
							type="file"
							name="agencyLogo"
							accept="image/*"
							onChange={handleFileChange}
							className="input-field"
						/>
						{formData.agencyLogo && (
							<p className="text-sm text-gray-400 font-serif mt-2">Current file: {formData.agencyLogo}</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-300 font-serif mb-2">Primary Color</label>
							<input
								type="color"
								name="primaryColor"
								value={formData.primaryColor}
								onChange={handleInputChange}
								className="w-16 h-10 p-0 bg-transparent border border-primary-600 rounded"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-300 font-serif mb-2">Secondary Color</label>
							<input
								type="color"
								name="secondaryColor"
								value={formData.secondaryColor}
								onChange={handleInputChange}
								className="w-16 h-10 p-0 bg-transparent border border-primary-600 rounded"
							/>
						</div>
					</div>
				</div>
			</div>
          {/* Company Information */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Company ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Tax ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Legal Status <span className="text-red-400">*</span>
                </label>
                <select
                  name="legalStatus"
                  value={formData.legalStatus}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="Government Agency">Government Agency</option>
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Non-Profit Organization">Non-Profit Organization</option>
                  <option value="Partnership">Partnership</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Field of Business <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="fieldOfBusiness"
                  value={formData.fieldOfBusiness}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Office Address */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Office Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Registered Office <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="registeredOffice"
                  value={formData.registeredOffice}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Street <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="Federal Capital Territory">Federal Capital Territory</option>
                  <option value="Abia">Abia</option>
                  <option value="Adamawa">Adamawa</option>
                  <option value="Akwa Ibom">Akwa Ibom</option>
                  <option value="Anambra">Anambra</option>
                  <option value="Bauchi">Bauchi</option>
                  <option value="Bayelsa">Bayelsa</option>
                  <option value="Benue">Benue</option>
                  <option value="Borno">Borno</option>
                  <option value="Cross River">Cross River</option>
                  <option value="Delta">Delta</option>
                  <option value="Ebonyi">Ebonyi</option>
                  <option value="Edo">Edo</option>
                  <option value="Ekiti">Ekiti</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Gombe">Gombe</option>
                  <option value="Imo">Imo</option>
                  <option value="Jigawa">Jigawa</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Kano">Kano</option>
                  <option value="Katsina">Katsina</option>
                  <option value="Kebbi">Kebbi</option>
                  <option value="Kogi">Kogi</option>
                  <option value="Kwara">Kwara</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Nasarawa">Nasarawa</option>
                  <option value="Niger">Niger</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Ondo">Ondo</option>
                  <option value="Osun">Osun</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Plateau">Plateau</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Sokoto">Sokoto</option>
                  <option value="Taraba">Taraba</option>
                  <option value="Yobe">Yobe</option>
                  <option value="Zamfara">Zamfara</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Postal Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  E-mail <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Company Phone Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  name="companyPhoneNumber"
                  value={formData.companyPhoneNumber}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://www.example.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Person Information */}
			<div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Contact Person Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Contact Person Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="contactPersonName"
                  value={formData.contactPersonName}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Contact Person Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="contactPersonTitle"
                  value={formData.contactPersonTitle}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Contact Person Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  name="contactPersonEmailAddress"
                  value={formData.contactPersonEmailAddress}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Contact Person Designation <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="contactPersonDesignation"
                  value={formData.contactPersonDesignation}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 font-serif mb-2">
                  Contact Person Passport
                </label>
					<input
                  type="file"
						name="contactPersonPassport"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field"
                />
                {formData.contactPersonPassport && (
                  <p className="text-sm text-gray-400 font-serif mt-2">
                    Current file: {formData.contactPersonPassport}
                  </p>
                )}
			</div>

			{/* Notification Preferences */}
			<div className="card">
				<h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Notification Preferences</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<label className="flex items-center gap-3 text-gray-200">
						<input
							type="checkbox"
							checked={formData.notificationEmailEnabled}
							onChange={(e) => setFormData(prev => ({ ...prev, notificationEmailEnabled: e.target.checked }))}
							className="h-4 w-4"
						/>
						<span className="text-sm">Email notifications</span>
					</label>
					<label className="flex items-center gap-3 text-gray-200">
						<input
							type="checkbox"
							checked={formData.notificationSmsEnabled}
							onChange={(e) => setFormData(prev => ({ ...prev, notificationSmsEnabled: e.target.checked }))}
							className="h-4 w-4"
						/>
						<span className="text-sm">SMS notifications</span>
					</label>
					<label className="flex items-center gap-3 text-gray-200">
						<input
							type="checkbox"
							checked={formData.notificationInAppEnabled}
							onChange={(e) => setFormData(prev => ({ ...prev, notificationInAppEnabled: e.target.checked }))}
							className="h-4 w-4"
						/>
						<span className="text-sm">In-app notifications</span>
					</label>
				</div>
			</div>

			{/* Security */}
			<div className="card">
				<h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Security</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="md:col-span-2">
						<label className="flex items-center gap-3 text-gray-200">
							<input
								type="checkbox"
								checked={formData.twoFactorEnabled}
								onChange={(e) => setFormData(prev => ({ ...prev, twoFactorEnabled: e.target.checked }))}
								className="h-4 w-4"
							/>
							<span className="text-sm">Enable two-factor authentication (2FA)</span>
						</label>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 font-serif mb-2">Current Password</label>
						<input
							type="password"
							name="currentPassword"
							value={formData.currentPassword}
							onChange={handleInputChange}
							className="input-field"
							placeholder="••••••••"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 font-serif mb-2">New Password</label>
						<input
							type="password"
							name="newPassword"
							value={formData.newPassword}
							onChange={handleInputChange}
							className="input-field"
							placeholder="••••••••"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-300 font-serif mb-2">Confirm New Password</label>
						<input
							type="password"
							name="confirmPassword"
							value={formData.confirmPassword}
							onChange={handleInputChange}
							className="input-field"
							placeholder="••••••••"
						/>
					</div>
				</div>
			</div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">
              💾 Save Changes
            </button>
          </div>
        </form>

        {/* Powered by */}
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default CoordinatingAgencySettings;
