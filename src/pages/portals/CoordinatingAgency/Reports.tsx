import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Reports: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/coordinating-agency' },
    { id: 'programs', name: 'Programs', icon: '🏛️', href: '/portal/coordinating-agency/programs' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '🤝', href: '/portal/coordinating-agency/stakeholders' },
    { id: 'compliance', name: 'Compliance', icon: '✅', href: '/portal/coordinating-agency/compliance' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/coordinating-agency/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/coordinating-agency/settings' }
  ];

  const reportTemplates = [
    {
      id: 'RPT-001',
      name: 'Program Performance Report',
      type: 'Performance',
      frequency: 'Monthly',
      lastGenerated: '2024-01-01',
      nextDue: '2024-02-01',
      status: 'Scheduled'
    },
    {
      id: 'RPT-002',
      name: 'Stakeholder Compliance Summary',
      type: 'Compliance',
      frequency: 'Quarterly',
      lastGenerated: '2023-12-31',
      nextDue: '2024-03-31',
      status: 'Pending'
    }
  ];

  const reportStats = [
    { label: 'Total Reports', value: '89', change: '+12', trend: 'up' },
    { label: 'Generated This Month', value: '15', change: '+3', trend: 'up' },
    { label: 'Pending Reports', value: '8', change: '-2', trend: 'down' },
    { label: 'Average Generation Time', value: '3.2 min', change: '-18%', trend: 'down' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Reports & Analytics</h1>
            <p className="text-gray-400 font-serif mt-2">Generate and manage comprehensive reports</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Custom Report', 'PDF')}
            >
              📊 Custom Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Report Template')}
            >
              ➕ New Template
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {reportStats.map((stat, index) => (
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
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Report Templates</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Template ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Report Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Frequency</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportTemplates.map((template) => (
                  <tr key={template.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{template.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{template.name}</p>
                        <p className="text-sm text-gray-400 font-serif">Next due: {template.nextDue}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{template.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{template.frequency}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        template.status === 'Generated' ? 'bg-green-500 text-white' :
                        template.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {template.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Report Details', template.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => generateReport(template.name, 'PDF')}
                        >
                          Generate
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Edit Template')}
                        >
                          Edit
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
              onClick={() => generateReport('Comprehensive Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Data Export', 'Excel')}
            >
              📈 Export Data
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Custom Analytics')}
            >
              📋 Custom Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => addNewRecord('Report Schedule')}
            >
              🎯 Set Schedule
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Reports;
