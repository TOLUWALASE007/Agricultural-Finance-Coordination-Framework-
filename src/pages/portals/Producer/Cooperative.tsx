import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const Cooperative: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/producer' },
    { id: 'loans', name: 'Loan Applications', icon: '💰', href: '/portal/producer/loans' },
    { id: 'anchors', name: 'Anchor Partners', icon: '🤝', href: '/portal/producer/anchors' },
    { id: 'inputs', name: 'Input Suppliers', icon: '🌱', href: '/portal/producer/inputs' },
    { id: 'insurance', name: 'Crop Insurance', icon: '🛡️', href: '/portal/producer/insurance' },
    { id: 'extension', name: 'Extension Services', icon: '🌾', href: '/portal/producer/extension' },
    { id: 'prices', name: 'Market Prices', icon: '📈', href: '/portal/producer/prices' },
    { id: 'cooperative', name: 'Cooperative', icon: '👥', href: '/portal/producer/cooperative' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/producer/settings' }
  ];

  const cooperatives = [
    {
      id: 'COOP-001',
      name: 'Kaduna Rice Farmers Cooperative',
      type: 'Rice Farming',
      members: 150,
      established: '2018',
      location: 'Kaduna State',
      status: 'Active',
      totalSavings: 2500000,
      totalLoans: 5000000,
      interestRate: 12.5,
      contact: '08012345678',
      email: 'kaduna.rice@coop.ng'
    },
    {
      id: 'COOP-002',
      name: 'Kano Maize Growers Association',
      type: 'Maize Farming',
      members: 200,
      established: '2019',
      location: 'Kano State',
      status: 'Active',
      totalSavings: 3200000,
      totalLoans: 6000000,
      interestRate: 10.0,
      contact: '08023456789',
      email: 'kano.maize@coop.ng'
    },
    {
      id: 'COOP-003',
      name: 'Enugu Cassava Farmers Union',
      type: 'Cassava Farming',
      members: 120,
      established: '2020',
      location: 'Enugu State',
      status: 'Pending',
      totalSavings: 1800000,
      totalLoans: 3000000,
      interestRate: 15.0,
      contact: '08034567890',
      email: 'enugu.cassava@coop.ng'
    }
  ];

  const cooperativeStats = [
    { label: 'Cooperatives Joined', value: '2', change: '+1', trend: 'up' },
    { label: 'Total Savings', value: '₦5.7M', change: '+₦1.2M', trend: 'up' },
    { label: 'Loans Received', value: '₦11M', change: '+₦2.5M', trend: 'up' },
    { label: 'Active Members', value: '350', change: '+25', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Producer/Farmer" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Cooperative</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your cooperative memberships and activities</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Cooperative Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Join Cooperative')}
            >
              ➕ Join Cooperative
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {cooperativeStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">My Cooperatives</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Rice Farming</option>
                <option>Maize Farming</option>
                <option>Cassava Farming</option>
                <option>Mixed Farming</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Cooperatives', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Cooperative</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Members</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">My Savings</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">My Loans</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Interest Rate</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cooperatives.map((coop) => (
                  <tr key={coop.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{coop.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{coop.location}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{coop.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{coop.members}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{(coop.totalSavings * 0.1).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{(coop.totalLoans * 0.1).toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{coop.interestRate}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        coop.status === 'Active' ? 'bg-green-500 text-white' :
                        coop.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {coop.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Cooperative Details', coop.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => contactPerson(coop.name, 'Cooperative Office', coop.email)}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Make Contribution')}
                        >
                          Contribute
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
              onClick={() => addNewRecord('Join Cooperative')}
            >
              👥 Join Cooperative
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Make Contribution')}
            >
              💰 Contribute
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Apply for Loan')}
            >
              📋 Apply Loan
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Cooperative Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Cooperative;
