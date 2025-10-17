import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ProducerNetwork: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/anchor' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/anchor/producers' },
    { id: 'contracts', name: 'Supply Contracts', icon: '📄', href: '/portal/anchor/contracts' },
    { id: 'loans', name: 'Loan Performance', icon: '💰', href: '/portal/anchor/loans' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/anchor/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/anchor/settings' }
  ];

  const producers = [
    {
      id: 'PROD-001',
      name: 'Ibrahim Musa',
      location: 'Kaduna State',
      farmSize: '5 hectares',
      crops: ['Rice', 'Maize'],
      status: 'Active',
      joinDate: '2023-01-15',
      contracts: 2,
      totalValue: 2500000,
      lastHarvest: '2023-12-15',
      phone: '+234-803-456-7890',
      email: 'ibrahim@farm.com'
    },
    {
      id: 'PROD-002',
      name: 'Fatima Ahmed',
      location: 'Kano State',
      farmSize: '3 hectares',
      crops: ['Wheat', 'Sorghum'],
      status: 'Active',
      joinDate: '2023-02-20',
      contracts: 1,
      totalValue: 1800000,
      lastHarvest: '2023-11-20',
      phone: '+234-805-678-9012',
      email: 'fatima@farm.com'
    },
    {
      id: 'PROD-003',
      name: 'John Okafor',
      location: 'Enugu State',
      farmSize: '7 hectares',
      crops: ['Cassava', 'Yam'],
      status: 'Pending',
      joinDate: '2024-01-10',
      contracts: 0,
      totalValue: 0,
      lastHarvest: 'N/A',
      phone: '+234-807-890-1234',
      email: 'john@farm.com'
    }
  ];

  const producerStats = [
    { label: 'Total Producers', value: '156', change: '+12', trend: 'up' },
    { label: 'Active Contracts', value: '89', change: '+8', trend: 'up' },
    { label: 'Total Farm Area', value: '450 ha', change: '+25 ha', trend: 'up' },
    { label: 'Average Yield', value: '2.5 tons/ha', change: '+15%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Anchor" 
      roleIcon="🏢" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Producer Network</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your producer network and farming partnerships</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Producer Network Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Producer')}
            >
              ➕ Add Producer
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {producerStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Producer Directory</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Inactive</option>
              </select>
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Wheat</option>
                <option>Cassava</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Producers', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Producer ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farm Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crops</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {producers.map((producer) => (
                  <tr key={producer.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{producer.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{producer.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Joined: {producer.joinDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{producer.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{producer.farmSize}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {producer.crops.map((crop, index) => (
                          <span key={index} className="px-2 py-1 bg-primary-600 text-white text-xs rounded">
                            {crop}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producer.status === 'Active' ? 'bg-green-500 text-white' :
                        producer.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {producer.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Producer Profile', producer.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(producer.name, producer.phone, producer.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Create Contract')}
                        >
                          Contract
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
              onClick={() => addNewRecord('Producer Registration')}
            >
              🌾 Add Producer
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Producer Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Quality Assessment')}
            >
              🔍 Quality Check
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Training Program')}
            >
              🎓 Training
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProducerNetwork;
