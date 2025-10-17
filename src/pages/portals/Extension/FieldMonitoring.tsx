import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ExtensionFieldMonitoring: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'tech', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/tech' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const monitoringData = [
    {
      id: 'MON-001',
      farmerName: 'Ahmadu Ibrahim',
      location: 'Kaduna State',
      crop: 'Rice',
      fieldSize: '2.5 hectares',
      lastVisit: '2024-01-20',
      nextVisit: '2024-02-20',
      status: 'Good',
      issues: 'None',
      recommendations: 'Continue current practices',
      yield: '4.2 tons/hectare',
      extensionOfficer: 'Dr. Fatima Usman'
    },
    {
      id: 'MON-002',
      farmerName: 'Maryam Abdullahi',
      location: 'Kano State',
      crop: 'Maize',
      fieldSize: '3.0 hectares',
      lastVisit: '2024-01-18',
      nextVisit: '2024-02-18',
      status: 'Needs Attention',
      issues: 'Pest infestation detected',
      recommendations: 'Apply integrated pest management',
      yield: '3.8 tons/hectare',
      extensionOfficer: 'Mr. John Okafor'
    },
    {
      id: 'MON-003',
      farmerName: 'Ibrahim Musa',
      location: 'Kebbi State',
      crop: 'Wheat',
      fieldSize: '1.8 hectares',
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      status: 'Excellent',
      issues: 'None',
      recommendations: 'Consider expanding production',
      yield: '5.1 tons/hectare',
      extensionOfficer: 'Eng. Amina Hassan'
    }
  ];

  const monitoringStats = [
    { label: 'Fields Monitored', value: '125', change: '+15', trend: 'up' },
    { label: 'Active Cases', value: '8', change: '+2', trend: 'up' },
    { label: 'Average Yield', value: '4.2 tons/ha', change: '+0.3', trend: 'up' },
    { label: 'Success Rate', value: '92%', change: '+3%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Extension Organization" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Field Monitoring</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor farmer fields and track agricultural progress</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Field Monitoring Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Field Visit')}
            >
              ➕ New Visit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {monitoringStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.label}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                </div>
                <div className={`text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Field Monitoring Data</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Wheat</option>
                <option>Cassava</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Good</option>
                <option>Needs Attention</option>
                <option>Excellent</option>
                <option>Critical</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Data', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farmer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crop</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Field Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Last Visit</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Yield</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitoringData.map((field) => (
                  <tr key={field.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{field.farmerName}</p>
                        <p className="text-sm text-gray-400 font-serif">📍 {field.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{field.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{field.crop}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{field.fieldSize}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{field.lastVisit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        field.status === 'Excellent' ? 'bg-green-500 text-white' :
                        field.status === 'Good' ? 'bg-blue-500 text-white' :
                        field.status === 'Needs Attention' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {field.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{field.yield}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Field Details', field.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(field.farmerName, 'Farmer', 'farmer@email.com')}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Schedule Visit')}
                        >
                          Visit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Field Visit')}
            >
              📱 New Visit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Visits')}
            >
              📅 Schedule
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Issue Alerts')}
            >
              ⚠️ Alerts
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Monitoring Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ExtensionFieldMonitoring;
