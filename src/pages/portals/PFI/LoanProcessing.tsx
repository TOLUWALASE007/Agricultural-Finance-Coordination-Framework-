import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const LoanProcessing: React.FC = () => {
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

  const loanApplications = [
    {
      id: 'LA-2024-001',
      producer: 'Adebayo Ogunlesi',
      farm: 'Green Valley Farms',
      amount: 750000,
      purpose: 'Input Purchase',
      status: 'Under Review',
      submittedDate: '2024-01-15',
      anchor: 'Nigerian Agribusiness Ltd',
      riskScore: 65,
      creditScore: 720
    },
    {
      id: 'LA-2024-002',
      producer: 'Fatima Ibrahim',
      farm: 'Ibrahim Farms',
      amount: 1200000,
      purpose: 'Equipment Purchase',
      status: 'Approved',
      submittedDate: '2024-01-12',
      anchor: 'Agro-Allied Industries',
      riskScore: 45,
      creditScore: 780
    },
    {
      id: 'LA-2024-003',
      producer: 'Chinedu Okonkwo',
      farm: 'Okonkwo Enterprises',
      amount: 500000,
      purpose: 'Working Capital',
      status: 'Pending Documentation',
      submittedDate: '2024-01-18',
      anchor: 'Farm Fresh Ltd',
      riskScore: 70,
      creditScore: 680
    }
  ];

  const processingStats = [
    { label: 'Applications Received', value: '47', change: '+12%', trend: 'up' },
    { label: 'Under Review', value: '23', change: '+5%', trend: 'up' },
    { label: 'Approved Today', value: '8', change: '+25%', trend: 'up' },
    { label: 'Average Processing Time', value: '3.2 days', change: '-15%', trend: 'down' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Loan Processing</h1>
            <p className="text-gray-400 font-serif mt-2">Manage loan applications and processing workflow</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Loan Processing Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Loan Application Review')}
            >
              📋 Review Application
            </button>
          </div>
        </div>

        {/* Processing Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {processingStats.map((stat, index) => (
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

        {/* Loan Applications Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Recent Loan Applications</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Pending Documentation</option>
                <option>Rejected</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('All Applications', 'FILTERED')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Application ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Producer</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Purpose</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Score</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loanApplications.map((application) => (
                  <tr key={application.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{application.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{application.producer}</p>
                        <p className="text-sm text-gray-400 font-serif">{application.farm}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">₦{application.amount.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{application.purpose}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'Approved' ? 'bg-green-500 text-white' :
                        application.status === 'Under Review' ? 'bg-yellow-500 text-white' :
                        application.status === 'Pending Documentation' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {application.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              application.riskScore < 50 ? 'bg-green-500' :
                              application.riskScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${application.riskScore}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{application.riskScore}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Application Details', application.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Approve Application')}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-red-400 hover:text-red-300 text-sm font-sans"
                          onClick={() => processAction('Reject Application')}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing Workflow */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Processing Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📝</div>
              <p className="text-lg font-bold font-sans text-gray-100">Application</p>
              <p className="text-sm text-gray-400 font-serif">Received</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔍</div>
              <p className="text-lg font-bold font-sans text-gray-100">Review</p>
              <p className="text-sm text-gray-400 font-serif">Documentation</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-lg font-bold font-sans text-gray-100">Assessment</p>
              <p className="text-sm text-gray-400 font-serif">Risk & Credit</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-lg font-bold font-sans text-gray-100">Decision</p>
              <p className="text-sm text-gray-400 font-serif">Approve/Reject</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-lg font-bold font-sans text-gray-100">Disbursement</p>
              <p className="text-sm text-gray-400 font-serif">Fund Release</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Bulk Application Review')}
            >
              📋 Bulk Review
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Processing Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Assessment Update')}
            >
              📈 Risk Update
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Processing Workflow')}
            >
              ⚙️ Workflow
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default LoanProcessing;
