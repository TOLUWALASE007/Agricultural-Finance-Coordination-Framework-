import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const CoordinatingAgencySettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/coordinating-agency/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const [settings, setSettings] = useState({
    agencyName: 'Agricultural Finance Coordination Framework',
    agencyCode: 'AFCF-001',
    agencyType: 'Government Agency',
    licenseNumber: 'GOV-LIC-2023-001',
    maxProgramBudget: 10000000000,
    complianceThreshold: 85,
    reportingFrequency: 'Monthly',
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@afcf.gov.ng',
    contactPhone: '+234-801-234-5678',
    officeAddress: '123 Government Street, Abuja, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    stakeholderApiStatus: 'Active',
    reportingApiStatus: 'Active',
    complianceApiStatus: 'Active',
    backupFrequency: 'Daily',
    complianceMode: 'Strict',
    auditTrail: true,
    dataRetention: 10
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
      agencyName: 'Agricultural Finance Coordination Framework',
      agencyCode: 'AFCF-001',
      agencyType: 'Government Agency',
      licenseNumber: 'GOV-LIC-2023-001',
      maxProgramBudget: 10000000000,
      complianceThreshold: 85,
      reportingFrequency: 'Monthly',
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: false,
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@afcf.gov.ng',
      contactPhone: '+234-801-234-5678',
      officeAddress: '123 Government Street, Abuja, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      stakeholderApiStatus: 'Active',
      reportingApiStatus: 'Active',
      complianceApiStatus: 'Active',
      backupFrequency: 'Daily',
      complianceMode: 'Strict',
      auditTrail: true,
      dataRetention: 10
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout role="Coordinating Agency" roleIcon="🏛️" sidebarItems={sidebarItems}>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Coordinating Agency Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Agency Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="agencyName" className="block text-gray-300 text-sm font-serif mb-1">Agency Name</label>
              <input type="text" id="agencyName" name="agencyName" value={settings.agencyName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="agencyCode" className="block text-gray-300 text-sm font-serif mb-1">Agency Code</label>
              <input type="text" id="agencyCode" name="agencyCode" value={settings.agencyCode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="maxProgramBudget" className="block text-gray-300 text-sm font-serif mb-1">Max Program Budget (₦)</label>
              <input type="number" id="maxProgramBudget" name="maxProgramBudget" value={settings.maxProgramBudget} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="complianceThreshold" className="block text-gray-300 text-sm font-serif mb-1">Compliance Threshold (%)</label>
              <input type="number" id="complianceThreshold" name="complianceThreshold" value={settings.complianceThreshold} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Agency ID:</p>
              <p className="text-gray-100 font-sans font-medium">CA-001-AFCF</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Registration Date:</p>
              <p className="text-gray-100 font-sans font-medium">2023-01-01</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">API Version:</p>
              <p className="text-gray-100 font-sans font-medium">v1.5.0</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">System Uptime:</p>
              <p className="text-gray-100 font-sans font-medium">99.9%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleReset} className="btn-secondary">Reset to Default</button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
          <button onClick={() => exportData('Agency Settings', 'JSON')} className="btn-secondary">Export Settings</button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CoordinatingAgencySettings;
