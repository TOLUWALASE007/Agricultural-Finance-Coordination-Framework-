import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const AnchorSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/anchor/producers' },
    { id: 'contracts', name: 'Supply Contracts', icon: '📄', href: '/portal/anchor/contracts' },
    { id: 'loans', name: 'Loan Performance', icon: '💰', href: '/portal/anchor/loans' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/anchor/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/anchor/settings' }
  ];

  const [settings, setSettings] = useState({
    companyName: 'Nigerian Agribusiness Ltd',
    businessType: 'Agricultural Processing',
    registrationNumber: 'RC123456789',
    taxId: 'TAX123456789',
    establishedYear: 2015,
    employeeCount: 150,
    annualRevenue: 5000000000,
    primaryCrops: ['Rice', 'Wheat', 'Maize'],
    processingCapacity: '1000 tons/day',
    qualityStandards: 'ISO 22000',
    certificationStatus: 'Certified',
    emailNotifications: true,
    smsNotifications: false,
    contractAutoRenewal: true,
    paymentReminders: true,
    qualityMonitoring: true,
    producerTraining: true,
    primaryContact: 'Alhaji Ibrahim Musa',
    contactEmail: 'ibrahim@nigerianagri.com',
    contactPhone: '+234-803-456-7890',
    officeAddress: '456 Agribusiness Street, Kano, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    producerApiStatus: 'Active',
    contractApiStatus: 'Active',
    loanApiStatus: 'Active',
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
      companyName: 'Nigerian Agribusiness Ltd',
      businessType: 'Agricultural Processing',
      registrationNumber: 'RC123456789',
      taxId: 'TAX123456789',
      establishedYear: 2015,
      employeeCount: 150,
      annualRevenue: 5000000000,
      primaryCrops: ['Rice', 'Wheat', 'Maize'],
      processingCapacity: '1000 tons/day',
      qualityStandards: 'ISO 22000',
      certificationStatus: 'Certified',
      emailNotifications: true,
      smsNotifications: false,
      contractAutoRenewal: true,
      paymentReminders: true,
      qualityMonitoring: true,
      producerTraining: true,
      primaryContact: 'Alhaji Ibrahim Musa',
      contactEmail: 'ibrahim@nigerianagri.com',
      contactPhone: '+234-803-456-7890',
      officeAddress: '456 Agribusiness Street, Kano, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      producerApiStatus: 'Active',
      contractApiStatus: 'Active',
      loanApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="Anchor" 
      roleIcon="🏢" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Anchor Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-gray-300 text-sm font-serif mb-1">Company Name</label>
              <input type="text" id="companyName" name="companyName" value={settings.companyName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="businessType" className="block text-gray-300 text-sm font-serif mb-1">Business Type</label>
              <input type="text" id="businessType" name="businessType" value={settings.businessType} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="registrationNumber" className="block text-gray-300 text-sm font-serif mb-1">Registration Number</label>
              <input type="text" id="registrationNumber" name="registrationNumber" value={settings.registrationNumber} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="taxId" className="block text-gray-300 text-sm font-serif mb-1">Tax ID</label>
              <input type="text" id="taxId" name="taxId" value={settings.taxId} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="establishedYear" className="block text-gray-300 text-sm font-serif mb-1">Established Year</label>
              <input type="number" id="establishedYear" name="establishedYear" value={settings.establishedYear} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="employeeCount" className="block text-gray-300 text-sm font-serif mb-1">Employee Count</label>
              <input type="number" id="employeeCount" name="employeeCount" value={settings.employeeCount} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Business Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="annualRevenue" className="block text-gray-300 text-sm font-serif mb-1">Annual Revenue</label>
              <input type="number" id="annualRevenue" name="annualRevenue" value={settings.annualRevenue} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="processingCapacity" className="block text-gray-300 text-sm font-serif mb-1">Processing Capacity</label>
              <input type="text" id="processingCapacity" name="processingCapacity" value={settings.processingCapacity} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="qualityStandards" className="block text-gray-300 text-sm font-serif mb-1">Quality Standards</label>
              <input type="text" id="qualityStandards" name="qualityStandards" value={settings.qualityStandards} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="certificationStatus" className="block text-gray-300 text-sm font-serif mb-1">Certification Status</label>
              <select id="certificationStatus" name="certificationStatus" value={settings.certificationStatus} onChange={handleChange} className="input-field">
                <option>Certified</option>
                <option>Pending</option>
                <option>Not Certified</option>
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
              <input type="checkbox" id="contractAutoRenewal" name="contractAutoRenewal" checked={settings.contractAutoRenewal} onChange={handleChange} className="mr-2" />
              <label htmlFor="contractAutoRenewal" className="text-gray-300 font-serif">Contract Auto Renewal</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="paymentReminders" name="paymentReminders" checked={settings.paymentReminders} onChange={handleChange} className="mr-2" />
              <label htmlFor="paymentReminders" className="text-gray-300 font-serif">Payment Reminders</label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Feature Toggles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input type="checkbox" id="qualityMonitoring" name="qualityMonitoring" checked={settings.qualityMonitoring} onChange={handleChange} className="mr-2" />
              <label htmlFor="qualityMonitoring" className="text-gray-300 font-serif">Quality Monitoring</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="producerTraining" name="producerTraining" checked={settings.producerTraining} onChange={handleChange} className="mr-2" />
              <label htmlFor="producerTraining" className="text-gray-300 font-serif">Producer Training</label>
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

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producerApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Producer API Status</label>
              <select id="producerApiStatus" name="producerApiStatus" value={settings.producerApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="contractApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Contract API Status</label>
              <select id="contractApiStatus" name="contractApiStatus" value={settings.contractApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="loanApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Loan API Status</label>
              <select id="loanApiStatus" name="loanApiStatus" value={settings.loanApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="backupFrequency" className="block text-gray-300 text-sm font-serif mb-1">Backup Frequency</label>
              <select id="backupFrequency" name="backupFrequency" value={settings.backupFrequency} onChange={handleChange} className="input-field">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
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

export default AnchorSettings;
