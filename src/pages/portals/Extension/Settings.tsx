import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const ExtensionSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'technology', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/technology' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const [settings, setSettings] = useState({
    organizationName: 'National Agricultural Extension and Research Liaison Services (NAERLS)',
    registrationNumber: 'RC123456789',
    establishedYear: 1992,
    totalFarmers: 3247,
    activePrograms: 45,
    advisoryVisits: 1456,
    technologyAdoptions: 234,
    maxTrainingParticipants: 50,
    standardTrainingDuration: 3,
    advisoryVisitFrequency: 'Monthly',
    technologyTransferBudget: 50000000,
    emailNotifications: true,
    smsNotifications: false,
    autoVisitScheduling: true,
    trainingAutoEnrollment: false,
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'director@naerls.gov.ng',
    contactPhone: '+234-803-456-7890',
    officeAddress: '123 Extension Road, Zaria, Kaduna State',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    farmerApiStatus: 'Active',
    trainingApiStatus: 'Active',
    advisoryApiStatus: 'Active',
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
      organizationName: 'National Agricultural Extension and Research Liaison Services (NAERLS)',
      registrationNumber: 'RC123456789',
      establishedYear: 1992,
      totalFarmers: 3247,
      activePrograms: 45,
      advisoryVisits: 1456,
      technologyAdoptions: 234,
      maxTrainingParticipants: 50,
      standardTrainingDuration: 3,
      advisoryVisitFrequency: 'Monthly',
      technologyTransferBudget: 50000000,
      emailNotifications: true,
      smsNotifications: false,
      autoVisitScheduling: true,
      trainingAutoEnrollment: false,
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'director@naerls.gov.ng',
      contactPhone: '+234-803-456-7890',
      officeAddress: '123 Extension Road, Zaria, Kaduna State',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      farmerApiStatus: 'Active',
      trainingApiStatus: 'Active',
      advisoryApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="Extension Organization" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Extension Organization Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Organization Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="organizationName" className="block text-gray-300 text-sm font-serif mb-1">Organization Name</label>
              <input type="text" id="organizationName" name="organizationName" value={settings.organizationName} onChange={handleChange} className="input-field" />
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
              <label htmlFor="totalFarmers" className="block text-gray-300 text-sm font-serif mb-1">Total Farmers Served</label>
              <input type="number" id="totalFarmers" name="totalFarmers" value={settings.totalFarmers} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Program Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="maxTrainingParticipants" className="block text-gray-300 text-sm font-serif mb-1">Max Training Participants</label>
              <input type="number" id="maxTrainingParticipants" name="maxTrainingParticipants" value={settings.maxTrainingParticipants} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="standardTrainingDuration" className="block text-gray-300 text-sm font-serif mb-1">Standard Training Duration (days)</label>
              <input type="number" id="standardTrainingDuration" name="standardTrainingDuration" value={settings.standardTrainingDuration} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="advisoryVisitFrequency" className="block text-gray-300 text-sm font-serif mb-1">Advisory Visit Frequency</label>
              <select id="advisoryVisitFrequency" name="advisoryVisitFrequency" value={settings.advisoryVisitFrequency} onChange={handleChange} className="input-field">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>As Needed</option>
              </select>
            </div>
            <div>
              <label htmlFor="technologyTransferBudget" className="block text-gray-300 text-sm font-serif mb-1">Technology Transfer Budget (₦)</label>
              <input type="number" id="technologyTransferBudget" name="technologyTransferBudget" value={settings.technologyTransferBudget} onChange={handleChange} className="input-field" />
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
              <input type="checkbox" id="autoVisitScheduling" name="autoVisitScheduling" checked={settings.autoVisitScheduling} onChange={handleChange} className="mr-2" />
              <label htmlFor="autoVisitScheduling" className="text-gray-300 font-serif">Auto Visit Scheduling</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="trainingAutoEnrollment" name="trainingAutoEnrollment" checked={settings.trainingAutoEnrollment} onChange={handleChange} className="mr-2" />
              <label htmlFor="trainingAutoEnrollment" className="text-gray-300 font-serif">Training Auto Enrollment</label>
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

export default ExtensionSettings;
