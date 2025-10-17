import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const ExtensionReports: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/extension' },
    { id: 'farmers', name: 'Farmers', icon: '🌾', href: '/portal/extension/farmers' },
    { id: 'training', name: 'Training Programs', icon: '🎓', href: '/portal/extension/training' },
    { id: 'advisory', name: 'Advisory Services', icon: '💡', href: '/portal/extension/advisory' },
    { id: 'tech', name: 'Technology Transfer', icon: '🔬', href: '/portal/extension/tech' },
    { id: 'monitoring', name: 'Field Monitoring', icon: '📱', href: '/portal/extension/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/extension/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/extension/settings' }
  ];

  const reportCategories = [
    {
      id: 'RPT-001',
      name: 'Extension Services Impact Report',
      type: 'Impact Assessment',
      period: 'Quarterly',
      lastGenerated: '2024-01-15',
      status: 'Available',
      description: 'Comprehensive assessment of extension services impact on farmer productivity'
    },
    {
      id: 'RPT-002',
      name: 'Training Program Effectiveness',
      type: 'Training',
      period: 'Annual',
      lastGenerated: '2023-12-31',
      status: 'Available',
      description: 'Evaluation of training programs and their effectiveness in improving farmer skills'
    },
    {
      id: 'RPT-003',
      name: 'Technology Adoption Report',
      type: 'Technology',
      period: 'Monthly',
      lastGenerated: '2024-01-20',
      status: 'Available',
      description: 'Analysis of technology adoption rates and farmer engagement'
    },
    {
      id: 'RPT-004',
      name: 'Field Monitoring Summary',
      type: 'Monitoring',
      period: 'Weekly',
      lastGenerated: '2024-01-22',
      status: 'Generating',
      description: 'Weekly summary of field monitoring activities and farmer progress'
    }
  ];

  const reportStats = [
    { label: 'Total Reports', value: '28', change: '+4', trend: 'up' },
    { label: 'This Month', value: '12', change: '+3', trend: 'up' },
    { label: 'Auto-Generated', value: '18', change: '+5', trend: 'up' },
    { label: 'Custom Reports', value: '10', change: '+2', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Extension Organization" 
      roleIcon="🌾" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Reports & Analytics</h1>
            <p className="text-gray-400 font-serif mt-2">Generate and manage extension services reports and analytics</p>
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
              onClick={() => addNewRecord('Schedule Report')}
            >
              ➕ Schedule Report
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
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-sans text-gray-100">Report Categories</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Impact Assessment</option>
                <option>Training</option>
                <option>Technology</option>
                <option>Monitoring</option>
              </select>
              <select className="input-field w-auto">
                <option>All Periods</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Reports', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Report Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Period</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Last Generated</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportCategories.map((report) => (
                  <tr key={report.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{report.name}</p>
                        <p className="text-sm text-gray-400 font-serif">{report.description}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.type}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.period}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.lastGenerated}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Available' ? 'bg-green-500 text-white' :
                        report.status === 'Generating' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Report Details', report.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => generateReport(report.name, 'PDF')}
                        >
                          Generate
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Schedule Report')}
                        >
                          Schedule
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
              onClick={() => generateReport('Impact Assessment', 'PDF')}
            >
              📊 Impact Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Training Effectiveness', 'Excel')}
            >
              🎓 Training Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Auto-Report')}
            >
              ⏰ Auto-Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Analytics Dashboard', 'PDF')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default ExtensionReports;
