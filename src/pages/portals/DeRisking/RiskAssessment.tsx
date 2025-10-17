import React from 'react';
import PortalLayout from '../../../components/PortalLayout';
import { generateReport, processAction, addNewRecord, viewDetails } from '../../../utils/quickActions';

const RiskAssessment: React.FC = () => {
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

  const riskAssessments = [
    {
      id: 'RA-001',
      assessmentName: 'Climate Risk Assessment - Northern Region',
      region: 'Northern States',
      riskType: 'Climate Risk',
      riskLevel: 'High',
      probability: 75,
      impact: 'High',
      mitigationStrategy: 'Weather Insurance',
      assessmentDate: '2024-01-15',
      nextReview: '2024-04-15',
      status: 'Active',
      affectedFarmers: 2500,
      estimatedLoss: 1500000000
    },
    {
      id: 'RA-002',
      assessmentName: 'Price Volatility Assessment - Rice Market',
      region: 'National',
      riskType: 'Price Risk',
      riskLevel: 'Medium',
      probability: 60,
      impact: 'Medium',
      mitigationStrategy: 'Price Floor Guarantee',
      assessmentDate: '2024-01-10',
      nextReview: '2024-03-10',
      status: 'Active',
      affectedFarmers: 1800,
      estimatedLoss: 800000000
    },
    {
      id: 'RA-003',
      assessmentName: 'Production Risk - Cassava Farmers',
      region: 'Southwest',
      riskType: 'Production Risk',
      riskLevel: 'Low',
      probability: 30,
      impact: 'Low',
      mitigationStrategy: 'Input Credit Support',
      assessmentDate: '2024-01-05',
      nextReview: '2024-06-05',
      status: 'Monitoring',
      affectedFarmers: 1200,
      estimatedLoss: 300000000
    }
  ];

  const riskStats = [
    { label: 'Total Assessments', value: '24', change: '+3', trend: 'up' },
    { label: 'High Risk Areas', value: '8', change: '+1', trend: 'up' },
    { label: 'Active Mitigations', value: '18', change: '+2', trend: 'up' },
    { label: 'Covered Farmers', value: '5,500', change: '+400', trend: 'up' }
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
            <h1 className="text-3xl font-bold font-sans text-gray-100">Risk Assessment</h1>
            <p className="text-gray-400 font-serif mt-2">Evaluate and assess agricultural risks across regions</p>
          </div>
          <div className="flex space-x-3">
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Risk Assessment Report', 'PDF')}
            >
              📊 Generate Report
            </button>
            <button 
              className="btn-primary"
              onClick={() => addNewRecord('New Assessment')}
            >
              ➕ New Assessment
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {riskStats.map((stat, index) => (
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
            <h3 className="text-lg font-semibold font-sans text-gray-100">Risk Assessment Dashboard</h3>
            <div className="flex space-x-2">
              <select className="input-field w-auto">
                <option>All Risk Types</option>
                <option>Climate Risk</option>
                <option>Price Risk</option>
                <option>Production Risk</option>
                <option>Market Risk</option>
              </select>
              <select className="input-field w-auto">
                <option>All Risk Levels</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <button 
                className="btn-secondary"
                onClick={() => viewDetails('Filtered Assessments', 'CUSTOM')}
              >
                🔍 Filter
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Assessment ID</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Assessment Name</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Region</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Type</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Risk Level</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Probability</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskAssessments.map((assessment) => (
                  <tr key={assessment.id} className="border-b border-primary-700">
                    <td className="py-3 px-4">
                      <span className="text-accent-400 font-sans font-medium">{assessment.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans font-medium">{assessment.assessmentName}</p>
                        <p className="text-sm text-gray-400 font-serif">Next Review: {assessment.nextReview}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{assessment.region}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-serif">{assessment.riskType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.riskLevel === 'High' ? 'bg-red-500 text-white' :
                        assessment.riskLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                        'bg-green-500 text-white'
                      }`}>
                        {assessment.riskLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-gray-100 font-sans">{assessment.probability}%</p>
                        <p className="text-sm text-gray-400 font-serif">Impact: {assessment.impact}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        assessment.status === 'Active' ? 'bg-green-500 text-white' :
                        assessment.status === 'Monitoring' ? 'bg-blue-500 text-white' :
                        'bg-gray-500 text-white'
                      }`}>
                        {assessment.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          className="text-accent-400 hover:text-accent-300 text-sm font-sans"
                          onClick={() => viewDetails('Assessment Details', assessment.id)}
                        >
                          View
                        </button>
                        <button 
                          className="text-blue-400 hover:text-blue-300 text-sm font-sans"
                          onClick={() => processAction('Update Assessment')}
                        >
                          Update
                        </button>
                        <button 
                          className="text-green-400 hover:text-green-300 text-sm font-sans"
                          onClick={() => processAction('Mitigation Strategy')}
                        >
                          Mitigate
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
              onClick={() => addNewRecord('Risk Assessment')}
            >
              📈 New Assessment
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Risk Monitoring')}
            >
              📊 Monitor Risks
            </button>
            <button 
              className="btn-secondary"
              onClick={() => processAction('Mitigation Planning')}
            >
              🛡️ Plan Mitigation
            </button>
            <button 
              className="btn-secondary"
              onClick={() => generateReport('Risk Analytics', 'Excel')}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default RiskAssessment;
