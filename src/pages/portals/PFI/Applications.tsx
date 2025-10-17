import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Applications: React.FC = () => {
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

  const applications = [
    {
      id: 'APP-2024-001',
      producer: 'Adebayo Ogunlesi',
      farm: 'Green Valley Farms',
      amount: 750000,
      purpose: 'Input Purchase',
      status: 'Under Review',
      submittedDate: '2024-01-15',
      priority: 'High',
      documents: 8,
      missingDocs: 2
    },
    {
      id: 'APP-2024-002',
      producer: 'Fatima Ibrahim',
      farm: 'Ibrahim Farms',
      amount: 1200000,
      purpose: 'Equipment Purchase',
      status: 'Approved',
      submittedDate: '2024-01-12',
      priority: 'Medium',
      documents: 10,
      missingDocs: 0
    },
    {
      id: 'APP-2024-003',
      producer: 'Chinedu Okonkwo',
      farm: 'Okonkwo Enterprises',
      amount: 500000,
      purpose: 'Working Capital',
      status: 'Pending Documentation',
      submittedDate: '2024-01-18',
      priority: 'Low',
      documents: 6,
      missingDocs: 4
    },
    {
      id: 'APP-2024-004',
      producer: 'Aisha Mohammed',
      farm: 'Mohammed Agro',
      amount: 900000,
      purpose: 'Infrastructure',
      status: 'Rejected',
      submittedDate: '2024-01-10',
      priority: 'Medium',
      documents: 7,
      missingDocs: 3
    }
  ];

  const applicationStats = [
    { label: 'Total Applications', value: '127', change: '+18%', trend: 'up' },
    { label: 'Pending Review', value: '34', change: '+8%', trend: 'up' },
    { label: 'Approved This Month', value: '23', change: '+15%', trend: 'up' },
    { label: 'Average Processing Time', value: '4.2 days', change: '-12%', trend: 'down' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Applications</h1>
            <p className="text-gray-400 font-serif mt-2">Manage and track loan applications</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Applications Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Application')}
            >
              ➕ New Application
            </button>
          </div>
        </div>

        {/* Application Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {applicationStats.map((stat, index) => (
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

        {/* Applications Table */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">All Applications</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Under Review</option>
                <option>Approved</option>
                <option>Pending Documentation</option>
                <option>Rejected</option>
              </select>
              <select className="input-field w-auto">
                <option>All Priority</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Applications', 'CUSTOM')}
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Documents</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.priority === 'High' ? 'bg-red-500 text-white' :
                        application.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {application.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <span className="text-gray-300 font-serif text-sm">
                          {application.documents}/{application.documents + application.missingDocs}
                        </span>
                        {application.missingDocs > 0 && (
                          <span className="ml-2 text-red-400 text-xs">
                            ({application.missingDocs} missing)
                          </span>
                        )}
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
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Review Documents')}
                        >
                          Docs
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Process Application')}
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

        {/* Application Status Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Under Review</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">45%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Approved</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">30%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Pending Documentation</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">20%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 font-serif">Rejected</span>
                <div className="flex items-center">
                  <div className="w-24 bg-primary-600 rounded-full h-2 mr-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="text-gray-100 font-sans">5%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">Application APP-2024-002 approved</p>
                  <p className="text-xs text-gray-400 font-serif">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">New application received</p>
                  <p className="text-xs text-gray-400 font-serif">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">Documentation updated</p>
                  <p className="text-xs text-gray-400 font-serif">6 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-gray-100 font-sans">Application rejected</p>
                  <p className="text-xs text-gray-400 font-serif">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => processAction('Bulk Application Processing')}
            >
              📋 Bulk Process
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Application Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Document Verification')}
            >
              📄 Verify Docs
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Application Template')}
            >
              📝 Templates
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Applications;
