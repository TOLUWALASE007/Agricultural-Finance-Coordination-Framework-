import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, exportData, processAction, scheduleAction } from '../../../utils/quickActions';

const ReportsAnalytics: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '💼', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Schemes', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const analyticsMetrics = [
    { title: 'Fund Recovery Rate', value: '87.3%', change: '+2.1%', icon: '📈', trend: 'up' },
    { title: 'Average Loan Size', value: '₦2.8M', change: '+₦150K', icon: '💼', trend: 'up' },
    { title: 'Repayment Rate', value: '94.2%', change: '+1.8%', icon: '✅', trend: 'up' }
  ];

  const fundPerformanceData = [
    { fund: 'Agricultural Credit Fund', deployed: '₦6.2B', target: '₦8.5B', recovery: '73%', performance: 'Good' },
    { fund: 'Climate Finance Fund', deployed: '₦2.1B', target: '₦3.2B', recovery: '66%', performance: 'Fair' },
    { fund: 'Women Farmer Fund', deployed: '₦1.8B', target: '₦2.1B', recovery: '86%', performance: 'Excellent' },
    { fund: 'Youth Agriculture Fund', deployed: '₦980M', target: '₦1.5B', recovery: '65%', performance: 'Fair' },
    { fund: 'Technology Innovation Fund', deployed: '₦450M', target: '₦800M', recovery: '56%', performance: 'Poor' }
  ];

  const regionalAnalysis = [
    { region: 'North Central', applications: '456', amount: '₦3.2B', approval: '89%', performance: 'Excellent' },
    { region: 'South West', applications: '389', amount: '₦2.8B', approval: '92%', performance: 'Excellent' },
    { region: 'North West', applications: '567', amount: '₦4.1B', approval: '87%', performance: 'Good' },
    { region: 'South East', applications: '234', amount: '₦1.5B', approval: '94%', performance: 'Excellent' },
    { region: 'North East', applications: '201', amount: '₦0.7B', approval: '85%', performance: 'Good' }
  ];

  const stakeholderImpact = [
    { stakeholder: 'Producer/Farmer', beneficiaries: '12,456', amount: '₦8.9B', impact: 'High', satisfaction: '4.6/5' },
    { stakeholder: 'Cooperative Group', beneficiaries: '2,345', amount: '₦2.1B', impact: 'High', satisfaction: '4.7/5' },
    { stakeholder: 'Anchor Companies', beneficiaries: '156', amount: '₦1.2B', impact: 'Medium', satisfaction: '4.4/5' },
    { stakeholder: 'Lead Firms', beneficiaries: '89', amount: '₦0.1B', impact: 'Medium', satisfaction: '4.3/5' }
  ];

  return (
    <PortalLayout role="Fund Provider" roleIcon="₦" sidebarItems={sidebarItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold font-sans mb-2">Reports & Analytics</h1>
          <p className="text-gray-200 font-serif">
            Comprehensive analytics and reporting on fund performance, stakeholder impact, and agricultural finance ecosystem health.
          </p>
        </div>

        {/* Analytics Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analyticsMetrics.map((metric, index) => (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 font-serif">{metric.title}</p>
                  <p className="text-2xl font-bold font-sans text-gray-100">{metric.value}</p>
                  <p className={`text-sm font-serif ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change}
                  </p>
                </div>
                <div className="text-3xl">{metric.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Fund Performance Analysis - Bar Chart */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Fund Performance Analysis</h3>
          <div className="space-y-4">
            {fundPerformanceData.map((fund, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium font-sans text-gray-100">{fund.fund}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fund.performance === 'Excellent' ? 'bg-green-500 text-white' :
                    fund.performance === 'Good' ? 'bg-blue-500 text-white' :
                    fund.performance === 'Fair' ? 'bg-yellow-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {fund.performance}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-serif w-20">Deployed:</span>
                  <div className="flex-1 bg-primary-600 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="bg-accent-500 h-full rounded-full flex items-center justify-end pr-2" 
                      style={{ width: fund.recovery }}
                    >
                      <span className="text-xs font-semibold text-white">{fund.deployed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-serif">
                  <span>Target: {fund.target}</span>
                  <span>Recovery: {fund.recovery}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Analysis - Vertical Bar Chart */}
          <div className="card">
            <h3 className="text-base sm:text-lg font-semibold font-sans text-gray-100 mb-8">Regional Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-end justify-between h-48 sm:h-56 md:h-64 gap-1 sm:gap-2 md:gap-3 border-b border-primary-600 pb-2">
                {regionalAnalysis.map((region, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 sm:gap-2 h-full justify-end min-w-0">
                    <div className="relative w-full flex flex-col items-center justify-end h-full">
                      <div className="absolute -top-4 sm:-top-6 text-[10px] sm:text-xs font-semibold text-accent-400 font-sans truncate max-w-full px-1">
                        {region.amount}
                      </div>
                      <div 
                        className="w-full bg-gradient-to-t from-accent-600 to-accent-400 rounded-t-lg transition-all hover:from-accent-500 hover:to-accent-300"
                        style={{ height: region.approval }}
                      ></div>
                    </div>
                    <div className="text-center w-full min-w-0">
                      <div className="text-[10px] sm:text-xs font-medium text-gray-100 font-sans truncate px-1">{region.region}</div>
                      <div className="text-[10px] sm:text-xs text-accent-400 font-sans">{region.approval}</div>
                      <span className={`inline-block mt-0.5 sm:mt-1 px-1 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium ${
                        region.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        region.performance === 'Good' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        {region.applications}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-400 font-serif">
                <span>📊 Applications</span>
                <span>₦ Amount</span>
                <span>✅ Approval Rate</span>
              </div>
            </div>
          </div>

          {/* Stakeholder Impact - Pie Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Stakeholder Impact Analysis</h3>
            <div className="flex flex-col items-center gap-6">
              {/* Pie Chart */}
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Producer/Farmer - 72% (8.9B out of 12.3B total) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="40"
                    strokeDasharray="361 439"
                    strokeDashoffset="0"
                    className="transition-all hover:stroke-width-45"
                  />
                  {/* Cooperative Group - 17% (2.1B) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="40"
                    strokeDasharray="86 714"
                    strokeDashoffset="-361"
                    className="transition-all hover:stroke-width-45"
                  />
                  {/* Anchor Companies - 10% (1.2B) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="40"
                    strokeDasharray="50 750"
                    strokeDashoffset="-447"
                    className="transition-all hover:stroke-width-45"
                  />
                  {/* Lead Firms - 1% (0.1B) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="40"
                    strokeDasharray="3 797"
                    strokeDashoffset="-497"
                    className="transition-all hover:stroke-width-45"
                  />
                  {/* Center circle for donut effect */}
                  <circle cx="100" cy="100" r="50" fill="#1e293b" />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold font-sans text-gray-100">₦12.3B</p>
                  <p className="text-xs text-gray-400 font-serif">Total Impact</p>
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {stakeholderImpact.map((stakeholder, index) => {
                  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
                  return (
                    <div key={index} className="flex items-center gap-2 p-2 bg-primary-700 rounded-lg">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: colors[index] }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium font-sans text-gray-100 truncate">{stakeholder.stakeholder}</p>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-accent-400 font-sans">{stakeholder.amount}</span>
                          <span className="text-xs text-gray-400 font-serif">⭐ {stakeholder.satisfaction}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-2xl font-bold font-sans text-gray-100">87%</p>
              <p className="text-sm text-gray-400 font-serif">Target Achievement</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">📈</div>
              <p className="text-2xl font-bold font-sans text-gray-100">+15%</p>
              <p className="text-sm text-gray-400 font-serif">Growth Rate</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">⭐</div>
              <p className="text-2xl font-bold font-sans text-gray-100">4.6/5</p>
              <p className="text-sm text-gray-400 font-serif">Satisfaction Score</p>
            </div>
            <div className="text-center p-4 bg-primary-700 rounded-lg">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-2xl font-bold font-sans text-gray-100">94%</p>
              <p className="text-sm text-gray-400 font-serif">Repayment Rate</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button 
              className="btn-primary"
              onClick={() => generateReport('Comprehensive Analytics Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-secondary"
              onClick={() => exportData('Analytics Data', 'Excel')}
            >
              📈 Export Data
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Custom Analytics Dashboard')}
            >
              📋 Custom Analytics
            </button>
            <button 
              className="btn-secondary"
              onClick={() => scheduleAction('Performance Target Setting', 'Next Month')}
            >
              🎯 Set Targets
            </button>
          </div>
        </div>
        <div className="mt-2 text-center text-xs text-gray-400 font-serif opacity-80">
          Powered by Mc. George
        </div>
      </div>
    </PortalLayout>
  );
};

export default ReportsAnalytics;
