import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ProducerNetwork: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pfi' },
    { id: 'loans', name: 'Loan Processing', icon: '💰', href: '/portal/pfi/loans' },
    { id: 'applications', name: 'Applications', icon: '📋', href: '/portal/pfi/applications' },
    { id: 'producers', name: 'Producer Network', icon: '🌾', href: '/portal/pfi/producers' },
    { id: 'anchors', name: 'Anchor Partners', icon: '⚓', href: '/portal/pfi/anchors' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/pfi/insurance' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/pfi/risk' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/pfi/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pfi/settings' }
  ];

  const producers = [
    {
      id: 'PROD-001',
      name: 'Adebayo Ogunlesi',
      farm: 'Green Valley Farms',
      location: 'Ogun State',
      farmSize: 25.5,
      crops: ['Rice', 'Maize', 'Cassava'],
      creditScore: 720,
      totalLoans: 2500000,
      activeLoans: 750000,
      repaymentRate: 95,
      lastActivity: '2024-01-15',
      status: 'Active'
    },
    {
      id: 'PROD-002',
      name: 'Fatima Ibrahim',
      farm: 'Ibrahim Farms',
      location: 'Kano State',
      farmSize: 18.2,
      crops: ['Wheat', 'Sorghum'],
      creditScore: 780,
      totalLoans: 1800000,
      activeLoans: 0,
      repaymentRate: 100,
      lastActivity: '2024-01-12',
      status: 'Active'
    },
    {
      id: 'PROD-003',
      name: 'Chinedu Okonkwo',
      farm: 'Okonkwo Enterprises',
      location: 'Anambra State',
      farmSize: 12.8,
      crops: ['Cassava', 'Yam'],
      creditScore: 680,
      totalLoans: 1200000,
      activeLoans: 500000,
      repaymentRate: 88,
      lastActivity: '2024-01-18',
      status: 'Active'
    },
    {
      id: 'PROD-004',
      name: 'Aisha Mohammed',
      farm: 'Mohammed Agro',
      location: 'Kaduna State',
      farmSize: 35.0,
      crops: ['Rice', 'Maize', 'Groundnut'],
      creditScore: 650,
      totalLoans: 3200000,
      activeLoans: 0,
      repaymentRate: 92,
      lastActivity: '2024-01-05',
      status: 'Inactive'
    }
  ];

  const networkStats = [
    { label: 'Total Producers', value: '247', change: '+12%', trend: 'up' },
    { label: 'Active Producers', value: '189', change: '+8%', trend: 'up' },
    { label: 'Average Credit Score', value: '715', change: '+5%', trend: 'up' },
    { label: 'Repayment Rate', value: '94.2%', change: '+2%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Participating Bank (PFI)" 
      roleIcon="🏦" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Producer Network</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your producer network and relationships</p>
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
              onClick={() => addNewRecord('Producer Registration')}
            >
              ➕ Add Producer
            </button>
          </div>
        </div>

        {/* Network Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {networkStats.map((stat, index) => (
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

        {/* Producers Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Producer Network</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
              <select className="input-field w-auto">
                <option>All Locations</option>
                <option>Ogun State</option>
                <option>Kano State</option>
                <option>Anambra State</option>
                <option>Kaduna State</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Name & Farm</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Location</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Farm Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Credit Score</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Active Loans</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Repayment Rate</th>
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
                        <p className="text-sm text-gray-400 font-serif">{producer.farm}</p>
                        <p className="text-xs text-gray-500 font-serif">{producer.crops.join(', ')}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{producer.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{producer.farmSize} ha</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              producer.creditScore >= 750 ? 'bg-green-500' :
                              producer.creditScore >= 700 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(producer.creditScore / 850) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{producer.creditScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{producer.activeLoans.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              producer.repaymentRate >= 95 ? 'bg-green-500' :
                              producer.repaymentRate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${producer.repaymentRate}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{producer.repaymentRate}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        producer.status === 'Active' ? 'bg-green-500 text-white' :
                        producer.status === 'Inactive' ? 'bg-gray-500 text-white' :
                        'bg-yellow-500 text-white'
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
                          onClick={() => contactPerson(producer.name, '+234-803-456-7890', 'producer@email.com')}
                        >
                          Contact
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('New Loan Application')}
                        >
                          Loan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Credit Score Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Excellent (750+)</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">35%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Good (700-749)</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Fair (650-699)</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">15%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Poor (&lt;650)</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Top Performing Producers</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-100 font-sans">Fatima Ibrahim</p>
                  <p className="text-xs text-gray-400 font-serif">Ibrahim Farms</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 font-sans">100% Repayment</p>
                  <p className="text-xs text-gray-400 font-serif">Score: 780</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-100 font-sans">Adebayo Ogunlesi</p>
                  <p className="text-xs text-gray-400 font-serif">Green Valley Farms</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-400 font-sans">95% Repayment</p>
                  <p className="text-xs text-gray-400 font-serif">Score: 720</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                <div>
                  <p className="text-sm text-gray-100 font-sans">Aisha Mohammed</p>
                  <p className="text-xs text-gray-400 font-serif">Mohammed Agro</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-yellow-400 font-sans">92% Repayment</p>
                  <p className="text-xs text-gray-400 font-serif">Score: 650</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
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
              onClick={() => processAction('Credit Score Update')}
            >
              📈 Update Scores
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Network Communication')}
            >
              📢 Notify All
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ProducerNetwork;
