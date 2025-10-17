import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { showNotification, generateReport, exportData } from '../../../utils/quickActions';

const ResearcherSettings: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'research', name: 'Research Projects', icon: '🔬', href: '/portal/researcher/projects' },
    { id: 'data', name: 'Data Collection', icon: '📊', href: '/portal/researcher/data' },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/researcher/publications' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝', href: '/portal/researcher/collaborations' },
    { id: 'funding', name: 'Funding', icon: '💰', href: '/portal/researcher/funding' },
    { id: 'conferences', name: 'Conferences', icon: '🎓', href: '/portal/researcher/conferences' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/researcher/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const [settings, setSettings] = useState({
    researcherName: 'Dr. Sarah Johnson',
    institution: 'Ahmadu Bello University',
    department: 'Agricultural Economics',
    position: 'Senior Research Fellow',
    specialization: 'Climate-Smart Agriculture',
    yearsOfExperience: 12,
    activeProjects: 8,
    publications: 23,
    hIndex: 15,
    researchInterests: ['Climate Adaptation', 'Digital Agriculture', 'Food Security'],
    maxProjectDuration: 36,
    standardDataRetention: 7,
    collaborationPreference: 'Open',
    emailNotifications: true,
    smsNotifications: false,
    autoDataBackup: true,
    publicationAlerts: true,
    primaryContact: 'Dr. Sarah Johnson',
    contactEmail: 'sarah.johnson@abu.edu.ng',
    contactPhone: '+234-803-456-7890',
    officeAddress: 'Faculty of Agriculture, ABU, Zaria',
    sessionTimeout: 30,
    twoFactorAuth: true,
    passwordExpiry: 90,
    loginAttempts: 5,
    researchApiStatus: 'Active',
    dataApiStatus: 'Active',
    publicationApiStatus: 'Active',
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
      researcherName: 'Dr. Sarah Johnson',
      institution: 'Ahmadu Bello University',
      department: 'Agricultural Economics',
      position: 'Senior Research Fellow',
      specialization: 'Climate-Smart Agriculture',
      yearsOfExperience: 12,
      activeProjects: 8,
      publications: 23,
      hIndex: 15,
      researchInterests: ['Climate Adaptation', 'Digital Agriculture', 'Food Security'],
      maxProjectDuration: 36,
      standardDataRetention: 7,
      collaborationPreference: 'Open',
      emailNotifications: true,
      smsNotifications: false,
      autoDataBackup: true,
      publicationAlerts: true,
      primaryContact: 'Dr. Sarah Johnson',
      contactEmail: 'sarah.johnson@abu.edu.ng',
      contactPhone: '+234-803-456-7890',
      officeAddress: 'Faculty of Agriculture, ABU, Zaria',
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordExpiry: 90,
      loginAttempts: 5,
      researchApiStatus: 'Active',
      dataApiStatus: 'Active',
      publicationApiStatus: 'Active',
      backupFrequency: 'Daily'
    });
    showNotification('Settings reset to default!', 'info');
  };

  return (
    <PortalLayout 
      role="Researcher/Student" 
      roleIcon="🔬" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold font-sans text-gray-100 mb-6">Researcher Settings</h1>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="researcherName" className="block text-gray-300 text-sm font-serif mb-1">Researcher Name</label>
              <input type="text" id="researcherName" name="researcherName" value={settings.researcherName} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="institution" className="block text-gray-300 text-sm font-serif mb-1">Institution</label>
              <input type="text" id="institution" name="institution" value={settings.institution} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="department" className="block text-gray-300 text-sm font-serif mb-1">Department</label>
              <input type="text" id="department" name="department" value={settings.department} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="position" className="block text-gray-300 text-sm font-serif mb-1">Position</label>
              <input type="text" id="position" name="position" value={settings.position} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-gray-300 text-sm font-serif mb-1">Specialization</label>
              <input type="text" id="specialization" name="specialization" value={settings.specialization} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="yearsOfExperience" className="block text-gray-300 text-sm font-serif mb-1">Years of Experience</label>
              <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={settings.yearsOfExperience} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold font-sans text-gray-100 mb-4">Research Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="activeProjects" className="block text-gray-300 text-sm font-serif mb-1">Active Projects</label>
              <input type="number" id="activeProjects" name="activeProjects" value={settings.activeProjects} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="publications" className="block text-gray-300 text-sm font-serif mb-1">Publications</label>
              <input type="number" id="publications" name="publications" value={settings.publications} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="hIndex" className="block text-gray-300 text-sm font-serif mb-1">H-Index</label>
              <input type="number" id="hIndex" name="hIndex" value={settings.hIndex} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="maxProjectDuration" className="block text-gray-300 text-sm font-serif mb-1">Max Project Duration (months)</label>
              <input type="number" id="maxProjectDuration" name="maxProjectDuration" value={settings.maxProjectDuration} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="standardDataRetention" className="block text-gray-300 text-sm font-serif mb-1">Standard Data Retention (years)</label>
              <input type="number" id="standardDataRetention" name="standardDataRetention" value={settings.standardDataRetention} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label htmlFor="collaborationPreference" className="block text-gray-300 text-sm font-serif mb-1">Collaboration Preference</label>
              <select id="collaborationPreference" name="collaborationPreference" value={settings.collaborationPreference} onChange={handleChange} className="input-field">
                <option>Open</option>
                <option>Selective</option>
                <option>Restricted</option>
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
              <input type="checkbox" id="autoDataBackup" name="autoDataBackup" checked={settings.autoDataBackup} onChange={handleChange} className="mr-2" />
              <label htmlFor="autoDataBackup" className="text-gray-300 font-serif">Auto Data Backup</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="publicationAlerts" name="publicationAlerts" checked={settings.publicationAlerts} onChange={handleChange} className="mr-2" />
              <label htmlFor="publicationAlerts" className="text-gray-300 font-serif">Publication Alerts</label>
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

export default ResearcherSettings;
