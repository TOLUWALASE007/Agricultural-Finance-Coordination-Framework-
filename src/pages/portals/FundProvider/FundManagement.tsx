import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, addNewRecord, processAction, scheduleAction } from '../../../utils/quickActions';

const FundManagement: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💰', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'pfis', name: 'PFI Partners', icon: '🏦', href: '/portal/fund-provider/pfis' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/fund-provider/insurance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const fundCategories = [
    { name: 'Agricultural Credit Fund', amount: '₦8.5B', deployed: '₦6.2B', utilization: '73%', status: 'Active' },
    { name: 'Climate Finance Fund', amount: '₦3.2B', deployed: '₦2.1B', utilization: '66%', status: 'Active' },
    { name: 'Women Farmer Fund', amount: '₦2.1B', deployed: '₦1.8B', utilization: '86%', status: 'Active' },
    { name: 'Youth Agriculture Fund', amount: '₦1.5B', deployed: '₦980M', utilization: '65%', status: 'Active' },
    { name: 'Technology Innovation Fund', amount: '₦800M', deployed: '₦450M', utilization: '56%', status: 'Active' }
  ];

  const recentDeployments = [
    { date: '2024-01-15', amount: '₦500M', recipient: 'First Bank of Nigeria', purpose: 'Q1 Agricultural Lending', status: 'Deployed' },
    { date: '2024-01-12', amount: '₦300M', recipient: 'Zenith Bank', purpose: 'Climate Smart Agriculture', status: 'Deployed' },
    { date: '2024-01-10', amount: '₦200M', recipient: 'Access Bank', purpose: 'Women Farmer Support', status: 'Pending' },
    { date: '2024-01-08', amount: '₦150M', recipient: 'GTBank', purpose: 'Youth Agriculture Program', status: 'Deployed' }
  ];

  const pfiPerformance = [
    { bank: 'First Bank of Nigeria', deployed: '₦850M', utilization: '95%', performance: 'Excellent', risk: 'Low' },
    { bank: 'Zenith Bank', deployed: '₦720M', utilization: '92%', performance: 'Excellent', risk: 'Low' },
    { bank: 'Access Bank', deployed: '₦680M', utilization: '89%', performance: 'Good', risk: 'Medium' },
    { bank: 'GTBank', deployed: '₦590M', utilization: '87%', performance: 'Good', risk: 'Medium' },
    { bank: 'UBA', deployed: '₦420M', utilization: '78%', performance: 'Fair', risk: 'Medium' }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="💰" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Fund Management</h1>
          <p className="text-gray-200 font-serif">
            Monitor fund deployment across PFI partners and track utilization rates for agricultural financing programs.
          </p>
        </div>

        {/* Fund Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Total Fund Pool</p>
                <p className="text-2xl font-bold font-sans text-gray-100">₦16.1B</p>
                <p className="text-sm text-accent-400 font-serif">+₦2.1B this quarter</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Deployed Amount</p>
                <p className="text-2xl font-bold font-sans text-gray-100">₦11.5B</p>
                <p className="text-sm text-accent-400 font-serif">71% utilization</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Active PFIs</p>
                <p className="text-2xl font-bold font-sans text-gray-100">24</p>
                <p className="text-sm text-accent-400 font-serif">+2 new partners</p>
              </div>
              <div className="text-3xl">🏦</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Average Performance</p>
                <p className="text-2xl font-bold font-sans text-gray-100">87%</p>
                <p className="text-sm text-accent-400 font-serif">+3% improvement</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fund Categories */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Fund Categories</h3>
            <div className="space-y-4">
              {fundCategories.map((fund, index) => (
                <div key={index} className="p-4 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{fund.name}</h4>
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                      {fund.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Total Amount</p>
                      <p className="font-semibold font-sans text-gray-100">{fund.amount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Deployed</p>
                      <p className="font-semibold font-sans text-gray-100">{fund.deployed}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 font-serif">Utilization</span>
                      <span className="text-accent-400 font-sans">{fund.utilization}</span>
                    </div>
                    <div className="w-full bg-primary-600 rounded-full h-2">
                      <div 
                        className="bg-accent-500 h-2 rounded-full" 
                        style={{ width: fund.utilization }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Deployments</h3>
            <div className="space-y-3">
              {recentDeployments.map((deployment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{deployment.recipient}</p>
                    <p className="text-sm text-gray-300 font-serif">{deployment.purpose}</p>
                    <p className="text-xs text-gray-400 font-serif">{deployment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{deployment.amount}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      deployment.status === 'Deployed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {deployment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PFI Performance Table */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">PFI Performance Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Bank</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Deployed Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Utilization</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Performance</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {pfiPerformance.map((pfi, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-gray-100">{pfi.bank}</td>
                    <td className="py-3 px-4 text-accent-400 font-sans">{pfi.deployed}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: pfi.utilization }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{pfi.utilization}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pfi.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        pfi.performance === 'Good' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {pfi.performance}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pfi.risk === 'Low' ? 'bg-green-500 text-white' :
                        pfi.risk === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {pfi.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Fund Deployment')}
            >
              💰 Deploy New Funds
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Monthly Fund Performance', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('PFI Partner')}
            >
              🏦 Add PFI Partner
            </button>
            <button 
              className="btn-secondary"
              onClick={() => scheduleAction('PFI Performance Review', 'Next Friday')}
            >
              📈 Performance Review
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default FundManagement;
