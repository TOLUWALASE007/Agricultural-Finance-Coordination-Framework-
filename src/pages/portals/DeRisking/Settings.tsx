import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const DeRiskingSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/de-risking' },
    { id: 'funds', name: 'De-risking Funds', icon: '💰', href: '/portal/de-risking/funds' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/de-risking/risk' },
    { id: 'guarantees', name: 'Guarantees', icon: '🛡️', href: '/portal/de-risking/guarantees' },
    { id: 'partners', name: 'Partners', icon: '🤝', href: '/portal/de-risking/partners' },
    { id: 'monitoring', name: 'Monitoring', icon: '📱', href: '/portal/de-risking/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/de-risking/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/de-risking/settings' }
  ];

  const [settings, setSettings] = useState({
    institutionName: 'Nigerian Agricultural Insurance Corporation (NAIC)',
    registrationNumber: 'RC987654321',
    establishedYear: 1993,
    totalFunds: 8200000000,
    activeGuarantees: 1247,
    riskCoverage: 15600000000,
    partnerInstitutions: 24,
    maxGuaranteeAmount: 1000000000,
    minGuaranteeAmount: 10000000,
    standardGuaranteeFee: 2.5,
    riskAssessmentFrequency: 'Quarterly',
    emailNotifications: true,
    smsNotifications: false,
    autoRiskAssessment: true,
    guaranteeAutoApproval: false,
    primaryContact: 'Dr. Ahmed Ibrahim',
    contactEmail: 'director@naic.gov.ng',
    contactPhone: '+234-803-456-7890',
    officeAddress: '123 Insurance Plaza, Abuja, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    fundApiStatus: 'Active',
    guaranteeApiStatus: 'Active',
    riskApiStatus: 'Active',
    backupFrequency: 'Daily'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    showNotification('Settings saved successfully!', 'success');
    console.log('Saved Settings:', settings);
  };

  const handleReset = () => {
    setSettings({
      institutionName: 'Nigerian Agricultural Insurance Corporation (NAIC)',
      registrationNumber: 'RC987654321',
      establishedYear: 1993,
      totalFunds: 8200000000,
      activeGuarantees: 1247,
      riskCoverage: 15600000000,
      partnerInstitutions: 24,
      maxGuaranteeAmount: 1000000000,
      minGuaranteeAmount: 10000000,
      standardGuaranteeFee: 2.5,
      riskAssessmentFrequency: 'Quarterly',
      emailNotifications: true,
      smsNotifications: false,
      autoRiskAssessment: true,
      guaranteeAutoApproval: false,
      primaryContact: 'Dr. Ahmed Ibrahim',
      contactEmail: 'director@naic.gov.ng',
      contactPhone: '+234-803-456-7890',
      officeAddress: '123 Insurance Plaza, Abuja, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      fundApiStatus: 'Active',
      guaranteeApiStatus: 'Active',
      riskApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="De-risking Institution" 
      roleIcon="🛡️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">De-risking Institution Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Institution Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="institutionName" className="block text-gray-300 text-sm font-serif mb-1">Institution Name</label>
              <input type="text" id="institutionName" name="institutionName" value={settings.institutionName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="registrationNumber" className="block text-gray-300 text-sm font-serif mb-1">Registration Number</label>
              <input type="text" id="registrationNumber" name="registrationNumber" value={settings.registrationNumber} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="establishedYear" className="block text-gray-300 text-sm font-serif mb-1">Established Year</label>
              <input type="number" id="establishedYear" name="establishedYear" value={settings.establishedYear} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="partnerInstitutions" className="block text-gray-300 text-sm font-serif mb-1">Partner Institutions</label>
              <input type="number" id="partnerInstitutions" name="partnerInstitutions" value={settings.partnerInstitutions} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Financial Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxGuaranteeAmount" className="block text-gray-300 text-sm font-serif mb-1">Max Guarantee Amount (₦)</label>
              <input type="number" id="maxGuaranteeAmount" name="maxGuaranteeAmount" value={settings.maxGuaranteeAmount} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="minGuaranteeAmount" className="block text-gray-300 text-sm font-serif mb-1">Min Guarantee Amount (₦)</label>
              <input type="number" id="minGuaranteeAmount" name="minGuaranteeAmount" value={settings.minGuaranteeAmount} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="standardGuaranteeFee" className="block text-gray-300 text-sm font-serif mb-1">Standard Guarantee Fee (%)</label>
              <input type="number" id="standardGuaranteeFee" name="standardGuaranteeFee" value={settings.standardGuaranteeFee} onChange={handleChange} step="0.1" className="input-field" />
            </div>
            <div>
              <label htmlFor="riskAssessmentFrequency" className="block text-gray-300 text-sm font-serif mb-1">Risk Assessment Frequency</label>
              <select id="riskAssessmentFrequency" name="riskAssessmentFrequency" value={settings.riskAssessmentFrequency} onChange={handleChange} className="input-field">
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Semi-annually</option>
                <option>Annually</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input type="checkbox" id="emailNotifications" name="emailNotifications" checked={settings.emailNotifications} onChange={handleChange} className="mr-2" />
              <label htmlFor="emailNotifications" className="text-gray-300 font-serif">Email Notifications</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="smsNotifications" name="smsNotifications" checked={settings.smsNotifications} onChange={handleChange} className="mr-2" />
              <label htmlFor="smsNotifications" className="text-gray-300 font-serif">SMS Notifications</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="autoRiskAssessment" name="autoRiskAssessment" checked={settings.autoRiskAssessment} onChange={handleChange} className="mr-2" />
              <label htmlFor="autoRiskAssessment" className="text-gray-300 font-serif">Auto Risk Assessment</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="guaranteeAutoApproval" name="guaranteeAutoApproval" checked={settings.guaranteeAutoApproval} onChange={handleChange} className="mr-2" />
              <label htmlFor="guaranteeAutoApproval" className="text-gray-300 font-serif">Guarantee Auto Approval</label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryContact" className="block text-gray-300 text-sm font-serif mb-1">Primary Contact</label>
              <input type="text" id="primaryContact" name="primaryContact" value={settings.primaryContact} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-gray-300 text-sm font-serif mb-1">Contact Email</label>
              <input type="email" id="contactEmail" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-gray-300 text-sm font-serif mb-1">Contact Phone</label>
              <input type="tel" id="contactPhone" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="officeAddress" className="block text-gray-300 text-sm font-serif mb-1">Office Address</label>
              <input type="text" id="officeAddress" name="officeAddress" value={settings.officeAddress} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Security Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-gray-300 text-sm font-serif mb-1">Session Timeout (minutes)</label>
              <input type="number" id="sessionTimeout" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="passwordExpiry" className="block text-gray-300 text-sm font-serif mb-1">Password Expiry (days)</label>
              <input type="number" id="passwordExpiry" name="passwordExpiry" value={settings.passwordExpiry} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="loginAttempts" className="block text-gray-300 text-sm font-serif mb-1">Max Login Attempts</label>
              <input type="number" id="loginAttempts" name="loginAttempts" value={settings.loginAttempts} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="twoFactorAuth" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="mr-2" />
              <label htmlFor="twoFactorAuth" className="text-gray-300 font-serif">Two-Factor Authentication</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button 
            className="btn-secondary"
            onClick={() => generateReport('Settings Report', 'PDF')}
          >
            📊 Export Settings
          </button>
          <button 
            className="btn-secondary"
            onClick={handleReset}
          >
            🔄 Reset
          </button>
          <button 
            className="btn-primary"
            onClick={handleSave}
          >
            💾 Save Settings
          </button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DeRiskingSettings;
