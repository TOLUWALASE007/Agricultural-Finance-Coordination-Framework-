import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const CropInsurance: React.FC = () => {
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

  const insurancePolicies = [
    {
      id: 'INS-001',
      policyName: 'Rice Crop Insurance',
      crop: 'Rice',
      coverage: 500000,
      premium: 25000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      status: 'Active',
      claims: 0,
      insuranceCompany: 'Leadway Assurance',
      policyNumber: 'LW2024001'
    },
    {
      id: 'INS-002',
      policyName: 'Maize Crop Insurance',
      crop: 'Maize',
      coverage: 300000,
      premium: 15000,
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      status: 'Active',
      claims: 1,
      insuranceCompany: 'AIICO Insurance',
      policyNumber: 'AI2024002'
    },
    {
      id: 'INS-003',
      policyName: 'Cassava Crop Insurance',
      crop: 'Cassava',
      coverage: 200000,
      premium: 10000,
      startDate: '2024-02-01',
      endDate: '2024-10-31',
      status: 'Expired',
      claims: 0,
      insuranceCompany: 'AXA Mansard',
      policyNumber: 'AX2024003'
    }
  ];

  const insuranceStats = [
    { label: 'Active Policies', value: '2', change: '+1', trend: 'up' },
    { label: 'Total Coverage', value: '₦800K', change: '+₦200K', trend: 'up' },
    { label: 'Claims Made', value: '1', change: '+1', trend: 'up' },
    { label: 'Premium Paid', value: '₦40K', change: '+₦15K', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Crop Insurance</h1>
            <p className="text-gray-400 font-serif mt-2">Manage your crop insurance policies and claims</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Insurance Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Insurance Policy')}
            >
              ➕ New Policy
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {insuranceStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Insurance Policies</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Crops</option>
                <option>Rice</option>
                <option>Maize</option>
                <option>Cassava</option>
                <option>Wheat</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Expired</option>
                <option>Pending</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policy Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Crop</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Coverage</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Premium</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Insurance Company</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {insurancePolicies.map((policy) => (
                  <tr key={policy.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{policy.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{policy.policyName}</p>
                        <p className="text-sm text-gray-400 font-serif">Policy: {policy.policyNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{policy.crop}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{policy.coverage.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{policy.premium.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{policy.insuranceCompany}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        policy.status === 'Active' ? 'bg-green-500 text-white' :
                        policy.status === 'Expired' ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {policy.status}
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
                          onClick={() => processAction('File Claim')}
                        >
                          Claim
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Renew Policy')}
                        >
                          Renew
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
              🛡️ New Policy
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('File Claim')}
            >
              📋 File Claim
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Policy Renewal')}
            >
              🔄 Renew Policy
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Insurance Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CropInsurance;
