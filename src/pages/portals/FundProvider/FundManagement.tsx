import React, { useState } from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, scheduleAction } from '../../../utils/quickActions';

const FundManagement: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💼', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Schemes', icon: '📋', href: '/portal/fund-provider/applications' },
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

  // Pagination + Search state (3 per page, same as Active Schemes)
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryPage, setCategoryPage] = useState(1);
  const categoryPageSize = 3;
  const filteredCategories = categorySearch.trim()
    ? fundCategories.filter(f => {
        const q = categorySearch.toLowerCase();
        return (
          f.name.toLowerCase().includes(q) ||
          f.status.toLowerCase().includes(q)
        );
      })
    : fundCategories;
  const totalCategoryPages = Math.max(1, Math.ceil(filteredCategories.length / categoryPageSize));
  const currentCategoryPage = Math.min(categoryPage, totalCategoryPages);
  const paginatedCategories = filteredCategories.slice((currentCategoryPage - 1) * categoryPageSize, (currentCategoryPage - 1) * categoryPageSize + categoryPageSize);

  const [deploymentSearch, setDeploymentSearch] = useState('');
  const [deploymentPage, setDeploymentPage] = useState(1);
  const deploymentPageSize = 5;
  const filteredDeployments = deploymentSearch.trim()
    ? recentDeployments.filter(d => {
        const q = deploymentSearch.toLowerCase();
        return (
          d.recipient.toLowerCase().includes(q) ||
          d.purpose.toLowerCase().includes(q) ||
          d.amount.toLowerCase().includes(q) ||
          d.status.toLowerCase().includes(q) ||
          d.date.toLowerCase().includes(q)
        );
      })
    : recentDeployments;
  const totalDeploymentPages = Math.max(1, Math.ceil(filteredDeployments.length / deploymentPageSize));
  const currentDeploymentPage = Math.min(deploymentPage, totalDeploymentPages);
  const paginatedDeployments = filteredDeployments.slice((currentDeploymentPage - 1) * deploymentPageSize, (currentDeploymentPage - 1) * deploymentPageSize + deploymentPageSize);

  const [pfiSearch, setPfiSearch] = useState('');
  const [pfiPage, setPfiPage] = useState(1);
  const pfiPageSize = 3;
  const filteredPfi = pfiSearch.trim()
    ? pfiPerformance.filter(p => {
        const q = pfiSearch.toLowerCase();
        return (
          p.bank.toLowerCase().includes(q) ||
          p.deployed.toLowerCase().includes(q) ||
          p.utilization.toLowerCase().includes(q) ||
          p.performance.toLowerCase().includes(q) ||
          p.risk.toLowerCase().includes(q)
        );
      })
    : pfiPerformance;
  const totalPfiPages = Math.max(1, Math.ceil(filteredPfi.length / pfiPageSize));
  const currentPfiPage = Math.min(pfiPage, totalPfiPages);
  const paginatedPfi = filteredPfi.slice((currentPfiPage - 1) * pfiPageSize, (currentPfiPage - 1) * pfiPageSize + pfiPageSize);

  // Recovery rate shown in the overview card (as a circular loader)
  const recoveryRatePercent = 87;
  const circleRadius = 18;
  const circleCircumference = 2 * Math.PI * circleRadius;

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Fund Management</h1>
          <p className="text-gray-200 font-serif">
            Monitor fund deployment across partners and track recovery rates for agricultural financing programs.
          </p>
        </div>

        {/* Fund Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Total Active Funds</p>
                <p className="text-2xl font-bold font-sans text-gray-100">₦16.1B</p>
                <p className="text-sm text-accent-400 font-serif">+₦2.1B this quarter</p>
              </div>
              <div className="text-3xl">🏦</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Deployed Schemes</p>
                <p className="text-2xl font-bold font-sans text-gray-100">₦11.5B</p>
                <p className="text-sm text-accent-400 font-serif">{recoveryRatePercent}% recovery</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Recovery Funds</p>
                <p className="text-2xl font-bold font-sans text-gray-100">₦4.6B</p>
                <p className="text-sm text-accent-400 font-serif">Available for schemes</p>
              </div>
              <div className="text-3xl">₦</div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-serif">Recovery Rate</p>
                <p className="text-2xl font-bold font-sans text-gray-100">{recoveryRatePercent}%</p>
                <p className="text-sm text-accent-400 font-serif">+3% improvement</p>
              </div>
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r={circleRadius}
                    strokeWidth="6"
                    stroke="currentColor"
                    className="text-primary-600"
                    fill="transparent"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r={circleRadius}
                    strokeWidth="6"
                    strokeLinecap="round"
                    stroke="currentColor"
                    className="text-accent-500"
                    fill="transparent"
                    style={{
                      strokeDasharray: circleCircumference,
                      strokeDashoffset: circleCircumference - (recoveryRatePercent / 100) * circleCircumference
                    }}
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fund Categories */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Active Applications</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={categorySearch}
                  onChange={(e) => { setCategoryPage(1); setCategorySearch(e.target.value); }}
                  placeholder="Search applications..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {paginatedCategories.map((fund, index) => (
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
                      <span className="text-gray-400 font-serif">Recovery</span>
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
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setCategoryPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous categories page"
              >
                ←
              </button>
              <div className="text-sm text-gray-300 font-sans">
                Page <span className="font-semibold">{currentCategoryPage}</span> of <span className="font-semibold">{totalCategoryPages}</span>
              </div>
              <button
                onClick={() => setCategoryPage(p => Math.min(totalCategoryPages, p + 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next categories page"
              >
                →
              </button>
            </div>
          </div>

          {/* Recent Deployments */}
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Recent Deployments</h3>
              <div className="relative w-full sm:w-auto">
                <input
                  value={deploymentSearch}
                  onChange={(e) => { setDeploymentPage(1); setDeploymentSearch(e.target.value); }}
                  placeholder="Search deployments..."
                  className="w-full sm:w-64 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                  🔍
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {paginatedDeployments.map((deployment, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-primary-700 rounded-lg gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium font-sans text-gray-100 text-sm sm:text-base">{deployment.recipient}</p>
                    <p className="text-xs sm:text-sm text-gray-300 font-serif">{deployment.purpose}</p>
                    <p className="text-xs text-gray-400 font-serif">{deployment.date}</p>
                  </div>
                  <div className="text-left sm:text-right flex-shrink-0">
                    <p className="text-sm font-semibold font-sans text-accent-400">{deployment.amount}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      deployment.status === 'Deployed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {deployment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center mt-4 gap-3">
              <button
                onClick={() => setDeploymentPage(p => Math.max(1, p - 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Previous deployments page"
              >
                ←
              </button>
              <div className="text-sm text-gray-300 font-sans">
                Page <span className="font-semibold">{currentDeploymentPage}</span> of <span className="font-semibold">{totalDeploymentPages}</span>
              </div>
              <button
                onClick={() => setDeploymentPage(p => Math.min(totalDeploymentPages, p + 1))}
                className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
                aria-label="Next deployments page"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* PFI Performance Table */}
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100">Scheme Performance Overview</h3>
            <div className="relative w-full sm:w-auto">
              <input
                value={pfiSearch}
                onChange={(e) => { setPfiPage(1); setPfiSearch(e.target.value); }}
                placeholder="Search schemes..."
                className="w-full sm:w-72 px-3 py-2 pr-10 rounded-md bg-primary-700 text-gray-100 placeholder-gray-400 border border-primary-600 focus:outline-none focus:ring-2 focus:ring-accent-500 text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                🔍
              </button>
            </div>
          </div>
          {/* Desktop table - hidden on mobile */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Bank</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Deployed Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Recovery</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Performance</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPfi.map((pfi, index) => (
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
          {/* Mobile card list - shown on mobile only */}
          <div className="md:hidden space-y-3">
            {paginatedPfi.map((pfi, index) => (
              <div key={index} className="p-3 bg-primary-700 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium font-sans text-gray-100 text-sm">{pfi.bank}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pfi.risk === 'Low' ? 'bg-green-500 text-white' :
                    pfi.risk === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {pfi.risk}
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400 font-serif">Deployed:</span>
                    <span className="text-accent-400 font-sans">{pfi.deployed}</span>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400 font-serif">Recovery:</span>
                      <span className="text-gray-300 font-serif">{pfi.utilization}</span>
                    </div>
                    <div className="w-full bg-primary-600 rounded-full h-2">
                      <div 
                        className="bg-accent-500 h-2 rounded-full" 
                        style={{ width: pfi.utilization }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-serif">Performance:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pfi.performance === 'Excellent' ? 'bg-green-500 text-white' :
                      pfi.performance === 'Good' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {pfi.performance}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 gap-3">
            <button
              onClick={() => setPfiPage(p => Math.max(1, p - 1))}
              className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
              aria-label="Previous PFIs page"
            >
              ←
            </button>
            <div className="text-sm text-gray-300 font-sans">
              Page <span className="font-semibold">{currentPfiPage}</span> of <span className="font-semibold">{totalPfiPages}</span>
            </div>
            <button
              onClick={() => setPfiPage(p => Math.min(totalPfiPages, p + 1))}
              className="px-3 py-2 bg-primary-700 hover:bg-primary-600 text-gray-100 rounded-md border border-primary-600"
              aria-label="Next PFIs page"
            >
              →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Scheme Deployment')}
            >
              ₦ Deploy New Schemes
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Monthly Fund Performance', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => scheduleAction('PFI Performance Review', 'Next Friday')}
            >
              📈 Performance Review
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default FundManagement;
