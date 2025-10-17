import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const CooperativeSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/cooperative' },
    { id: 'members', name: 'Members', icon: '👥', href: '/portal/cooperative/members' },
    { id: 'loans', name: 'Group Loans', icon: '💰', href: '/portal/cooperative/loans' },
    { id: 'savings', name: 'Savings', icon: '🏦', href: '/portal/cooperative/savings' },
    { id: 'markets', name: 'Market Access', icon: '📈', href: '/portal/cooperative/markets' },
    { id: 'training', name: 'Training', icon: '🎓', href: '/portal/cooperative/training' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/cooperative/extension' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/cooperative/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/cooperative/settings' }
  ];

  const [settings, setSettings] = useState({
    cooperativeName: 'Kaduna Farmers Cooperative Society',
    registrationNumber: 'RC123456789',
    establishedYear: 2015,
    memberCount: 247,
    totalSavings: 12400000,
    totalLoans: 8700000,
    interestRate: 10,
    monthlyContribution: 5000,
    emailNotifications: true,
    smsNotifications: false,
    autoInterestCalculation: true,
    loanApprovalRequired: true,
    primaryContact: 'Alhaji Ibrahim Musa',
    contactEmail: 'chairman@kadunafarmers.com',
    contactPhone: '+234-803-456-7890',
    officeAddress: '123 Cooperative Street, Kaduna, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    memberApiStatus: 'Active',
    loanApiStatus: 'Active',
    savingsApiStatus: 'Active',
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
      cooperativeName: 'Kaduna Farmers Cooperative Society',
      registrationNumber: 'RC123456789',
      establishedYear: 2015,
      memberCount: 247,
      totalSavings: 12400000,
      totalLoans: 8700000,
      interestRate: 10,
      monthlyContribution: 5000,
      emailNotifications: true,
      smsNotifications: false,
      autoInterestCalculation: true,
      loanApprovalRequired: true,
      primaryContact: 'Alhaji Ibrahim Musa',
      contactEmail: 'chairman@kadunafarmers.com',
      contactPhone: '+234-803-456-7890',
      officeAddress: '123 Cooperative Street, Kaduna, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      memberApiStatus: 'Active',
      loanApiStatus: 'Active',
      savingsApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="Cooperative Group" 
      roleIcon="👥" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Cooperative Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Cooperative Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cooperativeName" className="block text-gray-300 text-sm font-serif mb-1">Cooperative Name</label>
              <input type="text" id="cooperativeName" name="cooperativeName" value={settings.cooperativeName} onChange={handleChange} className="input-field" />
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
              <label htmlFor="memberCount" className="block text-gray-300 text-sm font-serif mb-1">Member Count</label>
              <input type="number" id="memberCount" name="memberCount" value={settings.memberCount} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Financial Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="interestRate" className="block text-gray-300 text-sm font-serif mb-1">Interest Rate (%)</label>
              <input type="number" id="interestRate" name="interestRate" value={settings.interestRate} onChange={handleChange} step="0.1" className="input-field" />
            </div>
            <div>
              <label htmlFor="monthlyContribution" className="block text-gray-300 text-sm font-serif mb-1">Monthly Contribution (₦)</label>
              <input type="number" id="monthlyContribution" name="monthlyContribution" value={settings.monthlyContribution} onChange={handleChange} className="input-field" />
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
              <input type="checkbox" id="autoInterestCalculation" name="autoInterestCalculation" checked={settings.autoInterestCalculation} onChange={handleChange} className="mr-2" />
              <label htmlFor="autoInterestCalculation" className="text-gray-300 font-serif">Auto Interest Calculation</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="loanApprovalRequired" name="loanApprovalRequired" checked={settings.loanApprovalRequired} onChange={handleChange} className="mr-2" />
              <label htmlFor="loanApprovalRequired" className="text-gray-300 font-serif">Loan Approval Required</label>
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

export default CooperativeSettings;
