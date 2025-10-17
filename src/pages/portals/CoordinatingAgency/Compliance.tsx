import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Compliance: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/coordinating-agency/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const complianceItems = [
    {
      id: 'COMP-001',
      stakeholder: 'First Bank of Nigeria',
      requirement: 'Monthly Financial Report',
      status: 'Compliant',
      dueDate: '2024-01-31',
      lastSubmitted: '2024-01-28',
      score: 95
    },
    {
      id: 'COMP-002',
      stakeholder: 'Nigerian Agribusiness Ltd',
      requirement: 'Environmental Impact Assessment',
      status: 'Pending',
      dueDate: '2024-02-15',
      lastSubmitted: 'N/A',
      score: 0
    }
  ];

  const complianceStats = [
    { label: 'Total Requirements', value: '156', change: '+8', trend: 'up' },
    { label: 'Compliant', value: '142', change: '+5', trend: 'up' },
    { label: 'Pending', value: '12', change: '+2', trend: 'up' },
    { label: 'Non-Compliant', value: '2', change: '-1', trend: 'down' }
  ];

  return (
    <PortalLayout 
      role="Coordinating Agency" 
      roleIcon="🏛️" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Compliance</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor stakeholder compliance and regulatory requirements</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Compliance Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Compliance Check')}
            >
              ✅ New Check
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {complianceStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Compliance Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Requirement ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Stakeholder</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Requirement</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Due Date</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Score</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complianceItems.map((item) => (
                  <tr key={item.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{item.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{item.stakeholder}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{item.requirement}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'Compliant' ? 'bg-green-500 text-white' :
                        item.status === 'Pending' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{item.dueDate}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-100 font-sans">{item.score}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Compliance Details', item.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Verify Compliance')}
                        >
                          Verify
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
              onClick={() => processAction('Compliance Check')}
            >
              ✅ Compliance Check
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Compliance Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Audit Schedule')}
            >
              📅 Schedule Audit
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Compliance Requirement')}
            >
              📋 Add Requirement
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Compliance;
