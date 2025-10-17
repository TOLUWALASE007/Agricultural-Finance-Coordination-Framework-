import React from 'react';
import PortalLayout from '../../../components/PortalLayout';

const PFIPartners: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💰', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'pfis', name: 'PFI Partners', icon: '🏦', href: '/portal/fund-provider/pfis' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/fund-provider/insurance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const pfiStats = [
    { title: 'Total PFI Partners', value: '24', change: '+2', icon: '🏦' },
    { title: 'Active Partnerships', value: '22', change: '+1', icon: '✅' },
    { title: 'Total Deployed', value: '₦8.2B', change: '+₦1.1B', icon: '💰' },
    { title: 'Average Performance', value: '87%', change: '+3%', icon: '📈' }
  ];

  const pfiDetails = [
    {
      bank: 'First Bank of Nigeria',
      partnershipDate: '2023-01-15',
      deployedAmount: '₦850M',
      utilizationRate: '95%',
      performanceScore: '9.2/10',
      activeLoans: '1,247',
      riskLevel: 'Low',
      contactPerson: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@firstbank.com',
      phone: '+234 803 123 4567',
      branches: '156',
      coverage: 'National',
      specializations: ['Crop Production', 'Livestock', 'Agri-processing']
    },
    {
      bank: 'Zenith Bank',
      partnershipDate: '2023-02-20',
      deployedAmount: '₦720M',
      utilizationRate: '92%',
      performanceScore: '8.9/10',
      activeLoans: '1,089',
      riskLevel: 'Low',
      contactPerson: 'Mr. Michael Adebayo',
      email: 'michael.adebayo@zenithbank.com',
      phone: '+234 802 987 6543',
      branches: '134',
      coverage: 'National',
      specializations: ['Climate Smart Agriculture', 'Digital Farming']
    },
    {
      bank: 'Access Bank',
      partnershipDate: '2023-03-10',
      deployedAmount: '₦680M',
      utilizationRate: '89%',
      performanceScore: '8.5/10',
      activeLoans: '956',
      riskLevel: 'Medium',
      contactPerson: 'Mrs. Fatima Ibrahim',
      email: 'fatima.ibrahim@accessbank.com',
      phone: '+234 801 456 7890',
      branches: '98',
      coverage: 'National',
      specializations: ['Women Farmers', 'Youth Agriculture']
    },
    {
      bank: 'GTBank',
      partnershipDate: '2023-04-05',
      deployedAmount: '₦590M',
      utilizationRate: '87%',
      performanceScore: '8.3/10',
      activeLoans: '823',
      riskLevel: 'Medium',
      contactPerson: 'Mr. David Okafor',
      email: 'david.okafor@gtbank.com',
      phone: '+234 805 321 0987',
      branches: '87',
      coverage: 'National',
      specializations: ['Technology Innovation', 'Post-Harvest Management']
    }
  ];

  const partnershipMetrics = [
    { metric: 'Total Partnership Value', value: '₦8.2B', trend: '+12%' },
    { metric: 'Average Loan Size', value: '₦2.8M', trend: '+8%' },
    { metric: 'Repayment Rate', value: '94.2%', trend: '+2.1%' },
    { metric: 'Processing Time', value: '7.3 days', trend: '-15%' },
    { metric: 'Customer Satisfaction', value: '4.6/5', trend: '+0.3' },
    { metric: 'Digital Adoption', value: '78%', trend: '+12%' }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="💰" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">PFI Partners Management</h1>
          <p className="text-gray-200 font-serif">
            Manage partnerships with Participating Financial Institutions and monitor their performance in agricultural lending.
          </p>
        </div>

        {/* PFI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {pfiStats.map((stat, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{stat.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{stat.value}</p>
                  <p className="text-sm text-accent-400 font-serif">{stat.change}</p>
                </div>
                <div className="text-3xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PFI Partners Table */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">PFI Partners Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Bank</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Partnership Date</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Deployed Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Utilization</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Performance</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Active Loans</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {pfiDetails.map((pfi, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium font-sans text-gray-100">{pfi.bank}</p>
                        <p className="text-xs text-gray-400 font-serif">{pfi.contactPerson}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{pfi.partnershipDate}</td>
                    <td className="py-3 px-4 font-semibold font-sans text-accent-400">{pfi.deployedAmount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: pfi.utilizationRate }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{pfi.utilizationRate}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold font-sans text-green-400">{pfi.performanceScore}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{pfi.activeLoans}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pfi.riskLevel === 'Low' ? 'bg-green-500 text-white' :
                        pfi.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {pfi.riskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partnership Metrics */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Partnership Metrics</h3>
            <div className="space-y-4">
              {partnershipMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary-700 rounded-lg">
                  <div>
                    <p className="font-medium font-sans text-gray-100">{metric.metric}</p>
                    <p className="text-sm text-gray-300 font-serif">{metric.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold font-sans text-accent-400">{metric.trend}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PFI Specializations */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">PFI Specializations</h3>
            <div className="space-y-4">
              {pfiDetails.map((pfi, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <h4 className="font-medium font-sans text-gray-100 mb-2">{pfi.bank}</h4>
                  <div className="flex flex-wrap gap-2">
                    {pfi.specializations.map((spec, specIndex) => (
                      <span key={specIndex} className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-400 font-serif">
                    📍 {pfi.branches} branches • 🌍 {pfi.coverage} coverage
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PFI Contact Information */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">PFI Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pfiDetails.map((pfi, index) => (
              <div key={index} className="p-4 bg-primary-700 rounded-lg">
                <h4 className="font-semibold font-sans text-gray-100 mb-3">{pfi.bank}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-400 font-serif w-20">Contact:</span>
                    <span className="text-gray-100 font-sans">{pfi.contactPerson}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-serif w-20">Email:</span>
                    <span className="text-accent-400 font-sans">{pfi.email}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 font-serif w-20">Phone:</span>
                    <span className="text-gray-100 font-sans">{pfi.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="btn-primary">
              🏦 Add New PFI
            </button>
            <button className="btn-secondary">
              📊 Performance Review
            </button>
            <button className="btn-secondary">
              📈 Generate Report
            </button>
            <button className="btn-secondary">
              💰 Deploy Funds
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default PFIPartners;
