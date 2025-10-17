import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Policies: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'policies', name: 'Policies', icon: '🛡️', href: '/portal/insurance/policies' },
    { id: 'claims', name: 'Claims', icon: '📋', href: '/portal/insurance/claims' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/insurance/risk' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/insurance/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
  ];

  const policies = [
    {
      id: 'POL-001',
      policyNumber: 'AGR-INS-2024-001',
      policyholder: 'Adebayo Ogunlesi',
      farm: 'Green Valley Farms',
      policyType: 'Crop Insurance',
      coverage: 2500000,
      premium: 125000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      riskLevel: 'Medium',
      claims: 0,
      lastPayment: '2024-01-15'
    },
    {
      id: 'POL-002',
      policyNumber: 'AGR-INS-2024-002',
      policyholder: 'Fatima Ibrahim',
      farm: 'Ibrahim Farms',
      policyType: 'Equipment Insurance',
      coverage: 1800000,
      premium: 90000,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      status: 'Active',
      riskLevel: 'Low',
      claims: 1,
      lastPayment: '2024-01-15'
    },
    {
      id: 'POL-003',
      policyNumber: 'AGR-INS-2024-003',
      policyholder: 'Chinedu Okonkwo',
      farm: 'Okonkwo Enterprises',
      policyType: 'Livestock Insurance',
      coverage: 3200000,
      premium: 160000,
      startDate: '2024-02-01',
      endDate: '2024-12-31',
      status: 'Pending',
      riskLevel: 'High',
      claims: 0,
      lastPayment: 'N/A'
    }
  ];

  const policyStats = [
    { label: 'Total Policies', value: '247', change: '+18', trend: 'up' },
    { label: 'Active Policies', value: '189', change: '+12', trend: 'up' },
    { label: 'Total Coverage', value: '₦485M', change: '+25%', trend: 'up' },
    { label: 'Premium Income', value: '₦24.2M', change: '+15%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Insurance Company" 
      roleIcon="🛡️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Insurance Policies</h1>
            <p className="text-gray-400 font-serif mt-2">Manage agricultural insurance policies and coverage</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Policies Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Policy')}
            >
              ➕ New Policy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {policyStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Policy Portfolio</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Crop Insurance</option>
                <option>Equipment Insurance</option>
                <option>Livestock Insurance</option>
                <option>Property Insurance</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Expired</option>
                <option>Cancelled</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Policies', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policy ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policyholder</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policy Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Coverage</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Premium</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Level</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy) => (
                  <tr key={policy.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-accent-400 font-sans font-medium">{policy.id}</span>
                        <p className="text-xs text-gray-500 font-serif">{policy.policyNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{policy.policyholder}</p>
                        <p className="text-sm text-gray-400 font-serif">{policy.farm}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{policy.policyType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{policy.coverage.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{policy.premium.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'Active' ? 'bg-green-500 text-white' :
                        policy.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        policy.status === 'Expired' ? 'bg-gray-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.riskLevel === 'Low' ? 'bg-green-500 text-white' :
                        policy.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {policy.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Policy Details', policy.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Policy')}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Process Claim')}
                        >
                          Claim
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
              onClick={() => addNewRecord('Insurance Policy')}
            >
              🛡️ Issue Policy
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Claim Processing')}
            >
              📋 Process Claim
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment')}
            >
              📈 Risk Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Insurance Claims Report', 'PDF')}
            >
              📊 Generate Report
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Policies;
