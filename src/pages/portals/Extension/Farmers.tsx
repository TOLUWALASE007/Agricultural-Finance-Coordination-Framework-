import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const Farmers: React.FC = () => {
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

  const farmers = [
    {
      id: 'FAR-001',
      name: 'Ibrahim Musa',
      location: 'Kaduna State',
      farmSize: '5 hectares',
      crops: ['Rice', 'Maize'],
      farmingExperience: '15 years',
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      status: 'Active',
      phone: '+234-803-456-7890',
      email: 'ibrahim@farmer.com',
      trainingCompleted: 8,
      technologyAdopted: ['Improved Seeds', 'Fertilizer Application'],
      yieldImprovement: 25
    },
    {
      id: 'FAR-002',
      name: 'Fatima Ahmed',
      location: 'Kano State',
      farmSize: '3 hectares',
      crops: ['Wheat', 'Sorghum'],
      farmingExperience: '12 years',
      lastVisit: '2024-01-12',
      nextVisit: '2024-02-12',
      status: 'Active',
      phone: '+234-805-678-9012',
      email: 'fatima@farmer.com',
      trainingCompleted: 6,
      technologyAdopted: ['Drip Irrigation', 'Pest Management'],
      yieldImprovement: 18
    },
    {
      id: 'FAR-003',
      name: 'John Okafor',
      location: 'Enugu State',
      farmSize: '7 hectares',
      crops: ['Cassava', 'Yam'],
      farmingExperience: '8 years',
      lastVisit: '2024-01-08',
      nextVisit: '2024-02-08',
      status: 'New',
      phone: '+234-807-890-1234',
      email: 'john@farmer.com',
      trainingCompleted: 2,
      technologyAdopted: ['Improved Varieties'],
      yieldImprovement: 5
    }
  ];

  const farmerStats = [
    { label: 'Total Farmers', value: '3,247', change: '+89', trend: 'up' },
    { label: 'Active Farmers', value: '2,980', change: '+67', trend: 'up' },
    { label: 'New Farmers', value: '267', change: '+22', trend: 'up' },
    { label: 'Average Yield Improvement', value: '22%', change: '+3%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Farmers</h1>
            <p className="text-gray-400 font-serif mt-2">Manage farmer relationships and extension services</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Farmers Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Farmer')}
            >
              ➕ Add Farmer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {farmerStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Farmer Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>New</option>
                <option>Inactive</option>
              </select>
              <select className="input-field w-auto">
                <option>All Locations</option>
                <option>Kaduna State</option>
                <option>Kano State</option>
                <option>Enugu State</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Farmers', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farmer ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farm Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crops</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Yield Improvement</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((farmer) => (
                  <tr key={farmer.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{farmer.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{farmer.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Experience: {farmer.farmingExperience}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{farmer.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{farmer.farmSize}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {farmer.crops.map((crop, index) => (
                          <span key={index} className="px-1 py-0.5 bg-primary-600 text-white text-xs rounded">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">+{farmer.yieldImprovement}%</p>
                        <p className="text-sm text-gray-400 font-serif">Training: {farmer.trainingCompleted}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        farmer.status === 'Active' ? 'bg-green-500 text-white' :
                        farmer.status === 'New' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {farmer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Farmer Profile', farmer.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(farmer.name, farmer.phone, farmer.email)}
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
              onClick={() => addNewRecord('Farmer Registration')}
            >
              🌾 Add Farmer
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Advisory Visit')}
            >
              💡 Advisory Visit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Training Enrollment')}
            >
              🎓 Training
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Farmer Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Farmers;
