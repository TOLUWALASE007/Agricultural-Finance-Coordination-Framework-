import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification } from '../../../utils/quickActions';

const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    // Fund Provider Settings
    fundName: 'AFCF Development Fund',
    fundType: 'Agricultural Development',
    maxLoanAmount: 5000000,
    interestRate: 12.5,
    riskTolerance: 'Medium',
    autoApproval: false,
    notificationEmail: true,
    smsNotifications: false,
    monthlyReports: true,
    quarterlyReports: true,
    
    // Contact Information
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@afcf.gov',
    contactPhone: '+234-801-234-5678',
    officeAddress: '123 Agricultural Plaza, Abuja, Nigeria',
    
    // Security Settings
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    
    // Integration Settings
    pfiApiEnabled: true,
    insuranceApiEnabled: true,
    reportingApiEnabled: true,
    backupFrequency: 'Daily'
  });

  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '₦', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSave = () => {
    showNotification('Settings saved successfully!', 'success');
    // Later: API call to save settings
  };

  const handleReset = () => {
    showNotification('Settings reset to defaults', 'info');
    // Later: API call to reset settings
  };

  const handleExport = () => {
    showNotification('Settings exported successfully!', 'success');
    // Later: Export settings to file
  };

  return (
    <PortalLayout 
      role="Fund Provider" 
      roleIcon="₦" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Settings</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your fund provider account settings and preferences</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={handleReset}
            >
              🔄 Reset to Defaults
            </button>
            <button 
              className="btn-secondary"
              onClick={handleExport}
            >
              📤 Export Settings
            </button>
            <button 
              className="btn-primary"
              onClick={handleSave}
            >
              💾 Save Changes
            </button>
          </div>
        </div>

        {/* Fund Configuration */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">₦ Fund Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Fund Name</label>
              <input
                type="text"
                name="fundName"
                value={formData.fundName}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Fund Type</label>
              <select
                name="fundType"
                value={formData.fundType}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Agricultural Development">Agricultural Development</option>
                <option value="Rural Finance">Rural Finance</option>
                <option value="Climate Finance">Climate Finance</option>
                <option value="Infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Max Loan Amount (₦)</label>
              <input
                type="number"
                name="maxLoanAmount"
                value={formData.maxLoanAmount}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Risk Tolerance</label>
              <select
                name="riskTolerance"
                value={formData.riskTolerance}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="autoApproval"
                checked={formData.autoApproval}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Enable Auto-Approval</label>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">🔔 Notification Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="notificationEmail"
                checked={formData.notificationEmail}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Email Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">SMS Notifications</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="monthlyReports"
                checked={formData.monthlyReports}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Monthly Reports</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="quarterlyReports"
                checked={formData.quarterlyReports}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Quarterly Reports</label>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">📞 Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Primary Contact</label>
              <input
                type="text"
                name="primaryContact"
                value={formData.primaryContact}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Contact Phone</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Office Address</label>
              <input
                type="text"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">🔒 Security Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={formData.sessionTimeout}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Password Expiry (days)</label>
              <input
                type="number"
                name="passwordExpiry"
                value={formData.passwordExpiry}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Max Login Attempts</label>
              <input
                type="number"
                name="loginAttempts"
                value={formData.loginAttempts}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={formData.twoFactorAuth}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Two-Factor Authentication</label>
            </div>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">🔗 Integration Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="pfiApiEnabled"
                checked={formData.pfiApiEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">PFI API Integration</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="insuranceApiEnabled"
                checked={formData.insuranceApiEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Insurance API Integration</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="reportingApiEnabled"
                checked={formData.reportingApiEnabled}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-500 bg-primary-700 border-primary-600 rounded focus:ring-primary-500"
              />
              <label className="text-sm font-medium font-sans text-gray-300">Reporting API Integration</label>
            </div>
            <div>
              <label className="block text-sm font-medium font-sans text-gray-300 mb-2">Backup Frequency</label>
              <select
                name="backupFrequency"
                value={formData.backupFrequency}
                onChange={handleInputChange}
                className="input-field"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">ℹ️ System Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Account ID:</span>
                <span className="text-gray-100 font-sans">FP-2024-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Registration Date:</span>
                <span className="text-gray-100 font-sans">January 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-serif">Last Login:</span>
                <span className="text-gray-100 font-sans">Today, 2:30 PM</span>
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
                <span className="text-blue-400 font-sans">Premium</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Settings;
