import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const PFISettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'loans', name: 'Loan Processing', icon: '💰', href: '/portal/pfi/loans' },
    { id: 'applications', name: 'Applications', icon: '📋', href: '/portal/pfi/applications' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/pfi/producers' },
    { id: 'anchors', name: 'Anchor Partners', icon: '⚓', href: '/portal/pfi/anchors' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/pfi/insurance' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/pfi/risk' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/pfi/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pfi/settings' }
  ];

  const [settings, setSettings] = useState({
    bankName: 'First Bank of Nigeria',
    bankCode: 'FBN-001',
    bankType: 'Commercial Bank',
    licenseNumber: 'CBN-LIC-2023-001',
    maxLoanAmount: 10000000,
    interestRate: 0.12,
    processingFee: 0.02,
    riskTolerance: 'Medium',
    emailNotifications: true,
    smsNotifications: true,
    whatsappNotifications: false,
    reportFrequency: 'Monthly',
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@firstbank.com',
    contactPhone: '+234-801-234-5678',
    officeAddress: '123 Banking Street, Lagos, Nigeria',
    sessionTimeout: 30, // minutes
    twoFactorAuth: true,
    passwordExpiry: 90, // days
    loginAttempts: 5,
    fundProviderApiStatus: 'Active',
    insuranceApiStatus: 'Active',
    reportingApiStatus: 'Active',
    backupFrequency: 'Daily',
    complianceMode: 'Strict',
    auditTrail: true,
    dataRetention: 7, // years
    autoApprovalLimit: 500000,
    manualReviewThreshold: 2000000,
    riskAssessmentFrequency: 'Monthly',
    producerVerification: 'Required',
    anchorPartnershipApproval: 'Manual'
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
    // In a real application, this would be an API call to save settings
  };

  const handleReset = () => {
    // Reset to initial dummy values or fetch from a default API endpoint
    setSettings({
      bankName: 'First Bank of Nigeria',
      bankCode: 'FBN-001',
      bankType: 'Commercial Bank',
      licenseNumber: 'CBN-LIC-2023-001',
      maxLoanAmount: 10000000,
      interestRate: 0.12,
      processingFee: 0.02,
      riskTolerance: 'Medium',
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: false,
      reportFrequency: 'Monthly',
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@firstbank.com',
      contactPhone: '+234-801-234-5678',
      officeAddress: '123 Banking Street, Lagos, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      fundProviderApiStatus: 'Active',
      insuranceApiStatus: 'Active',
      reportingApiStatus: 'Active',
      backupFrequency: 'Daily',
      complianceMode: 'Strict',
      auditTrail: true,
      dataRetention: 7,
      autoApprovalLimit: 500000,
      manualReviewThreshold: 2000000,
      riskAssessmentFrequency: 'Monthly',
      producerVerification: 'Required',
      anchorPartnershipApproval: 'Manual'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout role="Participating Bank (PFI)" roleIcon="🏦" sidebarItems={sidebarItems}>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">PFI Settings</h1>

        {/* Bank Configuration */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Bank Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bankName" className="block text-gray-300 text-sm font-serif mb-1">Bank Name</label>
              <input type="text" id="bankName" name="bankName" value={settings.bankName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="bankCode" className="block text-gray-300 text-sm font-serif mb-1">Bank Code</label>
              <input type="text" id="bankCode" name="bankCode" value={settings.bankCode} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="bankType" className="block text-gray-300 text-sm font-serif mb-1">Bank Type</label>
              <select id="bankType" name="bankType" value={settings.bankType} onChange={handleChange} className="input-field">
                <option>Commercial Bank</option>
                <option>Microfinance Bank</option>
                <option>Development Bank</option>
                <option>Merchant Bank</option>
              </select>
            </div>
            <div>
              <label htmlFor="licenseNumber" className="block text-gray-300 text-sm font-serif mb-1">CBN License Number</label>
              <input type="text" id="licenseNumber" name="licenseNumber" value={settings.licenseNumber} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Loan Configuration */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Loan Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxLoanAmount" className="block text-gray-300 text-sm font-serif mb-1">Max Loan Amount (₦)</label>
              <input type="number" id="maxLoanAmount" name="maxLoanAmount" value={settings.maxLoanAmount} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-gray-300 text-sm font-serif mb-1">Interest Rate (%)</label>
              <input type="number" id="interestRate" name="interestRate" value={settings.interestRate} onChange={handleChange} step="0.01" className="input-field" />
            </div>
            <div>
              <label htmlFor="processingFee" className="block text-gray-300 text-sm font-serif mb-1">Processing Fee (%)</label>
              <input type="number" id="processingFee" name="processingFee" value={settings.processingFee} onChange={handleChange} step="0.01" className="input-field" />
            </div>
            <div>
              <label htmlFor="riskTolerance" className="block text-gray-300 text-sm font-serif mb-1">Risk Tolerance</label>
              <select id="riskTolerance" name="riskTolerance" value={settings.riskTolerance} onChange={handleChange} className="input-field">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div>
              <label htmlFor="autoApprovalLimit" className="block text-gray-300 text-sm font-serif mb-1">Auto Approval Limit (₦)</label>
              <input type="number" id="autoApprovalLimit" name="autoApprovalLimit" value={settings.autoApprovalLimit} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="manualReviewThreshold" className="block text-gray-300 text-sm font-serif mb-1">Manual Review Threshold (₦)</label>
              <input type="number" id="manualReviewThreshold" name="manualReviewThreshold" value={settings.manualReviewThreshold} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
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
              <input type="checkbox" id="whatsappNotifications" name="whatsappNotifications" checked={settings.whatsappNotifications} onChange={handleChange} className="mr-2" />
              <label htmlFor="whatsappNotifications" className="text-gray-300 font-serif">WhatsApp Notifications</label>
            </div>
            <div>
              <label htmlFor="reportFrequency" className="block text-gray-300 text-sm font-serif mb-1">Report Frequency</label>
              <select id="reportFrequency" name="reportFrequency" value={settings.reportFrequency} onChange={handleChange} className="input-field">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
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
            <div className="md:col-span-2">
              <label htmlFor="officeAddress" className="block text-gray-300 text-sm font-serif mb-1">Office Address</label>
              <input type="text" id="officeAddress" name="officeAddress" value={settings.officeAddress} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Security Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="sessionTimeout" className="block text-gray-300 text-sm font-serif mb-1">Session Timeout (minutes)</label>
              <input type="number" id="sessionTimeout" name="sessionTimeout" value={settings.sessionTimeout} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="twoFactorAuth" name="twoFactorAuth" checked={settings.twoFactorAuth} onChange={handleChange} className="mr-2" />
              <label htmlFor="twoFactorAuth" className="text-gray-300 font-serif">Two-Factor Authentication (2FA)</label>
            </div>
            <div>
              <label htmlFor="passwordExpiry" className="block text-gray-300 text-sm font-serif mb-1">Password Expiry (days)</label>
              <input type="number" id="passwordExpiry" name="passwordExpiry" value={settings.passwordExpiry} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="loginAttempts" className="block text-gray-300 text-sm font-serif mb-1">Max Login Attempts</label>
              <input type="number" id="loginAttempts" name="loginAttempts" value={settings.loginAttempts} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Integration Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fundProviderApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Fund Provider API Status</label>
              <select id="fundProviderApiStatus" name="fundProviderApiStatus" value={settings.fundProviderApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="insuranceApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Insurance API Status</label>
              <select id="insuranceApiStatus" name="insuranceApiStatus" value={settings.insuranceApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="reportingApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Reporting API Status</label>
              <select id="reportingApiStatus" name="reportingApiStatus" value={settings.reportingApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="backupFrequency" className="block text-gray-300 text-sm font-serif mb-1">Data Backup Frequency</label>
              <select id="backupFrequency" name="backupFrequency" value={settings.backupFrequency} onChange={handleChange} className="input-field">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compliance Settings */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Compliance Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="complianceMode" className="block text-gray-300 text-sm font-serif mb-1">Compliance Mode</label>
              <select id="complianceMode" name="complianceMode" value={settings.complianceMode} onChange={handleChange} className="input-field">
                <option>Strict</option>
                <option>Moderate</option>
                <option>Relaxed</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="auditTrail" name="auditTrail" checked={settings.auditTrail} onChange={handleChange} className="mr-2" />
              <label htmlFor="auditTrail" className="text-gray-300 font-serif">Enable Audit Trail</label>
            </div>
            <div>
              <label htmlFor="dataRetention" className="block text-gray-300 text-sm font-serif mb-1">Data Retention (years)</label>
              <input type="number" id="dataRetention" name="dataRetention" value={settings.dataRetention} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="riskAssessmentFrequency" className="block text-gray-300 text-sm font-serif mb-1">Risk Assessment Frequency</label>
              <select id="riskAssessmentFrequency" name="riskAssessmentFrequency" value={settings.riskAssessmentFrequency} onChange={handleChange} className="input-field">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annually</option>
              </select>
            </div>
          </div>
        </div>

        {/* Business Rules */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Business Rules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="producerVerification" className="block text-gray-300 text-sm font-serif mb-1">Producer Verification</label>
              <select id="producerVerification" name="producerVerification" value={settings.producerVerification} onChange={handleChange} className="input-field">
                <option>Required</option>
                <option>Optional</option>
                <option>Automatic</option>
              </select>
            </div>
            <div>
              <label htmlFor="anchorPartnershipApproval" className="block text-gray-300 text-sm font-serif mb-1">Anchor Partnership Approval</label>
              <select id="anchorPartnershipApproval" name="anchorPartnershipApproval" value={settings.anchorPartnershipApproval} onChange={handleChange} className="input-field">
                <option>Manual</option>
                <option>Automatic</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">System Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Bank ID:</p>
              <p className="text-gray-100 font-sans font-medium">PFI-001-FBN</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">Registration Date:</p>
              <p className="text-gray-100 font-sans font-medium">2023-03-15</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">API Version:</p>
              <p className="text-gray-100 font-sans font-medium">v2.1.0</p>
            </div>
            <div>
              <p className="text-gray-300 text-sm font-serif mb-1">System Uptime:</p>
              <p className="text-gray-100 font-sans font-medium">99.8%</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-6">
          <button onClick={handleReset} className="btn-secondary">Reset to Default</button>
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
          <button onClick={() => exportData('PFI Settings', 'JSON')} className="btn-secondary">Export Settings</button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PFISettings;
