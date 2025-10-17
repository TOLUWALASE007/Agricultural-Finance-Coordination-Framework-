import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, contactPerson } from '../../../utils/quickActions';

const ResearcherFunding: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/researcher' },
    { id: 'research', name: 'Research Projects', icon: '🔬', href: '/portal/researcher/projects' },
    { id: 'data', name: 'Data Collection', icon: '📊', href: '/portal/researcher/data' },
    { id: 'publications', name: 'Publications', icon: '📚', href: '/portal/researcher/publications' },
    { id: 'collaborations', name: 'Collaborations', icon: '🤝', href: '/portal/researcher/collaborations' },
    { id: 'funding', name: 'Funding', icon: '💰', href: '/portal/researcher/funding' },
    { id: 'conferences', name: 'Conferences', icon: '🎓', href: '/portal/researcher/conferences' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/researcher/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/researcher/settings' }
  ];

  const fundingGrants = [
    {
      id: 'FUND-001',
      title: 'Climate-Smart Agriculture Research Grant',
      funder: 'Tertiary Education Trust Fund (TETFund)',
      amount: 5000000,
      currency: 'NGN',
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      status: 'Active',
      project: 'Impact of Climate-Smart Agriculture on Smallholder Farmer Productivity',
      principalInvestigator: 'Dr. Ahmadu Ibrahim',
      coInvestigators: 'Dr. Fatima Usman, Prof. John Okafor',
      progress: 45
    },
    {
      id: 'FUND-002',
      title: 'Digital Financial Inclusion Research',
      funder: 'Bill & Melinda Gates Foundation',
      amount: 150000,
      currency: 'USD',
      startDate: '2023-09-01',
      endDate: '2024-08-31',
      status: 'Active',
      project: 'Digital Financial Inclusion in Agricultural Value Chains',
      principalInvestigator: 'Dr. Maryam Abdullahi',
      coInvestigators: 'Dr. Ibrahim Musa',
      progress: 78
    },
    {
      id: 'FUND-003',
      title: 'Agricultural Technology Adoption Study',
      funder: 'African Development Bank (AfDB)',
      amount: 200000,
      currency: 'USD',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      status: 'Completed',
      project: 'Technology Adoption and Yield Improvement in Rice Farming',
      principalInvestigator: 'Dr. Amina Hassan',
      coInvestigators: 'Dr. Usman Garba',
      progress: 100
    }
  ];

  const fundingStats = [
    { label: 'Active Grants', value: '5', change: '+1', trend: 'up' },
    { label: 'Total Funding', value: '₦25.2M', change: '+₦5.1M', trend: 'up' },
    { label: 'Success Rate', value: '85%', change: '+10%', trend: 'up' },
    { label: 'Pending Applications', value: '3', change: '+1', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Researcher/Student" 
      roleIcon="🔬" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Funding</h1>
            <p className="text-gray-400 font-serif mt-2">Manage research funding and grant applications</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Funding Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Grant Application')}
            >
              ➕ New Application
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {fundingStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Research Funding</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Funders</option>
                <option>TETFund</option>
                <option>Bill & Melinda Gates Foundation</option>
                <option>African Development Bank</option>
                <option>World Bank</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Active</option>
                <option>Completed</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Funding', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Grant Title</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Funder</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Amount</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Duration</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fundingGrants.map((grant) => (
                  <tr key={grant.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{grant.title}</p>
                        <p className="text-sm text-gray-400 font-serif">{grant.project}</p>
                        <p className="text-xs text-gray-500 font-serif">PI: {grant.principalInvestigator}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{grant.funder}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">
                        {grant.currency === 'NGN' ? '₦' : '$'}{grant.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{grant.startDate}</p>
                        <p className="text-sm text-gray-400 font-serif">to {grant.endDate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-primary-700 rounded-full h-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: `${grant.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-100 font-sans text-sm">{grant.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        grant.status === 'Active' ? 'bg-green-500 text-white' :
                        grant.status === 'Completed' ? 'bg-blue-500 text-white' :
                        grant.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {grant.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Grant Details', grant.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Progress')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Generate Report')}
                        >
                          Report
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
              onClick={() => addNewRecord('Grant Application')}
            >
              💰 New Application
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Find Funding')}
            >
              🔍 Find Funding
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Track Progress')}
            >
              📈 Track Progress
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Funding Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ResearcherFunding;
