import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const Monitoring: React.FC = () => {
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

  const monitoringData = [
    {
      id: 'MON-001',
      monitoringType: 'Guarantee Performance',
      target: 'Access Bank PLC',
      metric: 'Repayment Rate',
      currentValue: 95.2,
      targetValue: 90.0,
      status: 'Above Target',
      lastUpdate: '2024-01-20',
      trend: 'up',
      alertLevel: 'Normal'
    },
    {
      id: 'MON-002',
      monitoringType: 'Risk Exposure',
      target: 'Northern Region',
      metric: 'Default Rate',
      currentValue: 3.8,
      targetValue: 5.0,
      status: 'Below Target',
      lastUpdate: '2024-01-19',
      trend: 'down',
      alertLevel: 'Normal'
    },
    {
      id: 'MON-003',
      monitoringType: 'Fund Utilization',
      target: 'Climate Risk Fund',
      metric: 'Deployment Rate',
      currentValue: 78.5,
      targetValue: 85.0,
      status: 'Below Target',
      lastUpdate: '2024-01-18',
      trend: 'up',
      alertLevel: 'Warning'
    },
    {
      id: 'MON-004',
      monitoringType: 'Claims Processing',
      target: 'All Partners',
      metric: 'Processing Time',
      currentValue: 7.2,
      targetValue: 10.0,
      status: 'Above Target',
      lastUpdate: '2024-01-17',
      trend: 'down',
      alertLevel: 'Normal'
    }
  ];

  const monitoringStats = [
    { label: 'Active Monitors', value: '24', change: '+3', trend: 'up' },
    { label: 'Above Target', value: '18', change: '+2', trend: 'up' },
    { label: 'Alerts', value: '3', change: '-1', trend: 'down' },
    { label: 'Monitoring Coverage', value: '95%', change: '+2%', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Monitoring</h1>
            <p className="text-gray-400 font-serif mt-2">Monitor guarantee performance and risk metrics</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Monitoring Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Monitor')}
            >
              ➕ Add Monitor
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Monitoring Dashboard</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Types</option>
                <option>Guarantee Performance</option>
                <option>Risk Exposure</option>
                <option>Fund Utilization</option>
                <option>Claims Processing</option>
              </select>
              <select className="input-field w-auto">
                <option>All Alert Levels</option>
                <option>Normal</option>
                <option>Warning</option>
                <option>Critical</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Monitors', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Monitor ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Target</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Metric</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Current Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Target Value</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {monitoringData.map((monitor) => (
                  <tr key={monitor.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{monitor.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{monitor.monitoringType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{monitor.target}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{monitor.metric}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{monitor.currentValue}%</p>
                        <p className="text-sm text-gray-400 font-serif">Last: {monitor.lastUpdate}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{monitor.targetValue}%</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          monitor.status === 'Above Target' ? 'bg-green-500 text-white' :
                          monitor.status === 'Below Target' ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {monitor.status}
                        </span>
                        <span className={`px-1 py-0.5 rounded text-xs ${
                          monitor.alertLevel === 'Normal' ? 'bg-green-100 text-green-800' :
                          monitor.alertLevel === 'Warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {monitor.alertLevel}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Monitor Details', monitor.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Monitor')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Generate Alert')}
                        >
                          Alert
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
              onClick={() => addNewRecord('Monitoring Setup')}
            >
              📱 New Monitor
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Performance Review')}
            >
              📊 Review
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Alert Management')}
            >
              🚨 Alerts
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Monitoring Analytics', 'Excel')}
            >
              📈 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Monitoring;
