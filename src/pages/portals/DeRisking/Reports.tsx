import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails, exportData } from '../../../utils/quickActions';

const Reports: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/de-risking' },
    { id: 'funds', name: 'De-risking Funds', icon: '💰', href: '/portal/de-risking/funds' },
    { id: 'risk', name: 'Risk Assessment', icon: '📈', href: '/portal/de-risking/risk' },
    { id: 'guarantees', name: 'Guarantees', icon: '🛡️', href: '/portal/de-risking/guarantees' },
    { id: 'partners', name: 'Partners', icon: '🤝', href: '/portal/de-risking/partners' },
    { id: 'monitoring', name: 'Monitoring', icon: '📱', href: '/portal/de-risking/monitoring' },
    { id: 'reports', name: 'Reports', icon: '📊', href: '/portal/de-risking/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/de-risking/settings' }
  ];

  const reports = [
    {
      id: 'RPT-001',
      reportName: 'Monthly Guarantee Performance Report',
      reportType: 'Performance',
      frequency: 'Monthly',
      lastGenerated: '2024-01-15',
      nextScheduled: '2024-02-15',
      status: 'Generated',
      fileSize: '2.3 MB',
      recipients: ['Management', 'Partners', 'Regulators'],
      keyMetrics: ['Repayment Rate', 'Default Rate', 'Claims Ratio']
    },
    {
      id: 'RPT-002',
      reportName: 'Risk Assessment Summary',
      reportType: 'Risk Analysis',
      frequency: 'Quarterly',
      lastGenerated: '2024-01-10',
      nextScheduled: '2024-04-10',
      status: 'Generated',
      fileSize: '1.8 MB',
      recipients: ['Risk Committee', 'Board'],
      keyMetrics: ['Risk Exposure', 'Mitigation Effectiveness', 'Trend Analysis']
    },
    {
      id: 'RPT-003',
      reportName: 'Partner Performance Dashboard',
      reportType: 'Partner Analysis',
      frequency: 'Monthly',
      lastGenerated: '2024-01-20',
      nextScheduled: '2024-02-20',
      status: 'Generated',
      fileSize: '3.1 MB',
      recipients: ['Partnership Team', 'Management'],
      keyMetrics: ['Partner Score', 'Guarantee Utilization', 'Performance Rating']
    },
    {
      id: 'RPT-004',
      reportName: 'Annual De-risking Impact Report',
      reportType: 'Impact Assessment',
      frequency: 'Annually',
      lastGenerated: '2023-12-31',
      nextScheduled: '2024-12-31',
      status: 'Generated',
      fileSize: '5.2 MB',
      recipients: ['Stakeholders', 'Donors', 'Public'],
      keyMetrics: ['Funds Deployed', 'Farmers Reached', 'Economic Impact']
    }
  ];

  const reportStats = [
    { label: 'Total Reports', value: '24', change: '+3', trend: 'up' },
    { label: 'Generated This Month', value: '8', change: '+2', trend: 'up' },
    { label: 'Scheduled Reports', value: '16', change: '+1', trend: 'up' },
    { label: 'Report Accuracy', value: '98%', change: '+1%', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="De-risking Institution" 
      roleIcon="🛡️" 
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
              onClick={() => exportData('All Reports', 'ZIP')}
            >
              📦 Export All
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('Custom Report')}
            >
              ➕ New Report
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Report Management</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Performance</option>
                <option>Risk Analysis</option>
                <option>Partner Analysis</option>
                <option>Impact Assessment</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>Generated</option>
                <option>Scheduled</option>
                <option>Pending</option>
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
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Report ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Report Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Frequency</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Last Generated</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">File Size</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{report.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{report.reportName}</p>
                        <p className="text-sm text-gray-400 font-serif">Next: {report.nextScheduled}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.reportType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.frequency}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.lastGenerated}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{report.fileSize}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Generated' ? 'bg-green-500 text-white' :
                        report.status === 'Scheduled' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
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
                          onClick={() => generateReport(report.reportName, 'PDF')}
                        >
                          Generate
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => exportData(report.reportName, 'Excel')}
                        >
                          Export
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
              onClick={() => addNewRecord('Custom Report')}
            >
              📊 New Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Comprehensive Analytics', 'PDF')}
            >
              📈 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Schedule Reports')}
            >
              📅 Schedule
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Report Archive', 'ZIP')}
            >
              📦 Archive
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Reports;
