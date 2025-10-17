import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ExtensionAdvisoryServices: React.FC = () => {
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

  const advisoryServices = [
    {
      id: 'ADV-001',
      farmerName: 'Ahmadu Ibrahim',
      location: 'Kaduna State',
      crop: 'Rice',
      issue: 'Pest Infestation',
      advisor: 'Dr. Fatima Usman',
      date: '2024-01-20',
      status: 'Completed',
      solution: 'Integrated pest management with biological control',
      followUp: '2024-02-20',
      cost: 0
    },
    {
      id: 'ADV-002',
      farmerName: 'Maryam Abdullahi',
      location: 'Kano State',
      crop: 'Maize',
      issue: 'Soil Fertility',
      advisor: 'Mr. John Okafor',
      date: '2024-01-22',
      status: 'In Progress',
      solution: 'Soil testing and fertilizer recommendation',
      followUp: '2024-02-22',
      cost: 5000
    },
    {
      id: 'ADV-003',
      farmerName: 'Ibrahim Musa',
      location: 'Kebbi State',
      crop: 'Wheat',
      issue: 'Irrigation Management',
      advisor: 'Eng. Amina Hassan',
      date: '2024-01-25',
      status: 'Scheduled',
      solution: 'Water management and irrigation scheduling',
      followUp: '2024-02-25',
      cost: 0
    }
  ];

  const advisoryStats = [
    { label: 'Active Cases', value: '15', change: '+3', trend: 'up' },
    { label: 'Farmers Served', value: '180', change: '+25', trend: 'up' },
    { label: 'Success Rate', value: '94%', change: '+2%', trend: 'up' },
    { label: 'Average Response', value: '2.5 days', change: '-0.5 days', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Advisory Services</h1>
            <p className="text-gray-400 font-serif mt-2">Provide technical advisory services to farmers and agricultural stakeholders</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Advisory Services Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Advisory Case')}
            >
              ➕ New Case
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {advisoryStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Advisory Cases</h3>
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
                <option>Completed</option>
                <option>In Progress</option>
                <option>Scheduled</option>
                <option>Pending</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Cases', 'CUSTOM')}
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Issue</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Advisor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {advisoryServices.map((service) => (
                  <tr key={service.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{service.farmerName}</p>
                        <p className="text-sm text-gray-400 font-serif">📍 {service.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.crop}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{service.issue}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.advisor}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{service.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        service.status === 'Completed' ? 'bg-green-500 text-white' :
                        service.status === 'In Progress' ? 'bg-yellow-500 text-white' :
                        service.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Case Details', service.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(service.farmerName, 'Farmer', 'farmer@email.com')}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Schedule Follow-up')}
                        >
                          Follow-up
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
              onClick={() => addNewRecord('Advisory Case')}
            >
              💡 New Case
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Visit')}
            >
              📅 Schedule Visit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Follow-up Cases')}
            >
              🔄 Follow-up
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Advisory Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ExtensionAdvisoryServices;
