import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const DeRiskingFunds: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/de-risking' },
    { id: 'funds', name: 'De-risking Funds', icon: '💰', href: '/portal/de-risking/funds' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/de-risking/risk' },
    { id: 'guarantees', name: 'Guarantees', icon: '🛡️', href: '/portal/de-risking/guarantees' },
    { id: 'partners', name: 'Partners', icon: '🤝', href: '/portal/de-risking/partners' },
    { id: 'monitoring', name: 'Monitoring', icon: '📱', href: '/portal/de-risking/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/de-risking/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/de-risking/settings' }
  ];

  const funds = [
    {
      id: 'DRF-001',
      fundName: 'Agricultural Risk Mitigation Fund',
      fundType: 'Government Fund',
      totalAmount: 5000000000,
      deployedAmount: 3200000000,
      availableAmount: 1800000000,
      coverageArea: 'National',
      riskCategory: 'Climate Risk',
      status: 'Active',
      startDate: '2023-01-15',
      endDate: '2025-12-31',
      managementFee: 0.5,
      beneficiaries: 1250
    },
    {
      id: 'DRF-002',
      fundName: 'Smallholder Farmer Protection Fund',
      fundType: 'Development Fund',
      totalAmount: 2000000000,
      deployedAmount: 1500000000,
      availableAmount: 500000000,
      coverageArea: 'Northern States',
      riskCategory: 'Price Risk',
      status: 'Active',
      startDate: '2023-06-01',
      endDate: '2026-05-31',
      managementFee: 0.3,
      beneficiaries: 850
    },
    {
      id: 'DRF-003',
      fundName: 'Crop Insurance Support Fund',
      fundType: 'Private Fund',
      totalAmount: 1000000000,
      deployedAmount: 0,
      availableAmount: 1000000000,
      coverageArea: 'Southwest',
      riskCategory: 'Production Risk',
      status: 'Planning',
      startDate: '2024-03-01',
      endDate: '2027-02-28',
      managementFee: 0.8,
      beneficiaries: 0
    }
  ];

  const fundStats = [
    { label: 'Total Funds', value: '₦8.2B', change: '+₦1.2B', trend: 'up' },
    { label: 'Deployed Amount', value: '₦4.7B', change: '+₦800M', trend: 'up' },
    { label: 'Available Amount', value: '₦3.5B', change: '+₦400M', trend: 'up' },
    { label: 'Beneficiaries', value: '2,100', change: '+150', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="De-risking Institution" 
      roleIcon="🛡️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">De-risking Funds</h1>
            <p className="text-gray-400 font-serif mt-2">Manage de-risking funds and risk mitigation programs</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('De-risking Funds Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Fund')}
            >
              ➕ New Fund
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {fundStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Fund Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Government Fund</option>
                <option>Development Fund</option>
                <option>Private Fund</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Completed</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Funds', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Fund ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Fund Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Total Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Deployed</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {funds.map((fund) => (
                  <tr key={fund.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{fund.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{fund.fundName}</p>
                        <p className="text-sm text-gray-400 font-serif">{fund.coverageArea} - {fund.riskCategory}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{fund.fundType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(fund.totalAmount / 1000000000).toFixed(1)}B</p>
                        <p className="text-sm text-gray-400 font-serif">Fee: {fund.managementFee}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(fund.deployedAmount / 1000000000).toFixed(1)}B</p>
                        <p className="text-sm text-gray-400 font-serif">Available: ₦{(fund.availableAmount / 1000000000).toFixed(1)}B</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fund.status === 'Active' ? 'bg-green-500 text-white' :
                        fund.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {fund.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Fund Details', fund.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Deploy Funds')}
                        >
                          Deploy
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Monitor Performance')}
                        >
                          Monitor
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
              onClick={() => addNewRecord('Fund Creation')}
            >
              💰 New Fund
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Fund Deployment')}
            >
              📊 Deploy Funds
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📈 Risk Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Fund Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default DeRiskingFunds;
