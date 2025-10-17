import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Guarantees: React.FC = () => {
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

  const guarantees = [
    {
      id: 'GAR-001',
      guaranteeName: 'Smallholder Loan Guarantee',
      beneficiary: 'Access Bank PLC',
      guaranteeType: 'Loan Guarantee',
      guaranteeAmount: 500000000,
      coveragePercentage: 80,
      guaranteeFee: 2.5,
      startDate: '2023-01-15',
      endDate: '2025-01-15',
      status: 'Active',
      utilizedAmount: 350000000,
      remainingAmount: 150000000,
      claimsPaid: 25000000,
      riskRating: 'Low'
    },
    {
      id: 'GAR-002',
      guaranteeName: 'Agricultural Input Credit Guarantee',
      beneficiary: 'First Bank of Nigeria',
      guaranteeType: 'Credit Guarantee',
      guaranteeAmount: 300000000,
      coveragePercentage: 70,
      guaranteeFee: 3.0,
      startDate: '2023-06-01',
      endDate: '2024-12-31',
      status: 'Active',
      utilizedAmount: 200000000,
      remainingAmount: 100000000,
      claimsPaid: 15000000,
      riskRating: 'Medium'
    },
    {
      id: 'GAR-003',
      guaranteeName: 'Climate Risk Insurance Guarantee',
      beneficiary: 'Leadway Assurance',
      guaranteeType: 'Insurance Guarantee',
      guaranteeAmount: 200000000,
      coveragePercentage: 60,
      guaranteeFee: 4.0,
      startDate: '2024-01-01',
      endDate: '2026-12-31',
      status: 'Planning',
      utilizedAmount: 0,
      remainingAmount: 200000000,
      claimsPaid: 0,
      riskRating: 'High'
    }
  ];

  const guaranteeStats = [
    { label: 'Total Guarantees', value: '1,247', change: '+89', trend: 'up' },
    { label: 'Active Guarantees', value: '1,180', change: '+45', trend: 'up' },
    { label: 'Total Coverage', value: '₦15.6B', change: '+₦2.1B', trend: 'up' },
    { label: 'Claims Paid', value: '₦450M', change: '+₦75M', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Guarantees</h1>
            <p className="text-gray-400 font-serif mt-2">Manage guarantee programs and risk coverage</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Guarantees Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Guarantee')}
            >
              ➕ New Guarantee
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {guaranteeStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Guarantee Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Loan Guarantee</option>
                <option>Credit Guarantee</option>
                <option>Insurance Guarantee</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Planning</option>
                <option>Expired</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Guarantees', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Guarantee ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Guarantee Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Beneficiary</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Coverage</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guarantees.map((guarantee) => (
                  <tr key={guarantee.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{guarantee.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{guarantee.guaranteeName}</p>
                        <p className="text-sm text-gray-400 font-serif">Fee: {guarantee.guaranteeFee}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{guarantee.beneficiary}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{guarantee.guaranteeType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{(guarantee.guaranteeAmount / 100000000).toFixed(1)}M</p>
                        <p className="text-sm text-gray-400 font-serif">Utilized: ₦{(guarantee.utilizedAmount / 100000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{guarantee.coveragePercentage}%</p>
                        <p className="text-sm text-gray-400 font-serif">Remaining: ₦{(guarantee.remainingAmount / 100000000).toFixed(1)}M</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        guarantee.status === 'Active' ? 'bg-green-500 text-white' :
                        guarantee.status === 'Planning' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {guarantee.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Guarantee Details', guarantee.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Process Claim')}
                        >
                          Claim
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
              onClick={() => addNewRecord('Guarantee Issuance')}
            >
              🛡️ Issue Guarantee
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Claim Processing')}
            >
              📋 Process Claims
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📈 Risk Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Guarantee Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Guarantees;
