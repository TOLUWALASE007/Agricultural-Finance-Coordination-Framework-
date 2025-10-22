import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, exportData, processAction, scheduleAction } from '../../../utils/quickActions';

const ReportsAnalytics: React.FC = () => {
  const sidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊', href: '/portal/fund-provider' },
    { id: 'funds', name: 'Fund Management', icon: '₦', href: '/portal/fund-provider/funds' },
    { id: 'applications', name: 'Loan Applications', icon: '📋', href: '/portal/fund-provider/applications' },
    { id: 'reports', name: 'Reports & Analytics', icon: '📈', href: '/portal/fund-provider/reports' },
    { id: 'settings', name: 'Settings', icon: '⚙️', href: '/portal/fund-provider/settings' }
  ];

  const analyticsMetrics = [
    { title: 'Fund Utilization Rate', value: '87.3%', change: '+2.1%', icon: '📈', trend: 'up' },
    { title: 'Average Loan Size', value: '₦2.8M', change: '+₦150K', icon: '₦', trend: 'up' },
    { title: 'Repayment Rate', value: '94.2%', change: '+1.8%', icon: '✅', trend: 'up' },
    { title: 'Processing Time', value: '7.3 days', change: '-1.2 days', icon: '⏱️', trend: 'up' },
    { title: 'PFI Performance Score', value: '8.7/10', change: '+0.3', icon: '⭐', trend: 'up' },
    { title: 'Insurance Penetration', value: '76.4%', change: '+3.2%', icon: '🛡️', trend: 'up' }
  ];

  const fundPerformanceData = [
    { fund: 'Agricultural Credit Fund', deployed: '₦6.2B', target: '₦8.5B', utilization: '73%', performance: 'Good' },
    { fund: 'Climate Finance Fund', deployed: '₦2.1B', target: '₦3.2B', utilization: '66%', performance: 'Fair' },
    { fund: 'Women Farmer Fund', deployed: '₦1.8B', target: '₦2.1B', utilization: '86%', performance: 'Excellent' },
    { fund: 'Youth Agriculture Fund', deployed: '₦980M', target: '₦1.5B', utilization: '65%', performance: 'Fair' },
    { fund: 'Technology Innovation Fund', deployed: '₦450M', target: '₦800M', utilization: '56%', performance: 'Poor' }
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

  const monthlyTrends = [
    { month: 'Jan 2024', applications: '1,847', approvals: '1,456', amount: '₦2.1B', performance: '87%' },
    { month: 'Dec 2023', applications: '1,723', approvals: '1,389', amount: '₦1.9B', performance: '85%' },
    { month: 'Nov 2023', applications: '1,654', approvals: '1,298', amount: '₦1.8B', performance: '84%' },
    { month: 'Oct 2023', applications: '1,589', approvals: '1,234', amount: '₦1.7B', performance: '83%' },
    { month: 'Sep 2023', applications: '1,456', approvals: '1,123', amount: '₦1.5B', performance: '82%' }
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

        {/* Fund Performance Analysis */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Fund Performance Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Fund Name</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Deployed Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Target Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Utilization Rate</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Performance</th>
                </tr>
              </thead>
              <tbody>
                {fundPerformanceData.map((fund, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-gray-100">{fund.fund}</td>
                    <td className="py-3 px-4 text-accent-400 font-sans">{fund.deployed}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{fund.target}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-20 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: fund.utilization }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{fund.utilization}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        fund.performance === 'Excellent' ? 'bg-green-500 text-white' :
                        fund.performance === 'Good' ? 'bg-blue-500 text-white' :
                        fund.performance === 'Fair' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>
                        {fund.performance}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Regional Analysis */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Regional Analysis</h3>
            <div className="space-y-3">
              {regionalAnalysis.map((region, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{region.region}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      region.performance === 'Excellent' ? 'bg-green-500 text-white' :
                      region.performance === 'Good' ? 'bg-blue-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {region.performance}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Applications</p>
                      <p className="font-semibold font-sans text-gray-100">{region.applications}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Amount</p>
                      <p className="font-semibold font-sans text-gray-100">{region.amount}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400 font-serif">Approval Rate</span>
                      <span className="text-accent-400 font-sans">{region.approval}</span>
                    </div>
                    <div className="w-full bg-primary-600 rounded-full h-2">
                      <div 
                        className="bg-accent-500 h-2 rounded-full" 
                        style={{ width: region.approval }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stakeholder Impact */}
          <div className="card">
            <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Stakeholder Impact Analysis</h3>
            <div className="space-y-3">
              {stakeholderImpact.map((stakeholder, index) => (
                <div key={index} className="p-3 bg-primary-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold font-sans text-gray-100">{stakeholder.stakeholder}</h4>
                    <span className="text-sm text-accent-400 font-sans">⭐ {stakeholder.satisfaction}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 font-serif">Beneficiaries</p>
                      <p className="font-semibold font-sans text-gray-100">{stakeholder.beneficiaries}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-serif">Amount</p>
                      <p className="font-semibold font-sans text-gray-100">{stakeholder.amount}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stakeholder.impact === 'High' ? 'bg-green-500 text-white' :
                      stakeholder.impact === 'Medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {stakeholder.impact} Impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="card">
          <h3 className="text-lg font-semibold font-sans text-gray-100 mb-4">Monthly Performance Trends</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-600">
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Month</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Applications</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Approvals</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold font-sans text-gray-100">Performance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyTrends.map((month, index) => (
                  <tr key={index} className="border-b border-primary-700">
                    <td className="py-3 px-4 font-medium font-sans text-gray-100">{month.month}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{month.applications}</td>
                    <td className="py-3 px-4 text-gray-300 font-serif">{month.approvals}</td>
                    <td className="py-3 px-4 text-accent-400 font-sans">{month.amount}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-primary-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-accent-500 h-2 rounded-full" 
                            style={{ width: month.performance }}
                          ></div>
                        </div>
                        <span className="text-gray-300 font-serif text-sm">{month.performance}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
      </div>
    </PortalLayout>
  );
};

export default ReportsAnalytics;
