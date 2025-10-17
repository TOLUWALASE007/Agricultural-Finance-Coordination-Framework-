import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const PMTSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pmt' },
    { id: 'projects', name: 'Projects', icon: '📋', href: '/portal/pmt/projects' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '👥', href: '/portal/pmt/stakeholders' },
    { id: 'monitoring', name: 'Monitoring & Evaluation', icon: '📈', href: '/portal/pmt/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/pmt/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pmt/settings' }
  ];

  const [settings, setSettings] = useState({
    organizationName: 'AFCF Project Management Team',
    teamLead: 'Dr. Sarah Johnson',
    teamSize: 12,
    projectCapacity: 15,
    reportingFrequency: 'Monthly',
    stakeholderEngagement: 'High',
    emailNotifications: true,
    smsNotifications: false,
    reportAutoGeneration: true,
    kpiTracking: true,
    stakeholderManagement: true,
    projectMonitoring: true,
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@afcfpmt.com',
    contactPhone: '+234 801 234 5678',
    officeAddress: '123 PMT Street, Abuja, Nigeria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    projectApiStatus: 'Active',
    stakeholderApiStatus: 'Active',
    monitoringApiStatus: 'Active',
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
      organizationName: 'AFCF Project Management Team',
      teamLead: 'Dr. Sarah Johnson',
      teamSize: 12,
      projectCapacity: 15,
      reportingFrequency: 'Monthly',
      stakeholderEngagement: 'High',
      emailNotifications: true,
      smsNotifications: false,
      reportAutoGeneration: true,
      kpiTracking: true,
      stakeholderManagement: true,
      projectMonitoring: true,
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@afcfpmt.com',
      contactPhone: '+234 801 234 5678',
      officeAddress: '123 PMT Street, Abuja, Nigeria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      projectApiStatus: 'Active',
      stakeholderApiStatus: 'Active',
      monitoringApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="Project Management Team (PMT)" 
      roleIcon="📋" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">PMT Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Team Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizationName" className="block text-gray-300 text-sm font-serif mb-1">Organization Name</label>
              <input type="text" id="organizationName" name="organizationName" value={settings.organizationName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="teamLead" className="block text-gray-300 text-sm font-serif mb-1">Team Lead</label>
              <input type="text" id="teamLead" name="teamLead" value={settings.teamLead} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="teamSize" className="block text-gray-300 text-sm font-serif mb-1">Team Size</label>
              <input type="number" id="teamSize" name="teamSize" value={settings.teamSize} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="projectCapacity" className="block text-gray-300 text-sm font-serif mb-1">Project Capacity</label>
              <input type="number" id="projectCapacity" name="projectCapacity" value={settings.projectCapacity} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="reportingFrequency" className="block text-gray-300 text-sm font-serif mb-1">Reporting Frequency</label>
              <select id="reportingFrequency" name="reportingFrequency" value={settings.reportingFrequency} onChange={handleChange} className="input-field">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
              </select>
            </div>
            <div>
              <label htmlFor="stakeholderEngagement" className="block text-gray-300 text-sm font-serif mb-1">Stakeholder Engagement Level</label>
              <select id="stakeholderEngagement" name="stakeholderEngagement" value={settings.stakeholderEngagement} onChange={handleChange} className="input-field">
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
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
              <input type="checkbox" id="reportAutoGeneration" name="reportAutoGeneration" checked={settings.reportAutoGeneration} onChange={handleChange} className="mr-2" />
              <label htmlFor="reportAutoGeneration" className="text-gray-300 font-serif">Auto Report Generation</label>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Feature Toggles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input type="checkbox" id="kpiTracking" name="kpiTracking" checked={settings.kpiTracking} onChange={handleChange} className="mr-2" />
              <label htmlFor="kpiTracking" className="text-gray-300 font-serif">KPI Tracking</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="stakeholderManagement" name="stakeholderManagement" checked={settings.stakeholderManagement} onChange={handleChange} className="mr-2" />
              <label htmlFor="stakeholderManagement" className="text-gray-300 font-serif">Stakeholder Management</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="projectMonitoring" name="projectMonitoring" checked={settings.projectMonitoring} onChange={handleChange} className="mr-2" />
              <label htmlFor="projectMonitoring" className="text-gray-300 font-serif">Project Monitoring</label>
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
              <label htmlFor="projectApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Project API Status</label>
              <select id="projectApiStatus" name="projectApiStatus" value={settings.projectApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="stakeholderApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Stakeholder API Status</label>
              <select id="stakeholderApiStatus" name="stakeholderApiStatus" value={settings.stakeholderApiStatus} onChange={handleChange} className="input-field">
                <option>Active</option>
                <option>Inactive</option>
                <option>Maintenance</option>
              </select>
            </div>
            <div>
              <label htmlFor="monitoringApiStatus" className="block text-gray-300 text-sm font-serif mb-1">Monitoring API Status</label>
              <select id="monitoringApiStatus" name="monitoringApiStatus" value={settings.monitoringApiStatus} onChange={handleChange} className="input-field">
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

export default PMTSettings;
