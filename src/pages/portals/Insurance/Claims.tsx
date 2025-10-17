import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Claims: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/insurance' },
    { id: 'policies', name: 'Policies', icon: '🛡️', href: '/portal/insurance/policies' },
    { id: 'claims', name: 'Claims', icon: '📋', href: '/portal/insurance/claims' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/insurance/risk' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/insurance/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/insurance/settings' }
  ];

  const claims = [
    {
      id: 'CLM-001',
      claimNumber: 'CLM-2024-001',
      policyholder: 'Adebayo Ogunlesi',
      policyNumber: 'AGR-INS-2024-001',
      claimType: 'Crop Loss',
      claimAmount: 250000,
      incidentDate: '2024-01-10',
      reportedDate: '2024-01-15',
      status: 'Under Review',
      assessor: 'John Smith',
      estimatedSettlement: 200000,
      documents: 8,
      missingDocs: 2
    },
    {
      id: 'CLM-002',
      claimNumber: 'CLM-2024-002',
      policyholder: 'Fatima Ibrahim',
      policyNumber: 'AGR-INS-2024-002',
      claimType: 'Equipment Damage',
      claimAmount: 180000,
      incidentDate: '2024-01-08',
      reportedDate: '2024-01-12',
      status: 'Approved',
      assessor: 'Sarah Johnson',
      estimatedSettlement: 180000,
      documents: 10,
      missingDocs: 0
    },
    {
      id: 'CLM-003',
      claimNumber: 'CLM-2024-003',
      policyholder: 'Chinedu Okonkwo',
      policyNumber: 'AGR-INS-2024-003',
      claimType: 'Livestock Loss',
      claimAmount: 320000,
      incidentDate: '2024-01-20',
      reportedDate: '2024-01-22',
      status: 'Pending Documentation',
      assessor: 'Mike Wilson',
      estimatedSettlement: 280000,
      documents: 6,
      missingDocs: 4
    }
  ];

  const claimStats = [
    { label: 'Total Claims', value: '89', change: '+12', trend: 'up' },
    { label: 'Under Review', value: '23', change: '+5', trend: 'up' },
    { label: 'Approved', value: '45', change: '+8', trend: 'up' },
    { label: 'Total Payout', value: '₦12.5M', change: '+18%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Insurance Claims</h1>
            <p className="text-gray-400 font-serif mt-2">Process and manage insurance claims</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Claims Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Claim')}
            >
              ➕ New Claim
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {claimStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Claims Processing</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Crop Loss</option>
                <option>Equipment Damage</option>
                <option>Livestock Loss</option>
                <option>Property Damage</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Pending Documentation</option>
                <option>Rejected</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Claims', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Claim ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Policyholder</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Claim Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Assessor</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Documents</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim) => (
                  <tr key={claim.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <span className="text-accent-400 font-sans font-medium">{claim.id}</span>
                        <p className="text-xs text-gray-500 font-serif">{claim.claimNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{claim.policyholder}</p>
                        <p className="text-sm text-gray-400 font-serif">{claim.policyNumber}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{claim.claimType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">₦{claim.claimAmount.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-serif">Est: ₦{claim.estimatedSettlement.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        claim.status === 'Approved' ? 'bg-green-500 text-white' :
                        claim.status === 'Under Review' ? 'bg-yellow-500 text-white' :
                        claim.status === 'Pending Documentation' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{claim.assessor}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-gray-300 font-serif text-sm">
                          {claim.documents}/{claim.documents + claim.missingDocs}
                        </span>
                        {claim.missingDocs > 0 && (
                          <span className="ml-2 text-red-400 text-xs">
                            ({claim.missingDocs} missing)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Claim Details', claim.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Review Documents')}
                        >
                          Docs
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Process Claim')}
                        >
                          Process
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
              onClick={() => addNewRecord('Insurance Claim')}
            >
              🛡️ New Claim
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Claims Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Claims Processing')}
            >
              📋 Process
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Settlement')}
            >
              💰 Settle
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Claims;
