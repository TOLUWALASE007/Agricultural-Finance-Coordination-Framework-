import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, viewDetails, exportData } from '../../../utils/quickActions';

const InsuranceClaims: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💰', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'pfis', name: 'PFI Partners', icon: '🏦', href: '/portal/fund-provider/pfis' },
    { id: 'insurance', name: 'Insurance Claims', icon: '🛡️', href: '/portal/fund-provider/insurance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const insuranceStats = [
    { title: 'Total Claims', value: '1,247', change: '+89', icon: '🛡️' },
    { title: 'Claims Value', value: '₦2.1B', change: '+₦180M', icon: '💰' },
    { title: 'Approved Claims', value: '1,089', change: '+67', icon: '✅' },
    { title: 'Average Processing', value: '12 days', change: '-2 days', icon: '⏱️' }
  ];

  const recentClaims = [
    {
      claimId: 'CLM-2024-001',
      producer: 'John Doe Farms',
      amount: '₦2.5M',
      cause: 'Flood Damage',
      location: 'Kano State',
      date: '2024-01-15',
      status: 'Approved',
      insuranceCompany: 'Leadway Assurance',
      cropType: 'Maize',
      acreage: '15 hectares',
      loanReference: 'APP-2024-001'
    },
    {
      claimId: 'CLM-2024-002',
      producer: 'Sarah Agricultural Coop',
      amount: '₦1.8M',
      cause: 'Drought',
      location: 'Kaduna State',
      date: '2024-01-14',
      status: 'Under Review',
      insuranceCompany: 'AIICO Insurance',
      cropType: 'Rice',
      acreage: '12 hectares',
      loanReference: 'APP-2024-002'
    },
    {
      claimId: 'CLM-2024-003',
      producer: 'Kano Youth Farmers',
      amount: '₦950K',
      cause: 'Pest Attack',
      location: 'Kano State',
      date: '2024-01-13',
      status: 'Approved',
      insuranceCompany: 'Cornerstone Insurance',
      cropType: 'Vegetables',
      acreage: '8 hectares',
      loanReference: 'APP-2024-003'
    },
    {
      claimId: 'CLM-2024-004',
      producer: 'Women Farmers Association',
      amount: '₦3.2M',
      cause: 'Disease Outbreak',
      location: 'Ogun State',
      date: '2024-01-12',
      status: 'Pending',
      insuranceCompany: 'AXA Mansard',
      cropType: 'Cassava',
      acreage: '20 hectares',
      loanReference: 'APP-2024-004'
    }
  ];

  const claimsByType = [
    { type: 'Flood Damage', count: '456', amount: '₦850M', percentage: '40%', trend: '+12%' },
    { type: 'Drought', count: '389', amount: '₦620M', percentage: '29%', trend: '+8%' },
    { type: 'Pest Attack', count: '234', amount: '₦480M', percentage: '23%', trend: '-5%' },
    { type: 'Disease Outbreak', count: '168', amount: '₦150M', percentage: '8%', trend: '+3%' }
  ];

  const insuranceCompanies = [
    {
      company: 'Leadway Assurance',
      totalClaims: '456',
      approvedClaims: '398',
      approvalRate: '87%',
      averageAmount: '₦2.1M',
      responseTime: '8 days',
      rating: '4.8/5'
    },
    {
      company: 'AIICO Insurance',
      totalClaims: '389',
      approvedClaims: '345',
      approvalRate: '89%',
      averageAmount: '₦1.9M',
      responseTime: '10 days',
      rating: '4.6/5'
    },
    {
      company: 'Cornerstone Insurance',
      totalClaims: '234',
      approvedClaims: '201',
      approvalRate: '86%',
      averageAmount: '₦1.7M',
      responseTime: '12 days',
      rating: '4.4/5'
    },
    {
      company: 'AXA Mansard',
      totalClaims: '168',
      approvedClaims: '145',
      approvalRate: '86%',
      averageAmount: '₦2.3M',
      responseTime: '9 days',
      rating: '4.7/5'
    }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="💰" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Insurance Claims Management</h1>
          <p className="text-gray-200 font-serif">
            Monitor insurance claims from producers and track the performance of insurance partners in protecting agricultural investments.
          </p>
        </div>

        {/* Insurance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {insuranceStats.map((stat, index) => (
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

        {/* Recent Claims */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Claims</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Claim ID</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Producer</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Cause</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Location</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Insurance Co.</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentClaims.map((claim, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-accent-400">{claim.claimId}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium font-sans text-gray-100">{claim.producer}</p>
                        <p className="text-xs text-gray-400 font-serif">{claim.cropType} • {claim.acreage}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold font-sans text-gray-100">{claim.amount}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{claim.cause}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{claim.location}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{claim.insuranceCompany}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'Approved' ? 'bg-green-500 text-white' :
                        claim.status === 'Under Review' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Claims by Type */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Claims by Type</h3>
            <div className="space-y-4">
              {claimsByType.map((claimType, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{claimType.type}</h4>
                    <span className="text-sm text-accent-400 font-sans">{claimType.trend}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-400 font-serif">Claims Count</p>
                      <p className="font-semibold font-sans text-gray-100">{claimType.count}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Total Amount</p>
                      <p className="font-semibold font-sans text-gray-100">{claimType.amount}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400 font-serif">Percentage</span>
                    <span className="text-accent-400 font-sans">{claimType.percentage}</span>
                  </div>
                  <div className="w-full bg-primary-600 rounded-full h-2">
                    <div 
                      className="bg-accent-500 h-2 rounded-full" 
                      style={{ width: claimType.percentage }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insurance Companies Performance */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Insurance Companies Performance</h3>
            <div className="space-y-3">
              {insuranceCompanies.map((company, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{company.company}</h4>
                    <span className="text-sm text-accent-400 font-sans">⭐ {company.rating}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Total Claims</p>
                      <p className="font-semibold font-sans text-gray-100">{company.totalClaims}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Approval Rate</p>
                      <p className="font-semibold font-sans text-gray-100">{company.approvalRate}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Avg Amount</p>
                      <p className="font-semibold font-sans text-gray-100">{company.averageAmount}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Response Time</p>
                      <p className="font-semibold font-sans text-gray-100">{company.responseTime}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Claims Processing Flow */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Claims Processing Flow</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,247</p>
              <p className="text-sm text-gray-400 font-serif">Claims Submitted</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-2xl font-bold font-sans text-gray-100">234</p>
              <p className="text-sm text-gray-400 font-serif">Under Investigation</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-2xl font-bold font-sans text-gray-100">1,089</p>
              <p className="text-sm text-gray-400 font-serif">Approved</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-2xl font-bold font-sans text-gray-100">987</p>
              <p className="text-sm text-gray-400 font-serif">Paid Out</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">❌</div>
              <p className="text-2xl font-bold font-sans text-gray-100">158</p>
              <p className="text-sm text-gray-400 font-serif">Rejected</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Claims Review')}
            >
              🛡️ Review Claims
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Insurance Claims Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => viewDetails('Insurance Partners', 'ALL')}
            >
              🏢 Insurance Partners
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Claims Analytics', 'Excel')}
            >
              📈 Analytics Dashboard
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default InsuranceClaims;
