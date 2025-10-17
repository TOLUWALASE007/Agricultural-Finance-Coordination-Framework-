import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const InsuranceSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'policies', name: 'Policies', icon: '🛡️', href: '/portal/insurance/policies' },
    { id: 'claims', name: 'Claims', icon: '📋', href: '/portal/insurance/claims' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/insurance/risk' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/insurance/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
  ];

  const [settings, setSettings] = useState({
    companyName: 'Nigerian Agricultural Insurance Corporation',
    companyCode: 'NAIC-001',
    companyType: 'Insurance Company',
    licenseNumber: 'NAICOM-LIC-2023-001',
    maxCoverageAmount: 50000000,
    basePremiumRate: 0.05,
    riskAdjustmentFactor: 1.2,
    claimsProcessingTime: 14,
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    reportFrequency: 'Monthly',
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@naic.com.ng',
    contactPhone: '+234-801-234-5678',
    officeAddress: '123 Insurance Street, Lagos, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    fundProviderApiStatus: 'Active',
    pfiApiStatus: 'Active',
    reportingApiStatus: 'Active',
    backupFrequency: 'Daily',
    complianceMode: 'Strict',
    auditTrail: true,
    dataRetention: 7,
    autoApprovalLimit: 100000,
    manualReviewThreshold: 500000,
    riskAssessmentFrequency: 'Monthly',
    policyVerification: 'Required',
    claimsProcessingApproval: 'Manual'
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
      companyName: 'Nigerian Agricultural Insurance Corporation',
      companyCode: 'NAIC-001',
      companyType: 'Insurance Company',
      licenseNumber: 'NAICOM-LIC-2023-001',
      maxCoverageAmount: 50000000,
      basePremiumRate: 0.05,
      riskAdjustmentFactor: 1.2,
      claimsProcessingTime: 14,
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: false,
      reportFrequency: 'Monthly',
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@naic.com.ng',
      contactPhone: '+234-801-234-5678',
      officeAddress: '123 Insurance Street, Lagos, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      fundProviderApiStatus: 'Active',
      pfiApiStatus: 'Active',
      reportingApiStatus: 'Active',
      backupFrequency: 'Daily',
      complianceMode: 'Strict',
      auditTrail: true,
      dataRetention: 7,
      autoApprovalLimit: 100000,
      manualReviewThreshold: 500000,
      riskAssessmentFrequency: 'Monthly',
      policyVerification: 'Required',
      claimsProcessingApproval: 'Manual'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout role="Insurance Company" roleIcon="🛡️" sidebarItems={sidebarItems}>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Insurance Company Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Company Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="companyName" className="block text-gray-300 text-sm font-serif mb-1">Company Name</label>
              <input type="text" id="companyName" name="companyName" value={settings.companyName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="companyCode" className="block text-gray-300 text-sm font-serif mb-1">Company Code</label>
              <input type="text" id="companyCode" name="companyCode" value={settings.companyCode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="maxCoverageAmount" className="block text-gray-300 text-sm font-serif mb-1">Max Coverage Amount (₦)</label>
              <input type="number" id="maxCoverageAmount" name="maxCoverageAmount" value={settings.maxCoverageAmount} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="basePremiumRate" className="block text-gray-300 text-sm font-serif mb-1">Base Premium Rate (%)</label>
              <input type="number" id="basePremiumRate" name="basePremiumRate" value={settings.basePremiumRate} onChange={handleChange} step="0.01" className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Claims Processing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claimsProcessingTime" className="block text-gray-300 text-sm font-serif mb-1">Processing Time (days)</label>
              <input type="number" id="claimsProcessingTime" name="claimsProcessingTime" value={settings.claimsProcessingTime} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="autoApprovalLimit" className="block text-gray-300 text-sm font-serif mb-1">Auto Approval Limit (₦)</label>
              <input type="number" id="autoApprovalLimit" name="autoApprovalLimit" value={settings.autoApprovalLimit} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="manualReviewThreshold" className="block text-gray-300 text-sm font-serif mb-1">Manual Review Threshold (₦)</label>
              <input type="number" id="manualReviewThreshold" name="manualReviewThreshold" value={settings.manualReviewThreshold} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="claimsProcessingApproval" className="block text-gray-300 text-sm font-serif mb-1">Claims Processing Approval</label>
              <select id="claimsProcessingApproval" name="claimsProcessingApproval" value={settings.claimsProcessingApproval} onChange={handleChange} className="input-field">
                <option>Manual</option>
                <option>Automatic</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Company ID:</p>
              <p className="text-gray-100 font-sans font-medium">INS-001-NAIC</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Registration Date:</p>
              <p className="text-gray-100 font-sans font-medium">2023-02-15</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">API Version:</p>
              <p className="text-gray-100 font-sans font-medium">v1.8.0</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">System Uptime:</p>
              <p className="text-gray-100 font-sans font-medium">99.7%</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleReset} className="btn-secondary">Reset to Default</button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
          <button onClick={() => exportData('Insurance Settings', 'JSON')} className="btn-secondary">Export Settings</button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default InsuranceSettings;
