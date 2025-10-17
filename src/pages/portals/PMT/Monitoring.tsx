import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Monitoring: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/pmt' },
    { id: 'projects', name: 'Projects', icon: '📋', href: '/portal/pmt/projects' },
    { id: 'stakeholders', name: 'Stakeholders', icon: '👥', href: '/portal/pmt/stakeholders' },
    { id: 'monitoring', name: 'Monitoring & Evaluation', icon: '📈', href: '/portal/pmt/monitoring' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📊', href: '/portal/pmt/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/pmt/settings' }
  ];

  const monitoringItems = [
    {
      id: 'MON-001',
      project: 'Agricultural Finance Enhancement Initiative',
      kpi: 'Number of Beneficiaries',
      target: 1000,
      actual: 750,
      progress: 75,
      status: 'On Track',
      lastUpdate: '2024-01-15',
      nextReview: '2024-02-15',
      responsible: 'Dr. Sarah Johnson'
    },
    {
      id: 'MON-002',
      project: 'Smallholder Farmer Support Program',
      kpi: 'Loan Disbursement Rate',
      target: 80,
      actual: 65,
      progress: 81,
      status: 'At Risk',
      lastUpdate: '2024-01-12',
      nextReview: '2024-02-12',
      responsible: 'Mike Wilson'
    },
    {
      id: 'MON-003',
      project: 'Rural Development Acceleration',
      kpi: 'Project Completion Rate',
      target: 100,
      actual: 100,
      progress: 100,
      status: 'Completed',
      lastUpdate: '2023-12-31',
      nextReview: 'N/A',
      responsible: 'Grace Okonkwo'
    }
  ];

  const monitoringStats = [
    { label: 'Total KPIs', value: '156', change: '+12', trend: 'up' },
    { label: 'On Track', value: '89', change: '+8', trend: 'up' },
    { label: 'At Risk', value: '23', change: '+3', trend: 'up' },
    { label: 'Completed', value: '44', change: '+1', trend: 'up' }
  ];

  return (
    <PortalLayout 
      role="Project Management Team (PMT)" 
      roleIcon="📋" 
      sidebarItems={sidebarItems}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold font-sans text-gray-100">Monitoring & Evaluation</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor project performance and key indicators</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('M&E Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New KPI')}
            >
              ➕ Add KPI
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {monitoringStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Key Performance Indicators</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Projects</option>
                <option>Agricultural Finance Enhancement</option>
                <option>Smallholder Farmer Support</option>
                <option>Rural Development Acceleration</option>
              </select>
              <select className="input-field w-auto">
                <option>All Status</option>
                <option>On Track</option>
                <option>At Risk</option>
                <option>Completed</option>
                <option>Behind Schedule</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered KPIs', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">KPI ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Project</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">KPI</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Target vs Actual</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Progress</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitoringItems.map((item) => (
                  <tr key={item.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{item.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{item.project}</p>
                        <p className="text-sm text-gray-400 font-serif">Responsible: {item.responsible}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{item.kpi}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{item.actual}/{item.target}</p>
                        <p className="text-sm text-gray-400 font-serif">{item.progress}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.progress >= 100 ? 'bg-green-500' :
                              item.progress >= 75 ? 'bg-blue-500' :
                              item.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(item.progress, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{item.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'On Track' ? 'bg-green-500 text-white' :
                        item.status === 'At Risk' ? 'bg-yellow-500 text-white' :
                        item.status === 'Completed' ? 'bg-blue-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('KPI Details', item.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update KPI')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Review Progress')}
                        >
                          Review
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
              onClick={() => addNewRecord('KPI Monitoring')}
            >
              📈 New KPI
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('M&E Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Progress Review')}
            >
              🔍 Review
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Performance Assessment')}
            >
              📋 Assessment
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Monitoring;
